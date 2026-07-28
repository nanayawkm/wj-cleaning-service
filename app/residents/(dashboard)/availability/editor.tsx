"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, Plus, Trash, X } from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import { Panel } from "../ui"
import { addOverride, removeOverride, toggleSlot } from "./actions"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const TIMES = ["09:00", "12:00", "15:00", "18:00"]

interface Rule {
  id: string
  weekday: number
  start_time: string
  active: boolean
}
interface Override {
  id: string
  on_date: string
  start_time: string | null
  kind: string
  reason: string | null
}

/**
 * Two controls, matching how availability is actually decided: a weekly
 * template for the normal week, and dated exceptions that beat it.
 *
 * Nothing about the working week is hardcoded, so hours change without a
 * developer — and the booking calendar stops offering times that cannot be
 * worked, which is what prevents the reschedule calls.
 */
export function AvailabilityEditor({ rules, overrides }: { rules: Rule[]; overrides: Override[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [date, setDate] = useState("")
  const [reason, setReason] = useState("")

  const has = (weekday: number, time: string) =>
    rules.some((r) => r.weekday === weekday && r.start_time.slice(0, 5) === time && r.active)

  const flip = (weekday: number, time: string) =>
    startTransition(async () => {
      await toggleSlot(weekday, time, !has(weekday, time))
      router.refresh()
    })

  const block = () =>
    startTransition(async () => {
      if (!date) return
      await addOverride(date, reason)
      setDate("")
      setReason("")
      router.refresh()
    })

  const openCount = TIMES.reduce(
    (n, t) => n + [0, 1, 2, 3, 4, 5, 6].filter((d) => has(d, t)).length,
    0,
  )

  return (
    <div className="space-y-4">
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-semibold text-gray-900">Your normal week</h2>
          <p className="text-sm text-gray-500">
            {openCount} slot{openCount === 1 ? "" : "s"} open per week
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Tap a time to turn it on or off. This is what the booking calendar offers by default.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[26rem] text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="pb-3 pr-4">Day</th>
                {TIMES.map((t) => (
                  <th key={t} className="pb-3 pr-3 tabular-nums">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5, 6, 0].map((weekday) => (
                <tr key={weekday}>
                  <td className="py-2.5 pr-4 font-medium text-gray-900">
                    <span className="hidden sm:inline">{DAYS[weekday]}</span>
                    <span className="sm:hidden">{SHORT[weekday]}</span>
                  </td>
                  {TIMES.map((time) => {
                    const on = has(weekday, time)
                    return (
                      <td key={time} className="py-2.5 pr-3">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => flip(weekday, time)}
                          aria-pressed={on}
                          aria-label={`${DAYS[weekday]} ${time}`}
                          className={`flex h-10 w-14 items-center justify-center border text-xs font-medium transition-colors disabled:opacity-50 ${
                            on
                              ? "border-wj-dark bg-wj-dark text-white"
                              : "border-gray-200 text-gray-300 hover:border-gray-400 hover:text-gray-500"
                          }`}
                        >
                          {on ? <Check weight="bold" className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Closing time is derived from the latest start you enable, so turning
            on 18:00 extends the working day rather than being ignored. */}
        <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
          A job runs 3 hours plus any extras, so the last start decides when your day ends.
        </p>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h2 className="font-semibold text-gray-900">Days off</h2>
        <p className="mt-1 text-sm text-gray-500">
          Holidays, sick days, anything already booked elsewhere. These beat the weekly template.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="date" className="block text-xs font-medium text-gray-600">Date</label>
            <Input
              id="date"
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 h-11 w-44 rounded-none border-gray-300 bg-white"
            />
          </div>
          <div className="min-w-[12rem] flex-1">
            <label htmlFor="reason" className="block text-xs font-medium text-gray-600">
              Reason (optional)
            </label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Holiday"
              className="mt-1 h-11 rounded-none border-gray-300 bg-white"
            />
          </div>
          <button
            type="button"
            onClick={block}
            disabled={!date || pending}
            className="inline-flex h-11 items-center justify-center bg-wj-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-wj-hover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Block day
          </button>
        </div>

        {overrides.length > 0 ? (
          <ul className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
            {overrides.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-sm text-gray-900">
                  {new Intl.DateTimeFormat("en-GB", {
                    weekday: "short", day: "numeric", month: "short", year: "numeric",
                  }).format(new Date(`${o.on_date}T12:00:00Z`))}
                  {o.start_time ? (
                    <span className="text-gray-500"> · {o.start_time.slice(0, 5)} only</span>
                  ) : null}
                  {o.reason ? <span className="text-gray-500"> — {o.reason}</span> : null}
                </span>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await removeOverride(o.id)
                      router.refresh()
                    })
                  }
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 border-t border-gray-100 pt-4 text-sm text-gray-400">
            No days blocked. Your normal week applies.
          </p>
        )}
      </Panel>
    </div>
  )
}
