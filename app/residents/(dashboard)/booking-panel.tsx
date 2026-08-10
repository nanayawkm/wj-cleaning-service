"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowCounterClockwise,
  CheckCircle,
  CircleNotch,
  CurrencyEur,
  MapPin,
  NavigationArrow,
  Phone,
  Prohibit,
  UserMinus,
  X,
} from "@phosphor-icons/react"

import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { SlotPicker } from "@/app/book/components/slot-picker"
import {
  adminCancel,
  adminReschedule,
  saveAdminNote,
  setBookingStatus,
  setPaid,
} from "./actions"
import { StatusPill } from "./ui"

export interface AdminBooking {
  id: string
  reference: string
  startsAt: string
  endsAt: string
  status: string
  m2Label: string
  deepCleaning: boolean
  washingUp: boolean
  durationMin: number
  totalCents: number
  paidAt: string | null
  source: string
  notes: string | null
  adminNotes: string | null
  customer: { name: string; email: string; phone: string; street: string; postcode: string; city: string } | null
}

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, weekday: "long", day: "numeric", month: "long",
  }).format(new Date(iso))

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(iso))

/**
 * Everything actionable about one booking, in a slide-over.
 *
 * A dashboard that can only display is a report. The point of this panel is
 * that the phone rings, Jackie opens the job, and every answer she needs to
 * give is one tap away.
 */
export function BookingPanel({
  booking,
  onClose,
}: {
  booking: AdminBooking
  onClose: () => void
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"view" | "reschedule" | "confirm-cancel">("view")
  const [picked, setPicked] = useState<string | null>(null)
  const [notify, setNotify] = useState(true)
  const [note, setNote] = useState(booking.adminNotes ?? "")

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

  const c = booking.customer
  const address = c ? `${c.street}, ${c.postcode} ${c.city}` : ""
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  const active = booking.status === "confirmed" || booking.status === "rescheduled"
  const paid = Boolean(booking.paidAt)

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) =>
    startTransition(async () => {
      setError(null)
      const r = await fn()
      if (r.ok) {
        router.refresh()
        after?.()
      } else {
        setError(r.error ?? "Something went wrong.")
      }
    })

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
        aria-label={`Booking ${booking.reference}`}
        className="relative flex h-full w-full max-w-lg flex-col border-l border-gray-200 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900">{c?.name ?? "Booking"}</h2>
              <StatusPill status={booking.status} />
              {booking.source === "manual" && (
                <span className="bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">by phone</span>
              )}
            </div>
            <p className="mt-0.5 font-mono text-xs text-gray-500">{booking.reference}</p>
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

        <div className="min-h-0 flex-1 overflow-y-auto">
          {mode === "view" && (
            <div className="divide-y divide-gray-100">
              {/* when + what */}
              <div className="px-5 py-4">
                <p className="font-semibold text-gray-900">{fmtDate(booking.startsAt)}</p>
                <p className="text-sm text-gray-600 tabular-nums">
                  {fmtTime(booking.startsAt)} – {fmtTime(booking.endsAt)} · {booking.durationMin} min
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {booking.m2Label}
                  {booking.deepCleaning && " · deep clean"}
                  {booking.washingUp && " · washing up"}
                </p>
              </div>

              {/* contact — the reason this panel exists */}
              {c && (
                <div className="px-5 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${c.phone}`}
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
                    {address}
                  </p>
                  <p className="mt-1.5 text-sm text-gray-500">
                    {c.phone} · <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                  </p>
                </div>
              )}

              {/* money */}
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900 tabular-nums">
                    {formatCents(booking.totalCents, "nl")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {paid
                      ? `Paid ${new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, day: "numeric", month: "short" }).format(new Date(booking.paidAt!))}`
                      : active && new Date(booking.startsAt).getTime() <= Date.now()
                        ? "Not yet paid · marking paid also completes the job"
                        : "Not yet paid"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => setPaid(booking.id, !paid))}
                  className={`inline-flex h-10 items-center gap-1.5 border px-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
                    paid
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <CurrencyEur className="h-4 w-4" />
                  {paid ? "Paid" : "Mark paid"}
                </button>
              </div>

              {/* customer's own note */}
              {booking.notes && (
                <div className="px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    From the customer
                  </p>
                  <p className="mt-1.5 text-sm italic text-gray-700">{booking.notes}</p>
                </div>
              )}

              {/* Jackie's own note — never emailed, never shown to the customer */}
              <div className="px-5 py-4">
                <label htmlFor="adminNote" className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Your notes (private)
                </label>
                <textarea
                  id="adminNote"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={() => note !== (booking.adminNotes ?? "") && run(() => saveAdminNote(booking.id, note))}
                  placeholder="Gate code, where the key is, parking…"
                  className="mt-1.5 w-full border border-gray-300 bg-white p-2.5 text-sm outline-none focus:border-wj-dark"
                />
              </div>

              {/* job outcome */}
              {active && (
                <div className="px-5 py-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                    After the job
                  </p>
                  {/* The panel deliberately stays open: the pill flips to
                      "completed" in place, so finishing a job never reads as
                      the booking having been deleted. */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => run(() => setBookingStatus(booking.id, "completed"))}
                      className="inline-flex h-11 items-center justify-center gap-2 border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                    >
                      <CheckCircle weight="fill" className="h-4 w-4" /> Completed
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => run(() => setBookingStatus(booking.id, "no_show"))}
                      className="inline-flex h-11 items-center justify-center gap-2 border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      <UserMinus className="h-4 w-4" /> No show
                    </button>
                  </div>
                </div>
              )}

              {!active && (
                <div className="px-5 py-4">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => setBookingStatus(booking.id, "confirmed"))}
                    className="inline-flex h-10 items-center gap-1.5 border border-gray-300 px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ArrowCounterClockwise className="h-4 w-4" /> Reopen as confirmed
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === "reschedule" && (
            <div className="px-5 py-5">
              <p className="mb-4 text-sm text-gray-600">
                Currently {fmtDate(booking.startsAt)}, {fmtTime(booking.startsAt)}. Slots are sized
                for this job ({booking.durationMin} min).
              </p>
              <SlotPicker
                deepCleaning={booking.deepCleaning}
                washingUp={booking.washingUp}
                value={picked}
                onSelect={(startsAt) => setPicked(startsAt)}
              />
            </div>
          )}

          {mode === "confirm-cancel" && (
            <div className="px-5 py-6">
              <h3 className="font-semibold text-gray-900">Cancel this booking?</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                The slot is released immediately and becomes bookable by someone else.
              </p>
              <p className="mt-3 border-l-2 border-gray-200 pl-3 text-sm text-gray-700">
                {fmtDate(booking.startsAt)}, {fmtTime(booking.startsAt)} — {c?.name}
              </p>
            </div>
          )}
        </div>

        {/* footer actions */}
        <footer className="border-t border-gray-200 px-5 py-4">
          {error && (
            <p role="alert" className="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          {mode !== "view" && (
            <label className="mb-3 flex items-start gap-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="mt-0.5 h-4 w-4 border-gray-300 text-wj-dark focus:ring-wj-dark"
              />
              Email the customer about this change
            </label>
          )}

          {mode === "view" && active && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("reschedule")}
                className="inline-flex h-11 items-center justify-center bg-wj-dark text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
              >
                Move booking
              </button>
              <button
                type="button"
                onClick={() => setMode("confirm-cancel")}
                className="inline-flex h-11 items-center justify-center gap-1.5 border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                <Prohibit className="h-4 w-4" /> Cancel
              </button>
            </div>
          )}

          {mode === "reschedule" && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!picked || pending}
                onClick={() => run(() => adminReschedule(booking.id, picked!, notify), onClose)}
                className="inline-flex h-11 items-center justify-center bg-wj-dark text-sm font-semibold text-white transition-colors hover:bg-wj-hover disabled:bg-gray-200 disabled:text-gray-400"
              >
                {pending ? <CircleNotch className="h-5 w-5 animate-spin" /> : "Confirm new time"}
              </button>
              <button
                type="button"
                onClick={() => { setMode("view"); setPicked(null); setError(null) }}
                className="inline-flex h-11 items-center justify-center border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          )}

          {mode === "confirm-cancel" && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => adminCancel(booking.id, notify), onClose)}
                className="inline-flex h-11 items-center justify-center bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {pending ? <CircleNotch className="h-5 w-5 animate-spin" /> : "Yes, cancel"}
              </button>
              <button
                type="button"
                onClick={() => { setMode("view"); setError(null) }}
                className="inline-flex h-11 items-center justify-center border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Keep it
              </button>
            </div>
          )}
        </footer>
      </aside>
    </div>
  )
}
