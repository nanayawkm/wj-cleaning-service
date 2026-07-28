import "server-only"

import crypto from "node:crypto"

/**
 * Signed, expiring tokens for links sent by email.
 *
 * Used for the customer's manage-booking link and for Jackie's one-tap actions
 * in her notification emails. The signature is what makes these safe: without
 * it, editing a booking id in a URL would let anyone cancel a stranger's
 * appointment.
 */

const secret = () => {
  const s = process.env.BOOKING_TOKEN_SECRET
  if (!s) throw new Error("BOOKING_TOKEN_SECRET is not set")
  return s
}

const b64url = (buf: Buffer) => buf.toString("base64url")

export type TokenPurpose = "manage" | "admin-action"

interface Payload {
  bookingId: string
  purpose: TokenPurpose
  /** Unix seconds. */
  exp: number
}

export function signToken(bookingId: string, purpose: TokenPurpose, ttlDays: number): string {
  const payload: Payload = {
    bookingId,
    purpose,
    exp: Math.floor(Date.now() / 1000) + ttlDays * 86_400,
  }
  const body = b64url(Buffer.from(JSON.stringify(payload)))
  const sig = b64url(crypto.createHmac("sha256", secret()).update(body).digest())
  return `${body}.${sig}`
}

/**
 * Returns the payload, or null for anything tampered with, expired, or issued
 * for a different purpose. A manage link can never be replayed as an admin
 * action, even though both are signed with the same secret.
 */
export function verifyToken(token: string, purpose: TokenPurpose): Payload | null {
  const [body, sig] = token.split(".")
  if (!body || !sig) return null

  const expected = b64url(crypto.createHmac("sha256", secret()).update(body).digest())

  // Constant-time compare so a timing side-channel cannot reveal the signature.
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload
    if (payload.purpose !== purpose) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

/** Short, unambiguous booking reference. No 0/O/1/I. */
export function generateReference(): string {
  const alphabet = "ACDEFGHJKLMNPQRSTUVWXYZ23456789"
  const pick = () => alphabet[crypto.randomInt(alphabet.length)]
  return `WJ-${Array.from({ length: 6 }, pick).join("")}`
}
