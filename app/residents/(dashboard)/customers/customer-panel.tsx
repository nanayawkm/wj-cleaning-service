"use client"

import { useEffect } from "react"
import { CurrencyEur, MapPin, NavigationArrow, Phone, Repeat, X } from "@phosphor-icons/react"

import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { StatusPill } from "../ui"
import type { CustomerRow } from "./customer-list"

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, weekday: "short", day: "numeric", month: "short", year: "numeric",
  }).format(new Date(iso))

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(iso))

/**
 * Everything about one customer, in a slide-over.
 *
 * The list can only ever say "2 bookings". The obvious next question is which
 * two, and before this panel existed there was no way to ask it — the row was
 * a dead end that looked tappable. Same shape as the booking panel on purpose:
 * a phone number and directions at the top, the history underneath.
 */
export function CustomerPanel({
  customer,
  onClose,
}: {
  customer: CustomerRow
  onClose: () => void
}) {
  // Escape closes, and the page behind must not scroll while this is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(customer.address)}`
  const owed = customer.history
    .filter((b) => b.status === "completed" && !b.paidAt)
    .reduce((s, b) => s + b.totalCents, 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={customer.name}
        className="relative flex h-full w-full max-w-lg flex-col border-l border-gray-200 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-semibold text-gray-900">{customer.name}</h2>
              {customer.bookings > 1 && (
                <span className="inline-flex flex-shrink-0 items-center gap-1 bg-wj-dark/10 px-1.5 py-0.5 text-xs font-medium text-wj-dark">
                  <Repeat className="h-3 w-3" /> repeat
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-gray-500">{customer.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex h-11 w-11 flex-shrink-0 items-center justify-center text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-gray-100">
          {/* contact — the reason this panel exists */}
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${customer.phone}`}
                className="flex h-11 items-center justify-center gap-2 bg-wj-dark text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
              >
                <Phone weight="fill" className="h-4 w-4" /> Call
              </a>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <NavigationArrow weight="fill" className="h-4 w-4" /> Directions
              </a>
            </div>
            <p className="mt-3 flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {customer.address}
            </p>
            <p className="mt-1.5 text-sm text-gray-500">
              {customer.phone} ·{" "}
              <a href={`mailto:${customer.email}`} className="hover:underline">
                {customer.email}
              </a>
            </p>
          </div>

          {/* the numbers */}
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { label: "Bookings", value: String(customer.bookings) },
              { label: "Booked total", value: formatCents(customer.totalCents, "nl") },
              { label: "Since", value: fmtDate(customer.firstAt).split(" ").slice(-2).join(" ") },
            ].map((s) => (
              <div key={s.label} className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{s.label}</p>
                <p className="mt-1 font-semibold tabular-nums text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>

          {owed > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 px-5 py-3 text-sm text-amber-800">
              <CurrencyEur className="h-4 w-4 flex-shrink-0" />
              {formatCents(owed, "nl")} owed on completed work
            </div>
          )}

          {/* the answer to "which bookings?" */}
          <div className="px-5 py-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Booking history
            </p>
            <ol className="space-y-2">
              {customer.history.map((b) => (
                <li key={b.id} className="border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{fmtDate(b.startsAt)}</p>
                      <p className="text-xs text-gray-500 tabular-nums">
                        {fmtTime(b.startsAt)}
                        {b.m2Label ? ` · ${b.m2Label}` : ""}
                      </p>
                      <p className="mt-1 font-mono text-xs text-gray-400">{b.reference}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <StatusPill status={b.status} />
                      <p className="mt-1 font-semibold tabular-nums text-gray-900">
                        {formatCents(b.totalCents, "nl")}
                      </p>
                      {b.status === "completed" && !b.paidAt && (
                        <p className="text-xs text-amber-700">unpaid</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>
    </div>
  )
}
