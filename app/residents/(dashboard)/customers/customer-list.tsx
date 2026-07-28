"use client"

import { useMemo, useState } from "react"
import { MagnifyingGlass, Phone, Repeat } from "@phosphor-icons/react"

import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { Panel } from "../ui"

export interface CustomerRow {
  key: string
  name: string
  email: string
  phone: string
  address: string
  bookings: number
  cancelled: number
  totalCents: number
  lastAt: string
  firstAt: string
}

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, day: "numeric", month: "short", year: "numeric",
  }).format(new Date(iso))

export function CustomerList({ rows }: { rows: CustomerRow[] }) {
  const [q, setQ] = useState("")
  const [repeatOnly, setRepeatOnly] = useState(false)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (repeatOnly && r.bookings < 2) return false
      if (!term) return true
      return [r.name, r.email, r.phone, r.address].some((v) => v.toLowerCase().includes(term))
    })
  }, [rows, q, repeatOnly])

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, address…"
            aria-label="Search customers"
            className="h-11 w-full border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-wj-dark"
          />
        </div>
        <button
          type="button"
          onClick={() => setRepeatOnly((v) => !v)}
          aria-pressed={repeatOnly}
          className={`inline-flex h-11 flex-shrink-0 items-center gap-1.5 px-3 text-sm font-semibold transition-colors ${
            repeatOnly
              ? "bg-wj-dark text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Repeat className="h-4 w-4" /> Repeat only
        </button>
      </div>

      {/* desktop */}
      <Panel className="hidden overflow-hidden lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Last visit</th>
              <th className="px-4 py-3 text-right">Total booked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.key} className="align-top transition-colors hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{r.name}</div>
                  <a href={`tel:${r.phone}`} className="text-xs text-wj-dark hover:underline">{r.phone}</a>
                </td>
                <td className="px-4 py-3 text-gray-700">{r.address}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 tabular-nums">{r.bookings}</span>
                  {r.bookings > 1 && (
                    <span className="ml-1.5 bg-wj-dark/10 px-1.5 py-0.5 text-xs font-medium text-wj-dark">
                      repeat
                    </span>
                  )}
                  {r.cancelled > 0 && (
                    <span className="mt-0.5 block text-xs text-gray-400">{r.cancelled} cancelled</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{fmt(r.lastAt)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                  {formatCents(r.totalCents, "nl")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* mobile */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((r) => (
          <Panel key={r.key} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{r.name}</p>
                <p className="truncate text-sm text-gray-600">{r.address}</p>
              </div>
              <a
                href={`tel:${r.phone}`}
                aria-label={`Call ${r.name}`}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-wj-dark text-white"
              >
                <Phone weight="fill" className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-gray-100 pt-3">
              <span className="text-sm text-gray-600">
                {r.bookings} booking{r.bookings === 1 ? "" : "s"}
                {r.bookings > 1 && <span className="ml-1.5 text-xs font-medium text-wj-dark">repeat</span>}
                <span className="block text-xs text-gray-500">Last {fmt(r.lastAt)}</span>
              </span>
              <span className="text-lg font-semibold text-gray-900 tabular-nums">
                {formatCents(r.totalCents, "nl")}
              </span>
            </div>
          </Panel>
        ))}
      </div>

      {filtered.length === 0 && (
        <Panel className="p-10 text-center">
          <p className="text-sm text-gray-500">Nothing matches that.</p>
        </Panel>
      )}
    </>
  )
}
