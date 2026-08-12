import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { z } from "zod"

import { clientKey, rateLimit } from "@/lib/booking/rate-limit"
import { sendEmail } from "@/lib/email/send"
import { contactAlert, contactConfirmation, type ContactEmailData } from "@/lib/email/templates"
import { CONTACT_DETAILS } from "@/components/constant"
import { SERVICE_VALUES, serviceLabel } from "@/app/contact/services"

/**
 * Receives a contact enquiry and notifies.
 *
 * ## Why this exists
 *
 * It did not, and the form did not either. `contact/page.tsx` carried a bare
 * `<form>` with no `onSubmit`, no `action`, and no route behind it, so pressing
 * "Send message" navigated to `/contact?fullName=…` and threw the enquiry away.
 * It failed silently and looked like success, which is the worst shape a bug
 * can take on a conversion path — nobody reports it, because from the outside
 * nothing went wrong. Every commercial enquiry since launch is gone.
 *
 * ## What it deliberately does not do
 *
 * It does **not** write to the database, unlike `/api/bookings` and
 * `/api/applications`. Those two persist first and notify second, because a
 * booking is an obligation and an application is a candidate pool — losing
 * either to a mail outage is unacceptable. An enquiry is a conversation that
 * has not started yet, and giving it a table means a migration, a retention
 * policy and a dashboard screen to read it in. None of that exists yet, and
 * shipping the email path today beats shipping nothing while it gets designed.
 *
 * The consequence is stated plainly rather than hidden: **if Resend is down,
 * the enquiry is lost.** The client is told the send failed and is pointed at
 * the phone number, so at least the sender knows. That is a real trade and the
 * honest fix is a `contact_enquiries` table — see RESPONSIVENESS.md.
 *
 * Otherwise written to the same rules as `/api/applications`:
 *
 *  · every field validated and length-capped before it is used
 *  · rate limited, so the form cannot be used to flood the inbox
 *  · honeypot answered with a plausible success rather than a 400
 *  · errors logged without the sender's details
 *  · nothing echoed back beyond the reference
 */

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  /** Optional on the form. Empty string normalises to undefined, not "". */
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v : undefined)),
  service: z.enum(SERVICE_VALUES),
  message: z.string().trim().min(10).max(2000),
  language: z.enum(["nl", "en"]).default("nl"),
  /** Hidden field. Never validated to a failing shape — a 400 would tell a bot
   *  which field to drop. See the note on the application schema. */
  website: z.string().max(200).optional(),
})

/** Distinct prefix again, so an inbox glance separates enquiries from bookings
 *  and applications without opening anything. */
function contactReference(): string {
  const alphabet = "ACDEFGHJKLMNPQRSTUVWXYZ23456789"
  const pick = () => alphabet[crypto.randomInt(alphabet.length)]
  return `ENQ-${pick()}${pick()}${pick()}${pick()}`
}

export async function POST(request: Request) {
  // Five an hour from one address. An enquiry is a considered act; nobody
  // legitimately sends a sixth, and the limit costs a real sender nothing.
  const limit = rateLimit(`contact:${clientKey(request)}`, 5, 60 * 60 * 1000)
  if (!limit.ok) {
    // Same shape as /api/applications, so the two clients can read a rate-limit
    // the same way instead of each inventing a convention.
    return NextResponse.json(
      { error: "Too many messages. Please try again later.", code: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    )
  }

  let parsed: z.infer<typeof contactSchema>
  try {
    parsed = contactSchema.parse(await request.json())
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 })
  }

  const reference = contactReference()

  // Honeypot: a bot filled the hidden field. Answer exactly as a success would,
  // including a plausible reference, and send nothing.
  if (parsed.website) return NextResponse.json({ ok: true, reference })

  const data: ContactEmailData = {
    reference,
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    service: serviceLabel(parsed.service),
    message: parsed.message,
    submittedAt: new Date(),
  }

  const alert = contactAlert(data)
  // replyTo the sender: hitting reply in Jackie's inbox should open a message
  // to the enquirer, not a note to herself. Same reasoning as the applicant alert.
  const alertResult = await sendEmail({
    to: CONTACT_DETAILS.email,
    subject: alert.subject,
    html: alert.html,
    replyTo: parsed.email,
  })

  // The alert is the one that matters — it is the enquiry actually arriving.
  // Without a database row behind it, a failure here means the message is gone,
  // so it is reported rather than swallowed.
  if (!alertResult.ok) {
    console.error("[contact] alert send failed:", alertResult.error)
    return NextResponse.json({ error: "send_failed" }, { status: 502 })
  }

  // The sender's copy is best-effort. It has already reached Jackie by this
  // point, so failing to confirm must not tell the sender it did not arrive.
  const confirmation = contactConfirmation(data, parsed.language)
  const confirmResult = await sendEmail({
    to: parsed.email,
    subject: confirmation.subject,
    html: confirmation.html,
  })
  if (!confirmResult.ok) console.error("[contact] confirmation send failed:", confirmResult.error)

  return NextResponse.json({ ok: true, reference })
}
