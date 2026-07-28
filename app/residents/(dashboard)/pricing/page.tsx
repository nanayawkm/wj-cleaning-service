import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PageHeader } from "../ui"
import { PricingEditor } from "./editor"

export const dynamic = "force-dynamic"

export default async function PricingPage() {
  const supabase = await createSupabaseServerClient()

  const [{ data: bands }, { data: addons }] = await Promise.all([
    supabase
      .from("pricing_bands")
      .select("id, label_en, base_cents, deep_cents")
      .eq("active", true)
      .order("sort_order")
      .order("min_m2"),
    supabase
      .from("addons")
      .select("id, slug, name_en, price_cents, duration_min")
      .eq("active", true)
      .order("sort_order"),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Pricing"
        hint="What the booking page charges. Edit a figure and it applies to new bookings immediately."
      />
      <PricingEditor bands={bands ?? []} addons={addons ?? []} />
    </div>
  )
}
