"use client"

import { useMemo, useState } from "react"
import { CalendarBlank, DownloadSimple, MagnifyingGlass } from "@phosphor-icons/react"

import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { BookingPanel, type AdminBooking } from "./booking-panel"
import { exportBookingsCsv } from "./actions"
import { Panel, StatusPill } from "./ui"

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, weekday: "short", day: "numeric", month: "short",
  }).format(new Date(iso))

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(iso))

type Filter = "open" | "completed" | "unpaid" | "cancelled" | "all"

/**
 * One axis: is this job still on the list, or is it behind us?
 *
 * Deliberately no date-based tab. Splitting on the clock is what let a job
 * marked done before its slot arrived fall between "upcoming" and "past" and
 * disappear from the dashboard entirely. Status decides, and every status
 * lands in exactly one tab — no tab is a subset of another.
 */
const FILTERS: { id: Filter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "completed", label: "Completed" },
  { id: "unpaid", label: "Unpaid" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
]

export function BookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  const [filter, setFilter] = useState<Filter>("open")
  const [q, setQ] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    const matched = bookings.filter((b) => {
      const passesFilter =
        filter === "all" ? true
        // Still on the list. The clock is ignored on purpose: a job whose slot
        // has passed but was never marked is overdue work, not history.
        : filter === "open" ? b.status === "confirmed" || b.status === "rescheduled"
        : filter === "completed" ? b.status === "completed"
        // Money actually owed. There is no online payment, so every future
        // booking is unpaid — listing those too would just restate Open.
        : filter === "unpaid" ? b.status === "completed" && !b.paidAt
        // Both mean the job did not happen.
        : b.status === "cancelled" || b.status === "no_show"

      if (!passesFilter) return false
      if (!term) return true

      // Search what Jackie would actually have to hand on a phone call.
      return [b.reference, b.customer?.name, b.customer?.phone, b.customer?.email, b.customer?.street, b.customer?.city]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    })

    // Open reads forwards, so anything overdue surfaces at the top where it
    // needs attention. Every other tab is history and reads backwards.
    const dir = filter === "open" ? 1 : -1
    return matched.sort((a, b) => dir * a.startsAt.localeCompare(b.startsAt))
  }, [bookings, filter, q])

  const open = bookings.find((b) => b.id === openId) ?? null

  const downloadCsv = async () => {
    setExporting(true)
    const r = await exportBookingsCsv()
    setExporting(false)
    if (!r.ok) return
    // Built in the browser so nothing has to be written to the server's disk.
    const blob = new Blob(["﻿" + r.csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wj-bookings-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, reference, street…"
            aria-label="Search bookings"
            className="h-11 w-full border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-wj-dark"
          />
        </div>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={exporting}
          className="inline-flex h-11 flex-shrink-0 items-center gap-1.5 border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          <DownloadSimple className="h-4 w-4" />
          {exporting ? "Preparing…" : "Export CSV"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {FILTERS.map((f) => {
          const on = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={on}
              className={`h-11 px-3 text-sm transition-colors ${
                on
                  ? "bg-wj-dark font-semibold text-white"
                  : "border border-gray-200 bg-white font-medium text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          )
        })}
        <span className="ml-auto self-center text-sm text-gray-500">
          {rows.length} {rows.length === 1 ? "booking" : "bookings"}
        </span>
      </div>

      {rows.length === 0 ? (
        <Panel className="p-12 text-center">
          <CalendarBlank className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 font-medium text-gray-900">
            {q ? "Nothing matches that search" : "Nothing here"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {q ? "Try a name, phone number or reference." : "Bookings appear here as they come in."}
          </p>
        </Panel>
      ) : (
        <>
          {/* desktop */}
          <Panel className="hidden overflow-hidden lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  {["When", "Customer", "Address", "Job", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setOpenId(b.id)}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpenId(b.id))}
                    className="cursor-pointer align-top transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="font-medium text-gray-900">{fmtDate(b.startsAt)}</div>
                      <div className="text-xs text-gray-500 tabular-nums">
                        {fmtTime(b.startsAt)} – {fmtTime(b.endsAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{b.customer?.name}</div>
                      <div className="text-xs text-gray-500">{b.customer?.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div>{b.customer?.street}</div>
                      <div className="text-xs text-gray-500">{b.customer?.postcode} {b.customer?.city}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div>{b.m2Label}</div>
                      <div className="text-xs text-gray-500">
                        {b.durationMin} min{b.deepCleaning ? " · deep" : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={b.status} />
                      {b.status === "completed" && !b.paidAt && (
                        <span className="mt-1 block text-xs text-amber-700">unpaid</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                      {formatCents(b.totalCents, "nl")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* mobile */}
          <div className="space-y-3 lg:hidden">
            {rows.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setOpenId(b.id)}
                className="w-full border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{fmtDate(b.startsAt)}</p>
                    <p className="text-sm text-gray-500 tabular-nums">
                      {fmtTime(b.startsAt)} – {fmtTime(b.endsAt)}
                    </p>
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <p className="mt-2 font-medium text-gray-900">{b.customer?.name}</p>
                <p className="text-sm text-gray-600">
                  {b.customer?.street}, {b.customer?.postcode} {b.customer?.city}
                </p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-sm text-gray-500">
                    {b.m2Label} · {b.durationMin} min
                  </span>
                  <span className="text-right">
                    {b.status === "completed" && !b.paidAt && (
                      <span className="block text-xs text-amber-700">unpaid</span>
                    )}
                    <span className="text-lg font-semibold text-gray-900 tabular-nums">
                      {formatCents(b.totalCents, "nl")}
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {open && <BookingPanel booking={open} onClose={() => setOpenId(null)} />}
    </>
  )
}
