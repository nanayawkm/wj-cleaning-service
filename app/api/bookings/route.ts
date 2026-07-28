import { NextResponse } from "next/server"
import { z } from "zod"

import { availabilityForDay } from "@/lib/booking/availability"
import { TRAVEL_BUFFER_MIN } from "@/lib/booking/config"
import { calculateQuote } from "@/lib/booking/pricing"
import {
  getAddons,
  getAvailabilityOverrides,
  getAvailabilityRules,
  getBusyIntervals,
  getDiscountCode,
  getPricingBands,
  hasBookedBefore,
} from "@/lib/booking/queries"
import { clientKey, rateLimit } from "@/lib/booking/rate-limit"
import { generateReference, signToken } from "@/lib/booking/tokens"
import { utcToZonedDateISO } from "@/lib/booking/time"
import { createSupabaseAdminClient } from "@/lib/supabase/server"
import { buildIcs } from "@/lib/email/ics"
import { sendEmail } from "@/lib/email/send"
import {
  customerConfirmation,
  ownerAlert,
  type BookingEmailData,
} from "@/lib/email/templates"
import { CONTACT_DETAILS } from "@/components/constant"

/**
 * Creates a booking.
 *
 * This endpoint receives a home address, so it is written defensively:
 *
 *  · every field is validated and length-capped before it reaches the database
 *  · the price is recomputed here; whatever the client posted is ignored
 *  · the chosen slot is re-checked against live availability, not trusted
 *  · the response echoes nothing back — reference and manage token only
 *  · errors are logged without the customer's details
 *  · rate limited, so the endpoint cannot be used to bulk-fill the calendar
 */

const bookingSchema = z.object({
  bandId: z.string().uuid(),
  deepCleaning: z.boolean(),
  addonSlugs: z.array(z.string().max(40)).max(5),
  startsAt: z.string().datetime(),
  discountCode: z.string().trim().max(40).optional().nullable(),
  language: z.enum(["nl", "en"]).default("nl"),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(6).max(40),
    street: z.string().trim().min(3).max(200),
    postcode: z.string().trim().min(4).max(20),
    city: z.string().trim().min(2).max(100),
  }),
  notes: z.string().trim().max(1000).optional().nullable(),
  marketingConsent: z.boolean().default(false),
  /**
   * Hidden field. Real people leave it empty; naive bots fill it in.
   * Accepts any value on purpose — validating it to max(0) made Zod reject the
   * request with a 400, which tells the bot exactly which field to drop.
   * It is handled below instead, by returning a convincing success.
   */
  website: z.string().max(200).optional(),
})

export async function POST(request: Request) {
  const limit = rateLimit(`booking:${clientKey(request)}`, 5, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    )
  }

  let input: z.infer<typeof bookingSchema>
  try {
    input = bookingSchema.parse(await request.json())
  } catch {
    // Deliberately not echoing which field failed, or its value.
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 })
  }

  if (input.website) {
    // Honeypot tripped. Look successful so the bot does not retry.
    return NextResponse.json({ ok: true, reference: generateReference() })
  }

  try {
    const [bands, addons] = await Promise.all([getPricingBands(), getAddons()])

    const band = bands.find((b) => b.id === input.bandId)
    if (!band) {
      return NextResponse.json({ error: "That size is no longer available." }, { status: 400 })
    }

    // ---- discount, validated server-side --------------------------------
    let discount: { code: string; percent_off: number } | null = null
    if (input.discountCode) {
      const found = await getDiscountCode(input.discountCode)
      if (found) {
        const returning = found.first_booking_only && (await hasBookedBefore(input.customer.email))
        if (!returning) discount = { code: found.code, percent_off: found.percent_off }
      }
      // An invalid or already-used code is silently ignored rather than
      // rejected: telling a caller "this email has booked before" would turn
      // the endpoint into a customer-enumeration oracle.
    }

    const quote = calculateQuote({
      band,
      deepCleaning: input.deepCleaning,
      addonSlugs: input.addonSlugs,
      addons,
      discount,
    })

    // ---- is the slot genuinely free? ------------------------------------
    const startsAt = new Date(input.startsAt)
    const dateISO = utcToZonedDateISO(startsAt)
    const [rules, overrides, busy] = await Promise.all([
      getAvailabilityRules(),
      getAvailabilityOverrides(dateISO, dateISO),
      getBusyIntervals(dateISO, dateISO),
    ])

    const day = availabilityForDay(dateISO, {
      rules,
      overrides,
      busy,
      durationMin: quote.durationMin,
      blockedMin: quote.blockedMin,
    })
    const slot = day.slots.find((s) => s.startsAtISO === startsAt.toISOString())

    if (!slot?.available) {
      return NextResponse.json(
        { error: "That time has just been taken. Please choose another.", code: "SLOT_TAKEN" },
        { status: 409 },
      )
    }

    // ---- write ----------------------------------------------------------
    const db = createSupabaseAdminClient()

    const { data: customer, error: customerError } = await db
      .from("customers")
      .insert({
        name: input.customer.name,
        email: input.customer.email.toLowerCase(),
        phone: input.customer.phone,
        street: input.customer.street,
        postcode: input.customer.postcode,
        city: input.customer.city,
        marketing_consent_at: input.marketingConsent ? new Date().toISOString() : null,
      })
      .select("id")
      .single()

    if (customerError || !customer) {
      console.error("[bookings] customer insert failed:", customerError?.code)
      return NextResponse.json({ error: "Could not save your booking." }, { status: 500 })
    }

    const reference = generateReference()
    const manageToken = signToken(crypto.randomUUID(), "manage", 120)

    const { data: booking, error: bookingError } = await db
      .from("bookings")
      .insert({
        reference,
        customer_id: customer.id,
        band_id: band.id,
        m2_label: band.label_nl,
        deep_cleaning: input.deepCleaning,
        starts_at: slot.startsAtISO,
        ends_at: slot.endsAtISO,
        duration_min: quote.durationMin,
        subtotal_cents: quote.subtotalCents,
        discount_cents: quote.discountCents,
        total_cents: quote.totalCents,
        discount_code: discount?.code ?? null,
        language: input.language,
        notes: input.notes || null,
        manage_token: manageToken,
      })
      .select("id")
      .single()

    if (bookingError || !booking) {
      // 23P01 is the exclusion constraint: someone booked it milliseconds ago.
      // The database is what makes this safe, not the check above.
      await db.from("customers").delete().eq("id", customer.id)

      if (bookingError?.code === "23P01") {
        return NextResponse.json(
          { error: "That time has just been taken. Please choose another.", code: "SLOT_TAKEN" },
          { status: 409 },
        )
      }
      console.error("[bookings] booking insert failed:", bookingError?.code)
      return NextResponse.json({ error: "Could not save your booking." }, { status: 500 })
    }

    // Re-sign now the real id exists, so the link cannot be guessed from it.
    const realToken = signToken(booking.id, "manage", 120)
    await db.from("bookings").update({ manage_token: realToken }).eq("id", booking.id)

    if (input.addonSlugs.length) {
      const rows = addons
        .filter((a) => input.addonSlugs.includes(a.slug) && a.slug !== "deep-cleaning")
        .map((a) => ({
          booking_id: booking.id,
          addon_id: a.id,
          name_en: a.name_en,
          price_cents: a.price_cents,
        }))
      if (rows.length) await db.from("booking_addons").insert(rows)
    }

    if (discount) {
      // Analytics only — a failure here must never cost the customer a booking.
      const { data: current } = await db
        .from("discount_codes")
        .select("times_used")
        .eq("code", discount.code)
        .maybeSingle()
      if (current) {
        await db
          .from("discount_codes")
          .update({ times_used: (current.times_used ?? 0) + 1 })
          .eq("code", discount.code)
      }
    }

    // ---- notify -----------------------------------------------------------
    // The booking is already committed. Email is best-effort from here: a
    // provider outage must not cost a confirmed appointment, so failures are
    // logged and the customer still gets their confirmation screen.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    const emailData: BookingEmailData = {
      reference,
      startsAt: new Date(slot.startsAtISO),
      // The customer's finish time, not slot.endsAtISO — that includes the
      // travel buffer, which is Jackie's, and would put 30 minutes of her
      // driving into the customer's calendar.
      endsAt: new Date(new Date(slot.startsAtISO).getTime() + quote.durationMin * 60_000),
      bandLabel: input.language === "nl" ? band.label_nl : band.label_en,
      lines: quote.lines.map((l) => ({
        label: input.language === "nl" ? l.label_nl : l.label_en,
        cents: l.cents,
      })),
      subtotalCents: quote.subtotalCents,
      discountCents: quote.discountCents,
      totalCents: quote.totalCents,
      customer: input.customer,
      notes: input.notes,
      manageUrl: `${siteUrl}/booking/manage?token=${encodeURIComponent(realToken)}`,
    }

    const ics = buildIcs({
      uid: `${reference}@wjcleaningservices.nl`,
      startsAt: emailData.startsAt,
      endsAt: emailData.endsAt,
      summary:
        input.language === "nl" ? "Schoonmaak — WJ Cleaning Services" : "Cleaning — WJ Cleaning Services",
      description: `${reference} · ${emailData.bandLabel}`,
      location: `${input.customer.street}, ${input.customer.postcode} ${input.customer.city}`,
      organiserEmail: CONTACT_DETAILS.email,
    })

    const confirmation = customerConfirmation(emailData, input.language)
    // /residents is the bookings list itself — there is no /residents/bookings, and
    // linking to one 404s Jackie straight out of her own notification email.
    const alert = ownerAlert(emailData, `${siteUrl}/residents`)

    await Promise.allSettled([
      sendEmail({
        to: input.customer.email,
        subject: confirmation.subject,
        html: confirmation.html,
        attachments: [{ filename: `${reference}.ics`, content: ics }],
      }),
      sendEmail({
        to: process.env.BOOKING_NOTIFICATION_EMAIL ?? CONTACT_DETAILS.email,
        subject: alert.subject,
        html: alert.html,
      }),
    ])

    // Only what the confirmation page needs. No address, no name, no email.
    return NextResponse.json({
      ok: true,
      reference,
      token: realToken,
      startsAt: slot.startsAtISO,
      endsAt: slot.endsAtISO,
      totalCents: quote.totalCents,
    })
  } catch (err) {
    console.error("[bookings] unexpected:", err instanceof Error ? err.message : "unknown")
    return NextResponse.json({ error: "Could not save your booking." }, { status: 500 })
  }
}
