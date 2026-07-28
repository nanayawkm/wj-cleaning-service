"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Price edits run under Jackie's own session, so Row Level Security decides
 * whether they are allowed — the service-role key is deliberately not used
 * here. An ordinary signed-in account that is not on the allowlist gets a
 * failed update, not a silent success.
 *
 * Past bookings are untouched by design: `bookings` stores the total it was
 * quoted at, so raising a price never rewrites what someone already agreed.
 */

export type PriceResult = { ok: true } | { ok: false; error: string }

const toCents = (euros: string): number | null => {
  const n = Number(String(euros).replace(",", "."))
  if (!Number.isFinite(n) || n < 0 || n > 10_000) return null
  return Math.round(n * 100)
}

export async function updateBandPrice(
  bandId: string,
  field: "base_cents" | "deep_cents",
  euros: string,
): Promise<PriceResult> {
  const cents = toCents(euros)
  if (cents === null) return { ok: false, error: "Enter an amount between 0 and 10000." }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("pricing_bands").update({ [field]: cents }).eq("id", bandId)

  if (error) return { ok: false, error: "Could not save. Please try again." }

  // The booking page reads prices on every load, so this is what makes the
  // change visible to customers immediately.
  revalidatePath("/book")
  revalidatePath("/residents/pricing")
  return { ok: true }
}

export async function updateAddonPrice(addonId: string, euros: string): Promise<PriceResult> {
  const cents = toCents(euros)
  if (cents === null) return { ok: false, error: "Enter an amount between 0 and 10000." }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("addons").update({ price_cents: cents }).eq("id", addonId)

  if (error) return { ok: false, error: "Could not save. Please try again." }

  revalidatePath("/book")
  revalidatePath("/residents/pricing")
  return { ok: true }
}
