import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { z } from "zod"

import { clientKey, rateLimit } from "@/lib/booking/rate-limit"
import { sendEmail } from "@/lib/email/send"
import {
  applicationAlert,
  applicationConfirmation,
  type ApplicationEmailData,
} from "@/lib/email/templates"
import { createSupabaseAdminClient } from "@/lib/supabase/server"
import { CONTACT_DETAILS } from "@/components/constant"
import { AVAILABILITY, EXPERIENCE, LANGUAGES, TRANSPORT } from "@/app/careers/copy"

/**
 * Receives an open job application, stores it, then notifies.
 *
 * The row is committed before either email goes out, and that order is the
 * point: an application is the candidate pool Jackie works from, so a mail
 * provider outage must cost a notification and never the application. It also
 * makes the retention promise on /careers enforceable — an inbox keeps
 * everything forever and cannot show anyone what it deleted.
 *
 * Written to the same rules as /api/bookings:
 *
 *  · every field validated and length-capped before it reaches the database
 *  · rate limited, so the form cannot be used to flood the table or the inbox
 *  · honeypot answered with a plausible success rather than a 400
 *  · errors logged without the applicant's details
 *  · nothing echoed back beyond the reference
 */

const applicationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  city: z.string().trim().min(2).max(100),
  availability: z.enum(AVAILABILITY),
  experience: z.enum(EXPERIENCE),
  transport: z.enum(TRANSPORT),
  languages: z.array(z.enum(LANGUAGES)).min(1).max(LANGUAGES.length),
  motivation: z.string().trim().min(20).max(2000),
  /**
   * Must be true. This is the lawful basis for keeping the application on
   * file at all, so a false here is a genuine validation failure, not a
   * preference — literal(true) rejects it rather than quietly storing nothing.
   */
  consent: z.literal(true),
  language: z.enum(["nl", "en"]).default("nl"),
  /** Hidden field. See the note on the booking schema — never validated to
   *  a failing shape, because a 400 tells the bot which field to drop. */
  website: z.string().max(200).optional(),
})

/** Distinct prefix from booking references, so a glance at an inbox tells
 *  Jackie whether she is looking at a job or a job applicant. */
function applicationReference(): string {
  const alphabet = "ACDEFGHJKLMNPQRSTUVWXYZ23456789"
  const pick = () => alphabet[crypto.randomInt(alphabet.length)]
  return `APP-${Array.from({ length: 6 }, pick).join("")}`
}

export async function POST(request: Request) {
  // Three an hour. Generous for a person who mistypes their email and resends,
  // pointless for a script.
  const limit = rateLimit(`application:${clientKey(request)}`, 3, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many applications. Please try again later.", code: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    )
  }

  let input: z.infer<typeof applicationSchema>
  try {
    input = applicationSchema.parse(await request.json())
  } catch {
    // Not echoing which field failed, or its value.
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 })
  }

  if (input.website) {
    // Honeypot tripped. Look successful so the bot does not retry.
    return NextResponse.json({ ok: true, reference: applicationReference() })
  }

  const reference = applicationReference()

  // ---- store first ------------------------------------------------------
  const db = createSupabaseAdminClient()
  const { error: insertError } = await db.from("applications").insert({
    reference,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    city: input.city,
    availability: input.availability,
    experience: input.experience,
    transport: input.transport,
    languages: input.languages,
    motivation: input.motivation,
    language: input.language,
    // Consent was required to get past validation, so this is the moment it
    // was given. Retention counts from here.
    consent_at: new Date().toISOString(),
  })

  if (insertError) {
    console.error("[applications] insert failed:", insertError.code)
    return NextResponse.json(
      { error: "Could not save your application. Please try again or email us directly." },
      { status: 500 },
    )
  }

  const data: ApplicationEmailData = {
    reference,
    name: input.name,
    email: input.email,
    phone: input.phone,
    city: input.city,
    availability: input.availability,
    experience: input.experience,
    transport: input.transport,
    languages: input.languages,
    motivation: input.motivation,
    submittedAt: new Date(),
  }

  const alert = applicationAlert(data)
  const confirmation = applicationConfirmation(data, input.language)

  /*
    The row is committed, so email is best-effort from here — exactly as it is
    for a booking. Failing the request now would show an error to someone whose
    application is already safely in the dashboard, and invite them to send a
    second one. Both failures are logged instead; Jackie sees the application
    either way when she opens /residents/applications.
  */
  const [alertResult, confirmationResult] = await Promise.all([
    sendEmail({
      to: process.env.APPLICATION_NOTIFICATION_EMAIL ?? CONTACT_DETAILS.email,
      subject: alert.subject,
      html: alert.html,
      replyTo: input.email,
    }),
    sendEmail({
      to: input.email,
      subject: confirmation.subject,
      html: confirmation.html,
    }),
  ])

  if (!alertResult.ok) console.error("[applications] alert send failed:", alertResult.error)
  if (!confirmationResult.ok)
    console.error("[applications] confirmation send failed:", confirmationResult.error)

  return NextResponse.json({ ok: true, reference })
}
