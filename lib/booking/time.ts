import { TIMEZONE } from "./config"

/**
 * Wall-clock ⇄ UTC conversion for a named timezone, without a date library.
 *
 * This exists because "09:00 on 12 August in Amsterdam" is not a fixed number
 * of hours from UTC — the Netherlands is UTC+1 in winter and UTC+2 in summer.
 * Adding a constant offset silently shifts every booking by an hour twice a
 * year, which is the classic scheduling bug.
 */

const dtf = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIMEZONE,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})

/** Milliseconds the zone is ahead of UTC at a given instant. */
function zoneOffsetMs(instant: Date): number {
  const parts = dtf.formatToParts(instant)
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value)
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") === 24 ? 0 : get("hour"),
    get("minute"),
    get("second"),
  )
  return asUtc - instant.getTime()
}

/**
 * "2026-08-12" + "09:00" in Amsterdam → the correct UTC instant.
 *
 * Two passes: guess using the offset at the naive instant, then re-check using
 * the offset at the guess. That second pass is what gets the DST changeover
 * days right.
 */
export function zonedToUtc(dateISO: string, timeHHMM: string): Date {
  const [y, m, d] = dateISO.split("-").map(Number)
  const [hh, mm] = timeHHMM.split(":").map(Number)
  const naive = Date.UTC(y, m - 1, d, hh, mm, 0)

  let instant = new Date(naive - zoneOffsetMs(new Date(naive)))
  instant = new Date(naive - zoneOffsetMs(instant))
  return instant
}

/** A UTC instant → "YYYY-MM-DD" as it reads on the wall in Amsterdam. */
export function utcToZonedDateISO(instant: Date): string {
  const p = dtf.formatToParts(instant)
  const get = (t: string) => p.find((x) => x.type === t)!.value
  return `${get("year")}-${get("month")}-${get("day")}`
}

/** A UTC instant → "HH:MM" as it reads on the wall in Amsterdam. */
export function utcToZonedTime(instant: Date): string {
  const p = dtf.formatToParts(instant)
  const get = (t: string) => p.find((x) => x.type === t)!.value
  return `${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}`
}

/** Weekday in the target zone. 0 = Sunday … 6 = Saturday. */
export function zonedWeekday(dateISO: string): number {
  // Midday avoids any chance of a DST shift moving the date.
  return zonedToUtc(dateISO, "12:00").getUTCDay()
}

/** "YYYY-MM-DD" for today in the target zone. */
export function todayISO(): string {
  return utcToZonedDateISO(new Date())
}

/** Advance an ISO date by n days, staying calendar-correct. */
export function addDaysISO(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

export const addMinutes = (d: Date, min: number) => new Date(d.getTime() + min * 60_000)

/** "09:00" + 210 → "12:30". Used to label a slot with its finish time. */
export function addMinutesToHHMM(timeHHMM: string, minutes: number): string {
  const [h, m] = timeHHMM.split(":").map(Number)
  const total = h * 60 + m + minutes
  const hh = Math.floor(total / 60) % 24
  return `${String(hh).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}

export const hhmmToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

/** Formats a booking window for display: "Tue 12 Aug · 09:00 – 12:30". */
export function formatSlotLabel(startsAt: Date, endsAt: Date, locale: "nl" | "en") {
  const day = new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    timeZone: TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(startsAt)
  return `${day} · ${utcToZonedTime(startsAt)} – ${utcToZonedTime(endsAt)}`
}
