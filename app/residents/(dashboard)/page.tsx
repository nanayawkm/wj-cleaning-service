import { CalendarBlank, Clock, CurrencyEur } from "@phosphor-icons/react/dist/ssr"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { PageHeader, Panel, Stat, StatusPill } from "./ui"

export const dynamic = "force-dynamic"

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, weekday: "short", day: "numeric", month: "short",
  }).format(new Date(iso))

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(iso))

type Customer = {
  name: string; email: string; phone: string
  street: string; postcode: string; city: string
} | null

/**
 * Every read here runs under Jackie's session, so Row Level Security is doing
 * the filtering — not a `where` clause I could forget to write.
 */
export default async function AdminBookingsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, reference, starts_at, ends_at, status, total_cents, duration_min, m2_label, deep_cleaning, notes, customers(name, email, phone, street, postcode, city)",
    )
    .order("starts_at", { ascending: true })
    .limit(100)

  const rows = bookings ?? []
  const now = new Date()
  const upcoming = rows.filter(
    (b) => new Date(b.starts_at) >= now && ["confirmed", "rescheduled"].includes(b.status),
  )
  const revenue = upcoming.reduce((sum, b) => sum + b.total_cents, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Bookings"
        hint={`Everything scheduled, soonest first. Times are ${TIMEZONE.replace("_", " ")}.`}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat Icon={CalendarBlank} label="Upcoming" value={String(upcoming.length)} />
        <Stat
          Icon={Clock}
          label="Next job"
          value={upcoming[0] ? `${fmtDate(upcoming[0].starts_at)} ${fmtTime(upcoming[0].starts_at)}` : "—"}
        />
        <Stat Icon={CurrencyEur} label="Upcoming value" value={formatCents(revenue, "nl")} />
      </div>

      {error && (
        <Panel className="border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Could not load bookings.</p>
        </Panel>
      )}

      {!error && rows.length === 0 && (
        <Panel className="p-12 text-center">
          <CalendarBlank className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 font-medium text-gray-900">No bookings yet</p>
          <p className="mt-1 text-sm text-gray-500">
            They appear here the moment someone books online.
          </p>
        </Panel>
      )}

      {rows.length > 0 && (
        <>
          {/* ------------------------------------------------ desktop table */}
          <Panel className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <tr>
                    {["Ref", "When", "Customer", "Address", "Job", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3">{h}</th>
                    ))}
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((b) => {
                    const c = b.customers as unknown as Customer
                    return (
                      <tr key={b.id} className="align-top transition-colors hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                          {b.reference}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="font-medium text-gray-900">{fmtDate(b.starts_at)}</div>
                          <div className="text-xs text-gray-500 tabular-nums">
                            {fmtTime(b.starts_at)} – {fmtTime(b.ends_at)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{c?.name}</div>
                          <a href={`tel:${c?.phone}`} className="block text-xs text-wj-dark hover:underline">
                            {c?.phone}
                          </a>
                          <a href={`mailto:${c?.email}`} className="block max-w-[18ch] truncate text-xs text-gray-500 hover:underline">
                            {c?.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <div>{c?.street}</div>
                          <div className="text-xs text-gray-500">{c?.postcode} {c?.city}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <div>{b.m2_label}</div>
                          <div className="text-xs text-gray-500">
                            {b.duration_min} min{b.deep_cleaning ? " · deep clean" : ""}
                          </div>
                          {b.notes && (
                            <div className="mt-1 max-w-xs text-xs italic text-gray-500">{b.notes}</div>
                          )}
                        </td>
                        <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                          {formatCents(b.total_cents, "nl")}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>

          {/*
            Cards below lg. Seven columns cannot be read on a phone, and Jackie
            will check tomorrow's jobs from one far more often than from a desk.
          */}
          <div className="space-y-3 lg:hidden">
            {rows.map((b) => {
              const c = b.customers as unknown as Customer
              return (
                <Panel key={b.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{fmtDate(b.starts_at)}</p>
                      <p className="text-sm text-gray-500 tabular-nums">
                        {fmtTime(b.starts_at)} – {fmtTime(b.ends_at)}
                      </p>
                    </div>
                    <StatusPill status={b.status} />
                  </div>

                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="font-medium text-gray-900">{c?.name}</p>
                    <p className="text-sm text-gray-600">{c?.street}, {c?.postcode} {c?.city}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      <a href={`tel:${c?.phone}`} className="font-semibold text-wj-dark">{c?.phone}</a>
                      <a href={`mailto:${c?.email}`} className="truncate text-gray-500">{c?.email}</a>
                    </div>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
                    <div className="text-sm text-gray-600">
                      {b.m2_label}
                      <span className="block text-xs text-gray-500">
                        {b.duration_min} min{b.deep_cleaning ? " · deep clean" : ""}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs text-gray-400">{b.reference}</span>
                      <span className="block text-lg font-semibold text-gray-900 tabular-nums">
                        {formatCents(b.total_cents, "nl")}
                      </span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="mt-3 border-t border-gray-100 pt-3 text-xs italic text-gray-500">
                      {b.notes}
                    </p>
                  )}
                </Panel>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
