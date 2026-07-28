"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  CircleNotch,
  NavigationArrow,
  Phone,
  Sun,
} from "@phosphor-icons/react"

import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { setBookingStatus } from "../actions"
import { BookingPanel, type AdminBooking } from "../booking-panel"
import { Panel, StatusPill } from "../ui"

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(iso))

/**
 * The 8am screen. Jobs in the order they happen, each with the two things
 * needed on the doorstep — a phone number and directions — and one tap to
 * mark it done.
 */
export function TodayList({ bookings }: { bookings: AdminBooking[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const complete = (id: string) => {
    setBusyId(id)
    startTransition(async () => {
      await setBookingStatus(id, "completed")
      setBusyId(null)
      router.refresh()
    })
  }

  if (bookings.length === 0) {
    return (
      <Panel className="p-12 text-center">
        <Sun className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-3 font-medium text-gray-900">Nothing booked</p>
        <p className="mt-1 text-sm text-gray-500">A clear day.</p>
      </Panel>
    )
  }

  const open = bookings.find((b) => b.id === openId) ?? null

  return (
    <>
      <ol className="space-y-3">
        {bookings.map((b, i) => {
          const c = b.customer
          const address = c ? `${c.street}, ${c.postcode} ${c.city}` : ""
          const done = b.status === "completed"
          const cancelled = b.status === "cancelled"

          return (
            <li key={b.id}>
              <Panel className={`p-4 ${cancelled ? "opacity-60" : ""}`}>
                <div className="flex items-start gap-4">
                  {/* running order, so a glance says "second job of three" */}
                  <div className="flex-shrink-0 text-center">
                    <p className="text-lg font-semibold tabular-nums text-gray-900">
                      {fmtTime(b.startsAt)}
                    </p>
                    <p className="text-xs text-gray-500 tabular-nums">
                      to {fmtTime(b.endsAt)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{i + 1}/{bookings.length}</p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenId(b.id)}
                        className="font-semibold text-gray-900 underline-offset-2 hover:underline"
                      >
                        {c?.name}
                      </button>
                      <StatusPill status={b.status} />
                      {!b.paidAt && !cancelled && (
                        <span className="bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                          unpaid
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-600">{address}</p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {b.m2Label}
                      {b.deepCleaning && " · deep clean"}
                      {b.washingUp && " · washing up"}
                      {" · "}
                      {formatCents(b.totalCents, "nl")}
                    </p>

                    {b.adminNotes && (
                      <p className="mt-2 border-l-2 border-wj-dark/30 pl-2.5 text-sm text-gray-700">
                        {b.adminNotes}
                      </p>
                    )}
                    {b.notes && (
                      <p className="mt-1.5 text-sm italic text-gray-500">{b.notes}</p>
                    )}

                    {!cancelled && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={`tel:${c?.phone}`}
                          className="inline-flex h-11 items-center gap-1.5 bg-wj-dark px-3.5 text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
                        >
                          <Phone weight="fill" className="h-4 w-4" /> Call
                        </a>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 items-center gap-1.5 border border-gray-300 px-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <NavigationArrow weight="fill" className="h-4 w-4" /> Directions
                        </a>
                        {!done && (
                          <button
                            type="button"
                            disabled={pending && busyId === b.id}
                            onClick={() => complete(b.id)}
                            className="inline-flex h-11 items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-3.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                          >
                            {pending && busyId === b.id
                              ? <CircleNotch className="h-4 w-4 animate-spin" />
                              : <CheckCircle weight="fill" className="h-4 w-4" />}
                            Done
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </li>
          )
        })}
      </ol>

      {open && <BookingPanel booking={open} onClose={() => setOpenId(null)} />}
    </>
  )
}
