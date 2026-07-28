import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PageHeader } from "../ui"
import { ManualBookingForm } from "./form"

export const dynamic = "force-dynamic"

export default async function NewBookingPage() {
  const supabase = await createSupabaseServerClient()

  const [{ data: bands }, { data: addons }] = await Promise.all([
    supabase
      .from("pricing_bands")
      .select("id, label_en, base_cents, deep_cents, base_duration_min")
      .eq("active", true)
      .order("sort_order")
      .order("min_m2"),
    supabase.from("addons").select("slug, price_cents, duration_min").eq("active", true),
  ])

  const wash = (addons ?? []).find((a) => a.slug === "washing-up")

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Add a booking"
        hint="For jobs taken over the phone. It goes into the same calendar as online bookings, so the two can never clash."
      />
      <ManualBookingForm
        bands={bands ?? []}
        washPriceCents={wash?.price_cents ?? 1200}
        washDurationMin={wash?.duration_min ?? 30}
      />
    </div>
  )
}
