"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Discount codes are edited under Jackie's own session, so Row Level Security
 * decides whether each write is allowed rather than a service key that would
 * bypass it.
 *
 * Nothing is ever deleted. Bookings record the code they were given, and
 * removing the row would leave those records pointing at nothing — so a code
 * that has run its course is switched off, not erased.
 */

export type Result = { ok: true } | { ok: false; error: string }

const refresh = () => {
  revalidatePath("/residents/discounts")
  revalidatePath("/book")
}

export interface NewCode {
  code: string
  percentOff: number
  label: string
  maxUses: string
  endsOn: string
}

export async function createDiscount(input: NewCode): Promise<Result> {
  const code = input.code.trim().toUpperCase()

  if (!/^[A-Z0-9][A-Z0-9-]{2,29}$/.test(code)) {
    return { ok: false, error: "Use 3–30 letters, numbers or hyphens." }
  }
  if (!Number.isInteger(input.percentOff) || input.percentOff < 1 || input.percentOff > 100) {
    return { ok: false, error: "Choose a discount between 1% and 100%." }
  }

  // Blank means no limit, which is why these are strings rather than numbers —
  // an empty box has to survive the trip without becoming 0.
  let maxUses: number | null = null
  if (input.maxUses.trim()) {
    const n = Number(input.maxUses)
    if (!Number.isInteger(n) || n < 1) return { ok: false, error: "Uses must be a whole number above 0." }
    maxUses = n
  }

  let expiresAt: string | null = null
  if (input.endsOn.trim()) {
    // End of the chosen day in Amsterdam, so a code dated today works all day.
    const d = new Date(`${input.endsOn}T23:59:59+02:00`)
    if (Number.isNaN(d.getTime())) return { ok: false, error: "That date is not valid." }
    expiresAt = d.toISOString()
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("discount_codes").insert({
    code,
    percent_off: input.percentOff,
    label: input.label.trim() || null,
    max_uses: maxUses,
    expires_at: expiresAt,
    active: true,
    // Retained on the table but no longer enforced: the customer's email is
    // unknown when the code is typed, so reuse is limited by max_uses instead.
    first_booking_only: false,
  })

  if (error) {
    // 23505 is the case-insensitive unique index on code.
    if ((error as { code?: string }).code === "23505") {
      return { ok: false, error: "That code already exists." }
    }
    return { ok: false, error: "Could not save the code." }
  }

  refresh()
  return { ok: true }
}

export async function setDiscountActive(id: string, active: boolean): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("discount_codes")
    .update({ active })
    .eq("id", id)
    .select("id")

  if (error) return { ok: false, error: "Could not update the code." }
  if (!data?.length) return { ok: false, error: "Code not found." }
  refresh()
  return { ok: true }
}
