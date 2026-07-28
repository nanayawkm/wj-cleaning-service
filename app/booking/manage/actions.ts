"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseAdminClient } from "@/lib/supabase/server"
import { loadBookingByToken, type ManagedBooking } from "@/lib/booking/manage"
import { BLOCKING_STATUSES, MIN_NOTICE_HOURS, TIMEZONE } from "@/lib/booking/config"
import { buildIcs } from "@/lib/email/ics"
import { sendEmail } from "@/lib/email/send"
import { cancellationNotice, customerConfirmation, type BookingEmailData } from "@/lib/email/templates"
import { CONTACT_DETAILS } from "@/components/constant"

/**
 * Both actions re-load the booking from the token rather than trusting
 * anything the form sent. A hidden field saying "booking id 42" is a request,
 * not a fact — the signature is the only thing that authorises a change.
 */

export type ActionResult = { ok: true } | { ok: false; error: string }

const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://wjcleaningservices.nl").replace(/\/$/, "")

function emailData(b: ManagedBooking, token: string): BookingEmailData {
  return {
    reference: b.reference,
    startsAt: b.startsAt,
    endsAt: b.endsAt,
    bandLabel: b.m2Label,
    lines: b.lines,
    subtotalCents: b.subtotalCents,
    discountCents: b.discountCents,
    totalCents: b.totalCents,
    customer: b.customer,
    notes: b.notes,
    manageUrl: `${siteUrl()}/booking/manage?token=${encodeURIComponent(token)}`,
  }
}

/* ------------------------------------------------------------------ cancel */

export async function cancelBooking(token: string): Promise<ActionResult> {
  const loaded = await loadBookingByToken(token)
  if (!loaded.ok) return { ok: false, error: "This link is no longer valid." }

  const b = loaded.booking
  if (!BLOCKING_STATUSES.includes(b.status as (typeof BLOCKING_STATUSES)[number])) {
    return { ok: false, error: "This booking is not active." }
  }

  const db = createSupabaseAdminClient()

  // Guarded on status as well as id: two taps on a slow connection must not
  // produce two cancellations, and must not resurrect a completed job.
  const { data, error } = await db
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", b.id)
    .in("status", BLOCKING_STATUSES as unknown as string[])
    .select("id")

  if (error) return { ok: false, error: "Could not cancel. Please call us." }
  if (!data?.length) return { ok: false, error: "This booking is not active." }

  // The slot is already free at this point: the exclusion constraint only
  // covers confirmed and rescheduled rows, so nothing else has to run.

  const d = emailData(b, token)
  await Promise.allSettled([
    sendEmail({
      to: b.customer.email,
      ...cancellationNotice(d, b.language),
    }),
    sendEmail({
      to: CONTACT_DETAILS.email,
      subject: `Cancelled by customer · ${b.reference}`,
      html: cancellationNotice(d, "en").html,
    }),
  ])

  revalidatePath("/booking/manage")
  return { ok: true }
}

/* -------------------------------------------------------------- reschedule */

export async function rescheduleBooking(
  token: string,
  startsAtISO: string,
): Promise<ActionResult> {
  const loaded = await loadBookingByToken(token)
  if (!loaded.ok) return { ok: false, error: "This link is no longer valid." }

  const b = loaded.booking
  if (!BLOCKING_STATUSES.includes(b.status as (typeof BLOCKING_STATUSES)[number])) {
    return { ok: false, error: "This booking is not active." }
  }

  const startsAt = new Date(startsAtISO)
  if (Number.isNaN(startsAt.getTime())) return { ok: false, error: "Invalid time." }

  // Re-check the notice window server-side. The picker greys out slots inside
  // it, but a greyed button is a courtesy, not a control.
  const noticeMs = MIN_NOTICE_HOURS * 3_600_000
  if (startsAt.getTime() - Date.now() < noticeMs) {
    return { ok: false, error: "That time is too soon. Please choose another." }
  }

  // Duration is carried over from the original booking, not recomputed: the
  // add-ons are not editable here, so the job is exactly as long as it was.
  const endsAt = new Date(startsAt.getTime() + b.durationMin * 60_000)
  const previousStart = b.startsAt

  const db = createSupabaseAdminClient()
  const { data, error } = await db
    .from("bookings")
    .update({
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "rescheduled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", b.id)
    .in("status", BLOCKING_STATUSES as unknown as string[])
    .select("id")

  // 23P01 is the exclusion constraint: somebody took this slot in the seconds
  // between the picker rendering and this update landing.
  if (error) {
    if ((error as { code?: string }).code === "23P01") {
      return { ok: false, error: "That time has just been taken. Please choose another." }
    }
    return { ok: false, error: "Could not move the booking. Please call us." }
  }
  if (!data?.length) return { ok: false, error: "This booking is not active." }

  const d: BookingEmailData = { ...emailData(b, token), startsAt, endsAt }
  const ics = buildIcs({
    uid: `${b.reference}@wjcleaningservices.nl`,
    startsAt,
    endsAt,
    summary: b.language === "nl" ? "Schoonmaak — WJ Cleaning Services" : "Cleaning — WJ Cleaning Services",
    description: b.language === "nl" ? `Referentie ${b.reference}` : `Reference ${b.reference}`,
    location: `${b.customer.street}, ${b.customer.postcode} ${b.customer.city}`,
    organiserEmail: CONTACT_DETAILS.email,
  })

  const wasLine = new Intl.DateTimeFormat(b.language === "nl" ? "nl-NL" : "en-GB", {
    timeZone: TIMEZONE,
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(previousStart)

  await Promise.allSettled([
    sendEmail({
      to: b.customer.email,
      ...customerConfirmation(d, b.language),
      attachments: [{ filename: "booking.ics", content: ics }],
    }),
    sendEmail({
      to: CONTACT_DETAILS.email,
      subject: `Moved by customer · ${b.reference}`,
      html: customerConfirmation(d, "en").html.replace(
        "<h1",
        `<p style="margin:0 0 12px;font-size:14px;color:#6b7280">Previously: ${wasLine}</p><h1`,
      ),
    }),
  ])

  revalidatePath("/booking/manage")
  return { ok: true }
}
