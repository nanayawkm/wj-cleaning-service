import { Users } from "@phosphor-icons/react/dist/ssr"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { PageHeader, Panel } from "../ui"
import { CustomerList, type CustomerRow } from "./customer-list"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const supabase = await createSupabaseServerClient()

  // One query, grouped in JS. At this scale that is far simpler than a view,
  // and it keeps the "what counts as revenue" rule in one readable place.
  const { data } = await supabase
    .from("bookings")
    .select(
      `id, reference, customer_id, starts_at, total_cents, status, paid_at, m2_label,
       customers ( name, email, phone, street, postcode, city )`,
    )
    .order("starts_at", { ascending: false })
    .limit(2000)

  const byId = new Map<string, CustomerRow>()
  for (const b of data ?? []) {
    const c = (Array.isArray(b.customers) ? b.customers[0] : b.customers) as
      | { name: string; email: string; phone: string; street: string; postcode: string; city: string }
      | null
    if (!c || !b.customer_id) continue

    // Group on email where there is one: the same person booking twice creates
    // two customer rows, and counting them separately would hide every repeat.
    const key = c.email && !c.email.startsWith("noemail+") ? c.email.toLowerCase() : b.customer_id

    const existing = byId.get(key)
    const counts = b.status !== "cancelled"
    const entry: CustomerRow = existing ?? {
      key,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: `${c.street}, ${c.postcode} ${c.city}`,
      bookings: 0,
      cancelled: 0,
      totalCents: 0,
      lastAt: b.starts_at,
      firstAt: b.starts_at,
      history: [],
    }

    // Every booking, cancelled ones included — the panel is the place where
    // Jackie needs the whole story, not just the part that counts as revenue.
    // The query is already newest-first, so pushing keeps that order.
    entry.history.push({
      id: b.id,
      reference: b.reference,
      startsAt: b.starts_at,
      status: b.status,
      totalCents: b.total_cents,
      paidAt: b.paid_at,
      m2Label: b.m2_label,
    })

    if (counts) {
      entry.bookings += 1
      entry.totalCents += b.total_cents
    } else {
      entry.cancelled += 1
    }
    if (b.starts_at > entry.lastAt) entry.lastAt = b.starts_at
    if (b.starts_at < entry.firstAt) entry.firstAt = b.starts_at
    byId.set(key, entry)
  }

  const rows = [...byId.values()].sort((a, b) => b.lastAt.localeCompare(a.lastAt))
  const repeat = rows.filter((r) => r.bookings > 1).length
  const lifetime = rows.reduce((s, r) => s + r.totalCents, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Customers"
        hint={`${rows.length} customer${rows.length === 1 ? "" : "s"} · ${repeat} ${repeat === 1 ? "has" : "have"} booked more than once · ${formatCents(lifetime, "nl")} booked in total. Times are ${TIMEZONE.replace("_", " ")}.`}
      />

      {rows.length === 0 ? (
        <Panel className="p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 font-medium text-gray-900">No customers yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Everyone who books appears here, with how often they have been back.
          </p>
        </Panel>
      ) : (
        <CustomerList rows={rows} />
      )}
    </div>
  )
}
