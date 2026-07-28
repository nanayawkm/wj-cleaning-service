import "server-only"

import { Resend } from "resend"
import { CONTACT_DETAILS } from "@/components/constant"

/**
 * Outbound email.
 *
 * A failure here must never lose a booking that is already committed to the
 * database, so every send is wrapped and returns a result rather than throwing.
 * The customer can always be reached from the dashboard if a send fails.
 */

let client: Resend | null = null
const resend = () => {
  if (!client) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error("RESEND_API_KEY is not set")
    client = new Resend(key)
  }
  return client
}

export interface SendResult {
  ok: boolean
  id?: string
  error?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string
  subject: string
  html: string
  attachments?: { filename: string; content: string }[]
}): Promise<SendResult> {
  try {
    const { data, error } = await resend().emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? `WJ Cleaning Services <bookings@wjcleaningservices.nl>`,
      to,
      subject,
      html,
      // bookings@ is a send-only address — DNS verification enables sending,
      // not receiving. Without this, a customer replying "can you come at 10
      // instead?" would be talking to nobody.
      replyTo: CONTACT_DETAILS.email,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content).toString("base64"),
      })),
    })

    if (error) {
      console.error("[email] send failed:", error.name)
      return { ok: false, error: error.name }
    }
    return { ok: true, id: data?.id }
  } catch (err) {
    console.error("[email] threw:", err instanceof Error ? err.message : "unknown")
    return { ok: false, error: "send_failed" }
  }
}
