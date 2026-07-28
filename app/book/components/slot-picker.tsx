"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  MoonStars,
  Sun,
  SunHorizon,
} from "@phosphor-icons/react"

import { useLanguage } from "@/contexts/LanguageContext"
import { TIMEZONE } from "@/lib/booking/config"
import type { DayAvailability, Slot } from "@/lib/booking/availability"

/**
 * Calendar beside a grouped time list.
 *
 * Times are banded into morning / afternoon / evening rather than listed flat:
 * people choose a part of the day first and a precise hour second, and three
 * short groups scan faster than one column of near-identical rows.
 *
 * Unavailable times are shown greyed with the reason, never removed — an empty
 * column reads as broken, a greyed one reads as busy. Every slot carries its
 * full range because the finish time moves with the add-ons chosen.
 */

interface Props {
  /** Must match exactly what will be booked, or the finish time shown is wrong. */
  deepCleaning: boolean
  washingUp: boolean
  value: string | null
  onSelect: (startsAt: string, endsAt: string) => void
}

const monthKey = (iso: string) => iso.slice(0, 7)
const hourOf = (hhmm: string) => Number(hhmm.slice(0, 2))

type BandId = "morning" | "afternoon" | "evening"

const BANDS: { id: BandId; Icon: typeof Sun; tint: string; from: number; to: number }[] = [
  { id: "morning", Icon: SunHorizon, tint: "bg-amber-50 text-amber-600", from: 0, to: 11 },
  { id: "afternoon", Icon: Sun, tint: "bg-orange-50 text-orange-500", from: 12, to: 16 },
  { id: "evening", Icon: MoonStars, tint: "bg-indigo-50 text-indigo-500", from: 17, to: 23 },
]

export function SlotPicker({ deepCleaning, washingUp, value, onSelect }: Props) {
  const { language } = useLanguage()
  const nl = language === "nl"

  const [days, setDays] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeDate, setActiveDate] = useState<string | null>(null)
  const [monthOffset, setMonthOffset] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    const addons = washingUp ? "washing-up" : ""
    const url = `/api/availability?days=60&deep=${deepCleaning}&addons=${addons}`

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((data) => {
        if (cancelled) return
        setDays(data.days ?? [])
        // Land on the first day that actually has something free.
        const firstOpen = (data.days ?? []).find((d: DayAvailability) => d.hasAvailability)
        setActiveDate((current) => current ?? firstOpen?.date ?? null)
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
    // Re-fetching when the add-ons change is the point: a longer job has fewer
    // places it can fit, so the offered slots genuinely differ.
  }, [deepCleaning, washingUp, reloadKey])

  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days])

  const months = useMemo(() => {
    const seen: string[] = []
    for (const d of days) {
      const k = monthKey(d.date)
      if (!seen.includes(k)) seen.push(k)
    }
    return seen
  }, [days])

  const currentMonth = months[monthOffset] ?? months[0]

  /** Calendar cells for the visible month, padded to start on Monday. */
  const grid = useMemo(() => {
    if (!currentMonth) return []
    const [y, m] = currentMonth.split("-").map(Number)
    const first = new Date(Date.UTC(y, m - 1, 1))
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()
    const leading = (first.getUTCDay() + 6) % 7 // Monday-first

    const cells: (string | null)[] = Array(leading).fill(null)
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(`${currentMonth}-${String(d).padStart(2, "0")}`)
    }
    return cells
  }, [currentMonth])

  const activeDay = activeDate ? byDate.get(activeDate) : undefined

  /** For the empty state: the soonest day that still has room. */
  const nextOpen = useMemo(() => {
    if (!activeDate) return null
    return days.find((d) => d.date > activeDate && d.hasAvailability) ?? null
  }, [days, activeDate])

  const fmt = (opts: Intl.DateTimeFormatOptions, iso: string) =>
    new Intl.DateTimeFormat(nl ? "nl-NL" : "en-GB", { timeZone: TIMEZONE, ...opts }).format(
      new Date(`${iso}T12:00:00Z`),
    )

  const monthLabel = currentMonth ? fmt({ month: "long", year: "numeric" }, `${currentMonth}-01`) : ""

  const weekdayNames = nl
    ? ["ma", "di", "wo", "do", "vr", "za", "zo"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  const copy = nl
    ? {
        pickDate: "Kies een datum",
        pickTime: "Kies een tijd",
        noSlots: "Geen tijden vrij op deze dag.",
        jumpTo: "Ga naar",
        chooseDay: "Kies eerst een datum.",
        failed: "Beschikbaarheid kon niet worden geladen.",
        retry: "Opnieuw proberen",
        taken: "bezet",
        closed: "te laat",
        soon: "te kort dag",
        morning: "Ochtend",
        afternoon: "Middag",
        evening: "Avond",
        free: "vrij",
        today: "vandaag",
      }
    : {
        pickDate: "Select a date",
        pickTime: "Select a time",
        noSlots: "No times free on this day.",
        jumpTo: "Jump to",
        chooseDay: "Pick a date first.",
        failed: "Could not load availability.",
        retry: "Try again",
        taken: "booked",
        closed: "too late",
        soon: "too soon",
        morning: "Morning",
        afternoon: "Afternoon",
        evening: "Evening",
        free: "free",
        today: "today",
      }

  const bandLabel: Record<BandId, string> = {
    morning: copy.morning, afternoon: copy.afternoon, evening: copy.evening,
  }

  const todayISO = useMemo(
    () => new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date()),
    [],
  )

  if (error) {
    return (
      <div className="rounded-none border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-600">{copy.failed}</p>
        <button
          type="button"
          onClick={() => setReloadKey((n) => n + 1)}
          className="mt-3 text-sm font-semibold text-wj-dark underline underline-offset-2"
        >
          {copy.retry}
        </button>
      </div>
    )
  }

  if (loading) return <SlotPickerSkeleton />

  /** Slots for the active day, split into the three bands. */
  const grouped = BANDS.map((b) => ({
    ...b,
    slots: (activeDay?.slots ?? []).filter((s) => {
      const h = hourOf(s.time)
      return h >= b.from && h <= b.to
    }),
  })).filter((b) => b.slots.length > 0)

  return (
    <div className="grid gap-4 sm:grid-cols-[260px_1fr] lg:items-start">
      {/* ------------------------------------------------------- calendar */}
      <div className="rounded-none border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 first-letter:uppercase">{monthLabel}</p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setMonthOffset((n) => Math.max(0, n - 1))}
              disabled={monthOffset === 0}
              aria-label={nl ? "Vorige maand" : "Previous month"}
              className="flex h-8 w-8 items-center justify-center rounded-none text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-30"
            >
              <CaretLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMonthOffset((n) => Math.min(months.length - 1, n + 1))}
              disabled={monthOffset >= months.length - 1}
              aria-label={nl ? "Volgende maand" : "Next month"}
              className="flex h-8 w-8 items-center justify-center rounded-none text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-30"
            >
              <CaretRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center">
          {weekdayNames.map((w) => (
            <div key={w} className="pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              {w}
            </div>
          ))}

          {grid.map((date, i) => {
            if (!date) return <div key={`pad-${i}`} />
            const day = byDate.get(date)
            const open = Boolean(day?.hasAvailability)
            const selected = date === activeDate
            const isToday = date === todayISO
            const dayNum = Number(date.slice(-2))

            return (
              <button
                key={date}
                type="button"
                disabled={!open}
                onClick={() => setActiveDate(date)}
                aria-pressed={selected}
                aria-label={fmt({ weekday: "long", day: "numeric", month: "long" }, date)}
                className={`relative flex h-10 items-center justify-center rounded-none text-sm transition-colors ${
                  selected
                    ? "bg-wj-dark font-semibold text-white"
                    : open
                      ? "font-medium text-gray-900 hover:bg-gray-100"
                      : "cursor-not-allowed text-gray-300"
                }`}
              >
                {dayNum}
                {isToday && !selected && (
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 h-1 w-1 rounded-full bg-wj-dark"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------- times */}
      <div className="rounded-none border border-gray-200 bg-white p-4 sm:p-5">
        {!activeDay ? (
          <p className="py-8 text-center text-sm text-gray-500">{copy.chooseDay}</p>
        ) : (
          <>
            <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-gray-100 pb-3">
              <h3 className="text-sm font-semibold text-gray-900">{copy.pickTime}</h3>
              <p className="truncate text-sm text-gray-500 first-letter:uppercase">
                {fmt({ weekday: "long", day: "numeric", month: "long" }, activeDay.date)}
                {activeDay.date === todayISO && ` · ${copy.today}`}
              </p>
            </div>

            {grouped.length === 0 ? (
              <div className="py-10 text-center">
                <CalendarBlank className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-3 text-sm text-gray-600">{copy.noSlots}</p>
                {nextOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDate(nextOpen.date)
                      const m = months.indexOf(monthKey(nextOpen.date))
                      if (m >= 0) setMonthOffset(m)
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-none border border-gray-200 px-3 py-2 text-sm font-semibold text-wj-dark transition-colors hover:bg-gray-50"
                  >
                    {copy.jumpTo} {fmt({ weekday: "short", day: "numeric", month: "short" }, nextOpen.date)}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {grouped.map((group) => (
                  <div key={group.id}>
                    <div className="mb-2.5 flex items-center gap-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-none ${group.tint}`}>
                        <group.Icon weight="fill" className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {bandLabel[group.id]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {group.slots.filter((s) => s.available).length} {copy.free}
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.slots.map((slot: Slot) => (
                        <SlotPill
                          key={slot.startsAtISO}
                          slot={slot}
                          selected={value === slot.startsAtISO}
                          reasonLabel={
                            slot.reason === "booked" ? copy.taken
                            : slot.reason === "closed" ? copy.closed
                            : slot.reason === "too-soon" ? copy.soon
                            : null
                          }
                          onSelect={() => onSelect(slot.startsAtISO, slot.endsAtISO)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SlotPill({
  slot, selected, reasonLabel, onSelect,
}: {
  slot: Slot
  selected: boolean
  reasonLabel: string | null
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      disabled={!slot.available}
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex items-center gap-2.5 rounded-none border px-3 py-2.5 text-left transition-all duration-150 ${
        selected
          ? "border-wj-dark bg-wj-dark text-white shadow-[0_4px_12px_-4px_rgba(44,95,112,0.5)]"
          : slot.available
            ? "border-gray-200 bg-white hover:border-wj-dark/40 hover:bg-gray-50"
            : "cursor-not-allowed border-gray-100 bg-gray-50"
      }`}
    >
      {/* radio, matching the reference: state is legible without relying on fill */}
      <span
        aria-hidden
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] ${
          selected
            ? "border-white"
            : slot.available
              ? "border-gray-300"
              : "border-gray-200"
        }`}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-semibold tabular-nums ${
            selected ? "text-white" : slot.available ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {slot.time}
        </span>
        <span
          className={`block text-xs tabular-nums ${
            selected ? "text-white/70" : slot.available ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {reasonLabel ?? `– ${slot.endTime}`}
        </span>
      </span>

      {selected && <ArrowRight weight="bold" className="h-3.5 w-3.5 flex-shrink-0 text-white" />}
    </button>
  )
}

/** Matches the real layout so the panel doesn't jump when data lands. */
function SlotPickerSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-[260px_1fr] lg:items-start">
      <div className="rounded-none border border-gray-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-24 rounded-none bg-gray-200" />
          <div className="flex gap-1">
            <div className="h-8 w-8 rounded-none bg-gray-100" />
            <div className="h-8 w-8 rounded-none bg-gray-100" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-9 rounded-none bg-gray-100" />
          ))}
        </div>
      </div>
      <div className="rounded-none border border-gray-200 bg-white p-5">
        <div className="mb-4 h-4 w-32 rounded-none bg-gray-200" />
        {[0, 1].map((g) => (
          <div key={g} className="mb-5">
            <div className="mb-2.5 h-4 w-28 rounded-none bg-gray-200" />
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-14 rounded-none bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
