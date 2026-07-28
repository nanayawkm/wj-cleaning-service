import "server-only"

import { createSupabaseAdminClient } from "@/lib/supabase/server"
import { BLOCKING_STATUSES } from "./config"
import type { Addon, PricingBand } from "./pricing"
import type { AvailabilityOverride, AvailabilityRule, BusyInterval } from "./availability"

/**
 * Server-side reads for the booking flow.
 *
 * Availability uses the admin client because `bookings` is unreadable by anon
 * — deliberately, since it holds who is having their home cleaned and when.
 * Only free/busy intervals ever leave this module; no name, address or
 * reference is returned to the browser.
 */

export async function getPricingBands(): Promise<PricingBand[]> {
  const db = createSupabaseAdminClient()
  const { data, error } = await db
    .from("pricing_bands")
    .select("id, min_m2, max_m2, label_nl, label_en, base_cents, deep_cents, sort_order")
    .eq("active", true)
    .order("sort_order")
  if (error) throw new Error(`pricing_bands: ${error.message}`)
  return data ?? []
}

export async function getAddons(): Promise<Addon[]> {
  const db = createSupabaseAdminClient()
  const { data, error } = await db
    .from("addons")
    .select("id, slug, name_nl, name_en, price_cents, duration_min, sort_order")
    .eq("active", true)
    .order("sort_order")
  if (error) throw new Error(`addons: ${error.message}`)
  return data ?? []
}

export async function getAvailabilityRules(): Promise<AvailabilityRule[]> {
  const db = createSupabaseAdminClient()
  const { data, error } = await db
    .from("availability_rules")
    .select("weekday, start_time, active")
    .eq("active", true)
  if (error) throw new Error(`availability_rules: ${error.message}`)
  return data ?? []
}

export async function getAvailabilityOverrides(
  fromISO: string,
  toISO: string,
): Promise<AvailabilityOverride[]> {
  const db = createSupabaseAdminClient()
  const { data, error } = await db
    .from("availability_overrides")
    .select("on_date, start_time, kind")
    .gte("on_date", fromISO)
    .lte("on_date", toISO)
  if (error) throw new Error(`availability_overrides: ${error.message}`)
  return (data ?? []) as AvailabilityOverride[]
}

/**
 * Occupied intervals only. Selecting just the two timestamps is the point:
 * even a mistake downstream cannot leak a customer from this query.
 */
export async function getBusyIntervals(fromISO: string, toISO: string): Promise<BusyInterval[]> {
  const db = createSupabaseAdminClient()
  const { data, error } = await db
    .from("bookings")
    .select("starts_at, ends_at")
    .in("status", BLOCKING_STATUSES as unknown as string[])
    .gte("starts_at", `${fromISO}T00:00:00Z`)
    .lte("starts_at", `${toISO}T23:59:59Z`)
  if (error) throw new Error(`bookings: ${error.message}`)
  return data ?? []
}

export async function getDiscountCode(code: string) {
  const db = createSupabaseAdminClient()
  const { data } = await db
    .from("discount_codes")
    .select("id, code, percent_off, active, first_booking_only, expires_at")
    .ilike("code", code.trim())
    .maybeSingle()

  if (!data || !data.active) return null
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null
  return data
}

/** Used to enforce `first_booking_only` on a discount code. */
export async function hasBookedBefore(email: string): Promise<boolean> {
  const db = createSupabaseAdminClient()
  const { data } = await db
    .from("customers")
    .select("id, bookings(id)")
    .ilike("email", email.trim())
    .limit(1)
  return Boolean(data?.[0]?.bookings?.length)
}
