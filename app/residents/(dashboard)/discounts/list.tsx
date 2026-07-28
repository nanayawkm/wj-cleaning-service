"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowsClockwise, CircleNotch, Plus, Tag, X } from "@phosphor-icons/react"

import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { Panel } from "../ui"
import { createDiscount, setDiscountActive } from "./actions"

export interface DiscountRow {
  id: string
  code: string
  percentOff: number
  label: string | null
  active: boolean
  expiresAt: string | null
  maxUses: number | null
  timesUsed: number
}

const PRESETS = [10, 15, 20, 25]

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, day: "numeric", month: "short", year: "numeric",
  }).format(new Date(iso))

/** A code with no uses left, or past its end date, is done regardless of the switch. */
const spent = (r: DiscountRow) =>
  (r.maxUses !== null && r.timesUsed >= r.maxUses) ||
  (r.expiresAt !== null && new Date(r.expiresAt).getTime() < Date.now())

export function DiscountList({
  rows,
  cheapestCents,
  dearestCents,
}: {
  rows: DiscountRow[]
  cheapestCents: number
  dearestCents: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const toggle = (id: string, active: boolean) =>
    startTransition(async () => {
      await setDiscountActive(id, active)
      router.refresh()
    })

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center gap-1.5 bg-wj-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
        >
          <Plus weight="bold" className="h-4 w-4" />
          New code
        </button>
      </div>

      {rows.length === 0 ? (
        <Panel className="p-12 text-center">
          <Tag className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 font-medium text-gray-900">No codes yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Make one for a flyer, then print the code on it.
          </p>
        </Panel>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const done = spent(r)
            const pct = r.maxUses ? Math.min(100, (r.timesUsed / r.maxUses) * 100) : 0
            return (
              <Panel key={r.id} className={`p-4 ${done ? "opacity-70" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-base font-semibold tracking-wide text-gray-900">
                        {r.code}
                      </span>
                      <span className="bg-wj-dark px-2 py-0.5 text-xs font-semibold text-white">
                        {r.percentOff}%
                      </span>
                      <StatusChip done={done} active={r.active} />
                    </div>
                    {r.label && <p className="mt-1 text-sm text-gray-500">{r.label}</p>}
                  </div>

                  <label className="flex flex-shrink-0 cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={r.active}
                      disabled={pending}
                      onChange={(e) => toggle(r.id, e.target.checked)}
                      className="h-5 w-5 border-gray-300 text-wj-dark focus:ring-wj-dark"
                    />
                    {r.active ? "On" : "Off"}
                  </label>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 pt-3 text-sm">
                  <span className="text-gray-600">
                    {r.maxUses ? (
                      <>
                        <span className="font-medium text-gray-900 tabular-nums">
                          {r.timesUsed} of {r.maxUses}
                        </span>{" "}
                        used
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-gray-900 tabular-nums">{r.timesUsed}</span>{" "}
                        used · no limit
                      </>
                    )}
                  </span>
                  {r.expiresAt && (
                    <span className="text-gray-600">
                      {new Date(r.expiresAt).getTime() < Date.now() ? "Ended" : "Ends"}{" "}
                      {fmtDate(r.expiresAt)}
                    </span>
                  )}
                </div>

                {/* A bar beats "47 of 100" — you can see at a glance how much
                    of a print run is still out there. */}
                {r.maxUses !== null && (
                  <div className="mt-2 h-1.5 w-full bg-gray-100">
                    <div
                      className={`h-full transition-[width] ${done ? "bg-gray-400" : "bg-wj-dark"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </Panel>
            )
          })}
        </div>
      )}

      {open && (
        <NewCodePanel
          onClose={() => setOpen(false)}
          cheapestCents={cheapestCents}
          dearestCents={dearestCents}
        />
      )}
    </>
  )
}

function StatusChip({ done, active }: { done: boolean; active: boolean }) {
  const [text, cls] = done
    ? ["Finished", "bg-gray-100 text-gray-600 ring-gray-500/20"]
    : active
      ? ["Live", "bg-emerald-50 text-emerald-700 ring-emerald-600/20"]
      : ["Off", "bg-amber-50 text-amber-700 ring-amber-600/20"]
  return (
    <span className={`px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>{text}</span>
  )
}

function NewCodePanel({
  onClose,
  cheapestCents,
  dearestCents,
}: {
  onClose: () => void
  cheapestCents: number
  dearestCents: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [percent, setPercent] = useState(20)
  const [custom, setCustom] = useState(false)
  const [label, setLabel] = useState("")
  const [maxUses, setMaxUses] = useState("")
  const [endsOn, setEndsOn] = useState("")

  // No 0/O/1/I — these get read off paper and typed by hand.
  const generate = () => {
    const alphabet = "ACDEFGHJKLMNPQRSTUVWXYZ23456789"
    const pick = () => alphabet[Math.floor(Math.random() * alphabet.length)]
    setCode("WJ-" + Array.from({ length: 4 }, pick).join(""))
  }

  const after = (cents: number) => formatCents(Math.round(cents * (1 - percent / 100)), "nl")

  const submit = () =>
    startTransition(async () => {
      setError(null)
      const r = await createDiscount({ code, percentOff: percent, label, maxUses, endsOn })
      if (r.ok) {
        router.refresh()
        onClose()
      } else {
        setError(r.error)
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
        aria-label="New discount code"
        className="relative flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">New code</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div>
            <label htmlFor="dc-code" className="text-sm font-medium text-gray-700">
              Code customers type
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="dc-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="WELKOM20"
                autoCapitalize="characters"
                className="h-11 min-w-0 flex-1 border border-gray-300 bg-white px-3 font-mono text-sm uppercase tracking-wide outline-none focus:border-wj-dark"
              />
              <button
                type="button"
                onClick={generate}
                className="inline-flex h-11 flex-shrink-0 items-center gap-1.5 border border-gray-300 px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <ArrowsClockwise className="h-4 w-4" />
                Generate
              </button>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700">Discount</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setPercent(n); setCustom(false) }}
                  aria-pressed={!custom && percent === n}
                  className={`h-11 w-16 border text-sm font-semibold transition-colors ${
                    !custom && percent === n
                      ? "border-wj-dark bg-wj-dark text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {n}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustom(true)}
                aria-pressed={custom}
                className={`h-11 px-4 border text-sm font-semibold transition-colors ${
                  custom
                    ? "border-wj-dark bg-wj-dark text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Other
              </button>
            </div>
            {custom && (
              <input
                type="number"
                min={1}
                max={100}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                aria-label="Custom percentage"
                className="mt-2 h-11 w-28 border border-gray-300 bg-white px-3 text-sm tabular-nums outline-none focus:border-wj-dark"
              />
            )}
          </div>

          <div>
            <label htmlFor="dc-label" className="text-sm font-medium text-gray-700">
              What&rsquo;s it for?
            </label>
            <input
              id="dc-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Flyer — welcome offer"
              className="mt-1.5 h-11 w-full border border-gray-300 bg-white px-3 text-sm outline-none focus:border-wj-dark"
            />
            <p className="mt-1 text-xs text-gray-500">Only you see this.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dc-max" className="text-sm font-medium text-gray-700">Stop after</label>
              <input
                id="dc-max"
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="100"
                className="mt-1.5 h-11 w-full border border-gray-300 bg-white px-3 text-sm tabular-nums outline-none focus:border-wj-dark"
              />
            </div>
            <div>
              <label htmlFor="dc-ends" className="text-sm font-medium text-gray-700">Ends on</label>
              <input
                id="dc-ends"
                type="date"
                value={endsOn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setEndsOn(e.target.value)}
                className="mt-1.5 h-11 w-full border border-gray-300 bg-white px-3 text-sm outline-none focus:border-wj-dark"
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-gray-500">Leave either blank for no limit.</p>

          {/* The point of this panel: what the percentage actually costs, on
              her real prices, before she commits to it. */}
          <div className="border border-gray-200 bg-gray-50/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              What customers pay
            </p>
            <p className="mt-2 text-sm text-gray-700">
              A {formatCents(cheapestCents, "nl")} clean becomes{" "}
              <span className="font-semibold text-wj-dark">{after(cheapestCents)}</span>
            </p>
            <p className="mt-1 text-sm text-gray-700">
              A {formatCents(dearestCents, "nl")} clean becomes{" "}
              <span className="font-semibold text-wj-dark">{after(dearestCents)}</span>
            </p>
          </div>

          {error && (
            <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
              {error}
            </p>
          )}
        </div>

        <footer className="border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={submit}
            disabled={pending || !code.trim()}
            className="inline-flex h-11 w-full items-center justify-center bg-wj-dark text-sm font-semibold text-white transition-colors hover:bg-wj-hover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {pending ? <CircleNotch className="h-5 w-5 animate-spin" /> : "Create code"}
          </button>
        </footer>
      </aside>
    </div>
  )
}
