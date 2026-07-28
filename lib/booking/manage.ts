import "server-only"

import { createSupabaseAdminClient } from "@/lib/supabase/server"
import { verifyToken } from "./tokens"

/**
 * Loading a booking from a manage link.
 *
 * The token is the only credential a customer has, so it is checked twice:
 *
 *   1. the HMAC signature, which proves we issued it and nobody edited the
 *      booking id inside it
 *   2. an equality check against `manage_token` on the row itself
 *
 * The second check is what makes a leaked link revocable. Rotating that one
 * column kills the link immediately, without waiting for the 120-day expiry
 * and without invalidating anyone else's.
 */

export interface ManagedBooking {
  id: string
  reference: string
  startsAt: Date
  endsAt: Date
  durationMin: number
  status: "confirmed" | "rescheduled" | "completed" | "cancelled" | "no_show"
  m2Label: string
  deepCleaning: boolean
  washingUp: boolean
  lines: { label: string; cents: number }[]
  subtotalCents: number
  discountCents: number
  totalCents: number
  language: "nl" | "en"
  notes: string | null
  customer: {
    name: string
    email: string
    phone: string
    street: string
    postcode: string
    city: string
  }
}

export type LoadResult =
  | { ok: true; booking: ManagedBooking }
  | { ok: false; reason: "invalid" | "expired" | "not-found" }

export async function loadBookingByToken(token: string | undefined): Promise<LoadResult> {
  if (!token) return { ok: false, reason: "invalid" }

  const payload = verifyToken(token, "manage")
  if (!payload) return { ok: false, reason: "invalid" }

  // Service role: the customer has no session, and RLS deliberately refuses
  // anonymous reads of this table. The token is the authorisation, and it has
  // already been verified above.
  const db = createSupabaseAdminClient()

  const { data, error } = await db
    .from("bookings")
    .select(
      `id, reference, starts_at, ends_at, duration_min, status, m2_label, deep_cleaning,
       subtotal_cents, discount_cents, total_cents, language, notes, manage_token,
       customers ( name, email, phone, street, postcode, city ),
       pricing_bands ( label_en, label_nl ),
       booking_addons ( name_en, price_cents, addons ( slug ) )`,
    )
    .eq("id", payload.bookingId)
    .maybeSingle()

  if (error || !data) return { ok: false, reason: "not-found" }

  // Rotating manage_token revokes the link even though the signature is valid.
  if (data.manage_token !== token) return { ok: false, reason: "invalid" }

  const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers
  const bandRow = Array.isArray(data.pricing_bands) ? data.pricing_bands[0] : data.pricing_bands
  if (!customer) return { ok: false, reason: "not-found" }

  const lang = (data.language === "nl" ? "nl" : "en") as "nl" | "en"
  const addonRows = (data.booking_addons ?? []) as {
    name_en: string
    price_cents: number
    addons: { slug: string } | { slug: string }[] | null
  }[]

  const slugOf = (r: (typeof addonRows)[number]) =>
    Array.isArray(r.addons) ? r.addons[0]?.slug : r.addons?.slug

  const bandLabel =
    (lang === "nl" ? bandRow?.label_nl : bandRow?.label_en) ?? data.m2_label ?? ""

  // Price lines are rebuilt from what was stored on the booking, never
  // recalculated from today's prices — a customer must see what they were
  // quoted even if Jackie has raised her rates since.
  const lines: { label: string; cents: number }[] = [
    {
      label: lang === "nl" ? `Algemene schoonmaak · ${bandLabel}` : `General cleaning · ${bandLabel}`,
      cents: data.subtotal_cents - addonRows.reduce((s, r) => s + r.price_cents, 0),
    },
    ...addonRows.map((r) => ({ label: r.name_en, cents: r.price_cents })),
  ]

  return {
    ok: true,
    booking: {
      id: data.id,
      reference: data.reference,
      startsAt: new Date(data.starts_at),
      // Job end, not the blocked end — ends_at includes the travel buffer.
      endsAt: new Date(new Date(data.starts_at).getTime() + data.duration_min * 60_000),
      durationMin: data.duration_min,
      status: data.status,
      m2Label: bandLabel,
      deepCleaning: Boolean(data.deep_cleaning),
      washingUp: addonRows.some((r) => slugOf(r) === "washing-up"),
      lines,
      subtotalCents: data.subtotal_cents,
      discountCents: data.discount_cents,
      totalCents: data.total_cents,
      language: lang,
      notes: data.notes,
      customer,
    },
  }
}
