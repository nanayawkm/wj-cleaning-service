import { UserPlus } from "@phosphor-icons/react/dist/ssr"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PageHeader, Panel } from "../ui"
import { ApplicationList } from "./application-list"
import { RETENTION_MONTHS, type ApplicationRow, type ApplicationStatus } from "./shared"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from("applications")
    .select(
      "id, reference, name, email, phone, city, availability, experience, transport, languages, motivation, status, notes, created_at, consent_at",
    )
    .order("created_at", { ascending: false })
    .limit(1000)

  // The cutoff is computed once, on the server, so every row is judged against
  // the same instant — and so the badge cannot disagree with what the purge
  // action would actually delete.
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS)

  const rows: ApplicationRow[] = (data ?? []).map((a) => ({
    id: a.id,
    reference: a.reference,
    name: a.name,
    email: a.email,
    phone: a.phone,
    city: a.city,
    availability: a.availability,
    experience: a.experience,
    transport: a.transport,
    languages: a.languages ?? [],
    motivation: a.motivation,
    status: a.status as ApplicationStatus,
    notes: a.notes,
    createdAt: a.created_at,
    consentAt: a.consent_at,
    overdue: new Date(a.consent_at) < cutoff,
  }))

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})
  const overdue = rows.filter((r) => r.overdue).length

  const hint = rows.length
    ? `${rows.length} application${rows.length === 1 ? "" : "s"} · ${counts.new ?? 0} new · ${counts.shortlisted ?? 0} shortlisted · ${counts.hired ?? 0} hired`
    : undefined

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader title="Applications" hint={hint} />

      {rows.length === 0 ? (
        <Panel className="p-12 text-center">
          <UserPlus className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 font-medium text-gray-900">No applications yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Anyone who applies through the careers page appears here, with what they told you.
          </p>
        </Panel>
      ) : (
        <ApplicationList rows={rows} overdueCount={overdue} />
      )}
    </div>
  )
}
