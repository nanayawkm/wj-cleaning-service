import {
  BASE_DURATION_MIN,
  BOOKING_WINDOW_DAYS,
  MIN_NOTICE_HOURS,
} from "./config"
import {
  addDaysISO,
  addMinutes,
  addMinutesToHHMM,
  hhmmToMinutes,
  todayISO,
  zonedToUtc,
  zonedWeekday,
} from "./time"

export interface AvailabilityRule {
  weekday: number // 0 = Sunday
  start_time: string // "09:00:00"
  active: boolean
}

export interface AvailabilityOverride {
  on_date: string // "2026-08-12"
  start_time: string | null // null = the whole day
  kind: "block" | "open"
}

export interface BusyInterval {
  starts_at: string
  ends_at: string
}

export interface Slot {
  /** "09:00" — wall clock in Amsterdam. */
  time: string
  /** "12:30" — when the customer's job finishes, buffer excluded. */
  endTime: string
  startsAtISO: string
  endsAtISO: string
  available: boolean
  /** Why not, when unavailable. Shown greyed rather than hidden. */
  reason?: "booked" | "too-soon" | "past" | "closed"
}

export interface DayAvailability {
  date: string
  slots: Slot[]
  /** True if at least one slot can still be taken. */
  hasAvailability: boolean
}

const hhmm = (t: string) => t.slice(0, 5)

/**
 * Which start times exist on a date, before any booking is considered.
 *
 * The weekly template defines the normal week; overrides beat it. A `block`
 * with no time closes the whole day; with a time it removes that one slot. An
 * `open` adds a slot the template does not have — an evening, or a Sunday.
 */
function templateSlotsFor(
  dateISO: string,
  rules: AvailabilityRule[],
  overrides: AvailabilityOverride[],
): string[] {
  const dayOverrides = overrides.filter((o) => o.on_date === dateISO)

  if (dayOverrides.some((o) => o.kind === "block" && o.start_time === null)) return []

  const weekday = zonedWeekday(dateISO)
  const times = new Set(
    rules.filter((r) => r.active && r.weekday === weekday).map((r) => hhmm(r.start_time)),
  )

  for (const o of dayOverrides) {
    if (!o.start_time) continue
    if (o.kind === "open") times.add(hhmm(o.start_time))
    else times.delete(hhmm(o.start_time))
  }

  return [...times].sort()
}

/**
 * The latest a job may finish on a given day.
 *
 * Derived rather than configured: the last start the template offers, plus one
 * standard clean. With starts at 09:00/12:00/15:00 that gives 18:00. If Jackie
 * adds an 18:00 start, closing moves to 21:00 on its own — so the working day
 * follows her availability instead of a hardcoded number.
 */
function closingMinutes(templateTimes: string[]): number {
  if (!templateTimes.length) return 0
  const latest = templateTimes[templateTimes.length - 1]
  return hhmmToMinutes(latest) + BASE_DURATION_MIN
}

/**
 * Availability for one day, for a job of a known length.
 *
 * `blockedMin` is the duration plus travel buffer — what actually occupies the
 * calendar. `durationMin` is what the customer sees as their finish time.
 * Keeping them separate is why a 09:00 job can be labelled "09:00 – 12:30"
 * while still protecting the half hour after it.
 */
export function availabilityForDay(
  dateISO: string,
  {
    rules,
    overrides,
    busy,
    durationMin,
    blockedMin,
    now = new Date(),
  }: {
    rules: AvailabilityRule[]
    overrides: AvailabilityOverride[]
    busy: BusyInterval[]
    durationMin: number
    blockedMin: number
    now?: Date
  },
): DayAvailability {
  const template = templateSlotsFor(dateISO, rules, overrides)
  const closesAt = closingMinutes(template)
  const earliest = new Date(now.getTime() + MIN_NOTICE_HOURS * 3600_000)

  const busyRanges = busy.map((b) => ({
    start: new Date(b.starts_at).getTime(),
    end: new Date(b.ends_at).getTime(),
  }))

  const slots: Slot[] = template.map((time) => {
    const startsAt = zonedToUtc(dateISO, time)
    const customerEnd = addMinutes(startsAt, durationMin)
    const blockedEnd = addMinutes(startsAt, blockedMin)

    const base = {
      time,
      endTime: addMinutesToHHMM(time, durationMin),
      startsAtISO: startsAt.toISOString(),
      endsAtISO: blockedEnd.toISOString(),
    }

    // Closing is judged on the customer's job, not on the travel buffer.
    // The buffer is Jackie's journey home; counting it here rejected the last
    // slot of every day — a 15:00 job finishes at 18:00 but blocks to 18:30.
    // It still applies to the overlap test below, where it belongs.
    if (hhmmToMinutes(time) + durationMin > closesAt) {
      return { ...base, available: false, reason: "closed" as const }
    }

    if (startsAt.getTime() < now.getTime()) {
      return { ...base, available: false, reason: "past" as const }
    }

    if (startsAt.getTime() < earliest.getTime()) {
      return { ...base, available: false, reason: "too-soon" as const }
    }

    // Half-open comparison: a job ending at 12:30 does not clash with one
    // starting at 12:30.
    const clashes = busyRanges.some(
      (b) => startsAt.getTime() < b.end && blockedEnd.getTime() > b.start,
    )
    if (clashes) return { ...base, available: false, reason: "booked" as const }

    return { ...base, available: true }
  })

  return {
    date: dateISO,
    slots,
    hasAvailability: slots.some((s) => s.available),
  }
}

/** Availability across a range, for painting the calendar. */
export function availabilityForRange(
  fromISO: string,
  days: number,
  args: Parameters<typeof availabilityForDay>[1],
): DayAvailability[] {
  return Array.from({ length: days }, (_, i) =>
    availabilityForDay(addDaysISO(fromISO, i), args),
  )
}

/** The window the calendar may show: today through the booking horizon. */
export function bookingWindow() {
  const from = todayISO()
  return { from, to: addDaysISO(from, BOOKING_WINDOW_DAYS), days: BOOKING_WINDOW_DAYS }
}
