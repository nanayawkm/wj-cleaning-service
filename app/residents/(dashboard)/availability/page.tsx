import { createSupabaseServerClient } from "@/lib/supabase/server"
import { TIMEZONE } from "@/lib/booking/config"
import { PageHeader } from "../ui"
import { AvailabilityEditor } from "./editor"

export const dynamic = "force-dynamic"

export default async function AvailabilityPage() {
  const supabase = await createSupabaseServerClient()

  const [{ data: rules }, { data: overrides }] = await Promise.all([
    supabase.from("availability_rules").select("id, weekday, start_time, active"),
    supabase
      .from("availability_overrides")
      .select("id, on_date, start_time, kind, reason")
      .gte("on_date", new Date().toISOString().slice(0, 10))
      .order("on_date"),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Availability"
        hint={`Your normal week, plus days you are away. Customers only ever see times that pass both. Times are ${TIMEZONE.replace("_", " ")}.`}
      />
      <AvailabilityEditor rules={rules ?? []} overrides={overrides ?? []} />
    </div>
  )
}
