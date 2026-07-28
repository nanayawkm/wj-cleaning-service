import { CurrencyEur, Tag, TicketIcon } from "@phosphor-icons/react/dist/ssr"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { formatCents } from "@/lib/booking/pricing"
import { PageHeader, Stat } from "../ui"
import { DiscountList, type DiscountRow } from "./list"

export const dynamic = "force-dynamic"

export default async function DiscountsPage() {
  const supabase = await createSupabaseServerClient()

  const [{ data: codes }, { data: bands }, { data: used }] = await Promise.all([
    supabase
      .from("discount_codes")
      .select("id, code, percent_off, label, active, expires_at, max_uses, times_used, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("pricing_bands")
      .select("base_cents, deep_cents")
      .eq("active", true)
      .order("min_m2"),
    // What the codes have actually cost, taken from the bookings themselves
    // rather than estimated from the percentages.
    supabase.from("bookings").select("discount_cents").not("discount_code", "is", null),
  ])

  const rows: DiscountRow[] = (codes ?? []).map((c) => ({
    id: c.id,
    code: c.code,
    percentOff: c.percent_off,
    label: c.label,
    active: c.active,
    expiresAt: c.expires_at,
    maxUses: c.max_uses,
    timesUsed: c.times_used,
  }))

  const givenCents = (used ?? []).reduce((s, b) => s + (b.discount_cents ?? 0), 0)
  const redemptions = rows.reduce((s, r) => s + r.timesUsed, 0)

  const now = Date.now()
  const isSpent = (r: DiscountRow) =>
    (r.maxUses !== null && r.timesUsed >= r.maxUses) ||
    (r.expiresAt !== null && new Date(r.expiresAt).getTime() < now)

  const live = rows.filter((r) => r.active && !isSpent(r)).length
  const finished = rows.filter((r) => isSpent(r)).length

  const cheapest = bands?.[0]?.base_cents ?? 8900
  const dearest = (bands?.[bands.length - 1]?.base_cents ?? 16900) + (bands?.[bands.length - 1]?.deep_cents ?? 9000)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Discounts"
        hint="Codes customers type when they book. Turning one off stops it immediately."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat Icon={TicketIcon} label="Live codes" value={String(live)} />
        <Stat Icon={Tag} label="Times redeemed" value={String(redemptions)} />
        <Stat Icon={CurrencyEur} label="Given away" value={formatCents(givenCents, "nl")} />
        <Stat Icon={Tag} label="Finished" value={String(finished)} />
      </div>

      <DiscountList rows={rows} cheapestCents={cheapest} dearestCents={dearest} />
    </div>
  )
}
