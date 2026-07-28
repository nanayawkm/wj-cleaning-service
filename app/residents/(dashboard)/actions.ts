"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { BLOCKING_STATUSES, TIMEZONE } from "@/lib/booking/config"
import { buildIcs } from "@/lib/email/ics"
import { sendEmail } from "@/lib/email/send"
import { cancellationNotice, customerConfirmation, type BookingEmailData } from "@/lib/email/templates"
import { CONTACT_DETAILS } from "@/components/constant"
import { signToken } from "@/lib/booking/tokens"

/**
 * Everything Jackie can do to a booking.
 *
 * These run under her own session, never the service-role key, so Row Level
 * Security decides whether each write is allowed. A signed-in account that is
 * not on the allowlist gets a failed update rather than a silent success.
 */

export type Result = { ok: true } | { ok: false; error: string }

const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://wjcleaningservices.nl").replace(/\/$/, "")

const refresh = () => {
  revalidatePath("/residents")
  revalidatePath("/residents/today")
  revalidatePath("/residents/customers")
}

/* ------------------------------------------------------------- job status */

export async function setBookingStatus(
  id: string,
  status: "completed" | "no_show" | "confirmed",
): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error) return { ok: false, error: "Could not update. Please try again." }
  if (!data?.length) return { ok: false, error: "Booking not found." }
  refresh()
  return { ok: true }
}

/* ------------------------------------------------------------------ money */

export async function setPaid(id: string, paid: boolean): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .update({ paid_at: paid ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error) return { ok: false, error: "Could not update. Please try again." }
  if (!data?.length) return { ok: false, error: "Booking not found." }
  refresh()
  return { ok: true }
}

/* ------------------------------------------------------------------ notes */

export async function saveAdminNote(id: string, note: string): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from("bookings")
    .update({ admin_notes: note.trim() || null, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { ok: false, error: "Could not save the note." }
  refresh()
  return { ok: true }
}

/* ------------------------------------------------- cancel on their behalf */

/** Loads just enough to build the customer's email. */
async function emailFor(id: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("bookings")
    .select(
      `id, reference, starts_at, ends_at, m2_label, subtotal_cents, discount_cents,
       total_cents, language, notes, duration_min, deep_cleaning,
       customers ( name, email, phone, street, postcode, city ),
       booking_addons ( name_en, price_cents )`,
    )
    .eq("id", id)
    .maybeSingle()
  if (!data) return null

  const c = (Array.isArray(data.customers) ? data.customers[0] : data.customers) as {
    name: string; email: string; phone: string; street: string; postcode: string; city: string
  } | null
  if (!c) return null

  const addons = (data.booking_addons ?? []) as { name_en: string; price_cents: number }[]
  const lang = (data.language === "nl" ? "nl" : "en") as "nl" | "en"

  const d: BookingEmailData = {
    reference: data.reference,
    startsAt: new Date(data.starts_at),
    endsAt: new Date(data.ends_at),
    bandLabel: data.m2_label ?? "",
    lines: [
      {
        label: lang === "nl" ? `Algemene schoonmaak · ${data.m2_label}` : `General cleaning · ${data.m2_label}`,
        cents: data.subtotal_cents - addons.reduce((s, a) => s + a.price_cents, 0),
      },
      ...addons.map((a) => ({ label: a.name_en, cents: a.price_cents })),
    ],
    subtotalCents: data.subtotal_cents,
    discountCents: data.discount_cents,
    totalCents: data.total_cents,
    customer: c,
    notes: data.notes,
    manageUrl: `${siteUrl()}/booking/manage?token=${encodeURIComponent(signToken(data.id, "manage", 120))}`,
  }
  return { d, lang, durationMin: data.duration_min, reference: data.reference, customer: c }
}

export async function adminCancel(id: string, notify: boolean): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  const ctx = notify ? await emailFor(id) : null

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .in("status", BLOCKING_STATUSES as unknown as string[])
    .select("id")

  if (error) return { ok: false, error: "Could not cancel." }
  if (!data?.length) return { ok: false, error: "This booking is not active." }

  // Slot is free the moment the status changes — the exclusion constraint only
  // covers confirmed and rescheduled rows.
  if (ctx) {
    await sendEmail({ to: ctx.customer.email, ...cancellationNotice(ctx.d, ctx.lang) }).catch(() => {})
  }
  refresh()
  return { ok: true }
}

/* --------------------------------------------- reschedule on their behalf */

export async function adminReschedule(
  id: string,
  startsAtISO: string,
  notify: boolean,
): Promise<Result> {
  const startsAt = new Date(startsAtISO)
  if (Number.isNaN(startsAt.getTime())) return { ok: false, error: "Invalid time." }

  const supabase = await createSupabaseServerClient()
  const { data: current } = await supabase
    .from("bookings")
    .select("duration_min, status")
    .eq("id", id)
    .maybeSingle()
  if (!current) return { ok: false, error: "Booking not found." }

  const endsAt = new Date(startsAt.getTime() + current.duration_min * 60_000)

  const { data, error } = await supabase
    .from("bookings")
    .update({
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "rescheduled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .in("status", BLOCKING_STATUSES as unknown as string[])
    .select("id")

  if (error) {
    if ((error as { code?: string }).code === "23P01") {
      return { ok: false, error: "That time clashes with another booking." }
    }
    return { ok: false, error: "Could not move the booking." }
  }
  if (!data?.length) return { ok: false, error: "This booking is not active." }

  if (notify) {
    const ctx = await emailFor(id)
    if (ctx) {
      const ics = buildIcs({
        uid: `${ctx.reference}@wjcleaningservices.nl`,
        startsAt,
        endsAt,
        summary: ctx.lang === "nl" ? "Schoonmaak — WJ Cleaning Services" : "Cleaning — WJ Cleaning Services",
        description: ctx.lang === "nl" ? `Referentie ${ctx.reference}` : `Reference ${ctx.reference}`,
        location: `${ctx.customer.street}, ${ctx.customer.postcode} ${ctx.customer.city}`,
        organiserEmail: CONTACT_DETAILS.email,
      })
      await sendEmail({
        to: ctx.customer.email,
        ...customerConfirmation(ctx.d, ctx.lang),
        attachments: [{ filename: "booking.ics", content: ics }],
      }).catch(() => {})
    }
  }
  refresh()
  return { ok: true }
}

/* -------------------------------------------------------- manual bookings */

export interface ManualBookingInput {
  name: string
  phone: string
  email: string
  street: string
  postcode: string
  city: string
  bandId: string
  deepCleaning: boolean
  washingUp: boolean
  startsAtISO: string
  notes: string
}

/**
 * A booking taken over the phone. It goes through the same tables and the same
 * overlap constraint as an online one — the calendar has to be the single
 * truth, or availability starts lying.
 */
export async function createManualBooking(input: ManualBookingInput): Promise<Result> {
  const supabase = await createSupabaseServerClient()

  if (!input.name.trim() || !input.street.trim() || !input.bandId || !input.startsAtISO) {
    return { ok: false, error: "Name, address, size and time are required." }
  }

  const startsAt = new Date(input.startsAtISO)
  if (Number.isNaN(startsAt.getTime())) return { ok: false, error: "Invalid time." }

  const [{ data: band }, { data: addons }] = await Promise.all([
    supabase.from("pricing_bands").select("id, label_en, base_cents, deep_cents").eq("id", input.bandId).maybeSingle(),
    supabase.from("addons").select("id, slug, name_en, price_cents, duration_min"),
  ])
  if (!band) return { ok: false, error: "Unknown size band." }

  const wash = (addons ?? []).find((a) => a.slug === "washing-up")
  const deep = (addons ?? []).find((a) => a.slug === "deep-cleaning")

  // Priced and timed server-side from the catalogue, exactly like the public
  // flow — never from anything the form supplied.
  let durationMin = 180
  let subtotal = band.base_cents
  if (input.deepCleaning) {
    subtotal += band.deep_cents
    durationMin += deep?.duration_min ?? 60
  }
  if (input.washingUp && wash) {
    subtotal += wash.price_cents
    durationMin += wash.duration_min
  }
  const endsAt = new Date(startsAt.getTime() + durationMin * 60_000)

  const { data: customer, error: custErr } = await supabase
    .from("customers")
    .insert({
      name: input.name.trim(),
      email: input.email.trim() || `noemail+${Date.now()}@wjcleaningservices.nl`,
      phone: input.phone.trim(),
      street: input.street.trim(),
      postcode: input.postcode.trim(),
      city: input.city.trim() || CONTACT_DETAILS.city,
    })
    .select("id")
    .single()
  if (custErr || !customer) return { ok: false, error: "Could not save the customer." }

  const reference =
    "WJ-" + Array.from({ length: 6 }, () => "ACDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]).join("")

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      reference,
      customer_id: customer.id,
      band_id: band.id,
      m2_label: band.label_en,
      deep_cleaning: input.deepCleaning,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      duration_min: durationMin,
      status: "confirmed",
      subtotal_cents: subtotal,
      discount_cents: 0,
      total_cents: subtotal,
      language: "nl",
      notes: input.notes.trim() || null,
      manage_token: "manual",
      source: "manual",
    })
    .select("id")
    .single()

  if (error) {
    if ((error as { code?: string }).code === "23P01") {
      return { ok: false, error: "That time clashes with an existing booking." }
    }
    return { ok: false, error: "Could not save the booking." }
  }

  // Written after insert so the token can carry the real booking id.
  await supabase
    .from("bookings")
    .update({ manage_token: signToken(booking.id, "manage", 120) })
    .eq("id", booking.id)

  if (input.deepCleaning && deep) {
    await supabase.from("booking_addons").insert({
      booking_id: booking.id, addon_id: deep.id, name_en: deep.name_en, price_cents: band.deep_cents,
    })
  }
  if (input.washingUp && wash) {
    await supabase.from("booking_addons").insert({
      booking_id: booking.id, addon_id: wash.id, name_en: wash.name_en, price_cents: wash.price_cents,
    })
  }

  refresh()
  return { ok: true }
}

/* ------------------------------------------------------------------ export */

/** CSV of everything, for the bookkeeper. Generated server-side. */
export async function exportBookingsCsv(): Promise<{ ok: true; csv: string } | { ok: false; error: string }> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "reference, starts_at, ends_at, status, m2_label, deep_cleaning, total_cents, paid_at, source, customers(name, email, phone, street, postcode, city)",
    )
    .order("starts_at", { ascending: false })

  if (error) return { ok: false, error: "Could not export." }

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(new Date(iso)).replace(",", "")

  // Quote every field and double internal quotes — an address with a comma
  // would otherwise split into two columns.
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`

  const header = ["Reference","Start","End","Status","Paid","Size","Deep clean","Total EUR","Source","Name","Email","Phone","Street","Postcode","City"]
  const rows = (data ?? []).map((b) => {
    const c = b.customers as unknown as { name: string; email: string; phone: string; street: string; postcode: string; city: string } | null
    return [
      b.reference, fmt(b.starts_at), fmt(b.ends_at), b.status,
      b.paid_at ? "yes" : "no", b.m2_label, b.deep_cleaning ? "yes" : "no",
      (b.total_cents / 100).toFixed(2), b.source,
      c?.name, c?.email, c?.phone, c?.street, c?.postcode, c?.city,
    ].map(cell).join(",")
  })

  return { ok: true, csv: [header.map(cell).join(","), ...rows].join("\r\n") }
}
