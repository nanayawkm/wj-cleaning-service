import { availabilityForDay } from "../availability"
import { calculateQuote } from "../pricing"
import { zonedToUtc, utcToZonedTime, addMinutesToHHMM, zonedWeekday } from "../time"

let failures = 0
const check = (name: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failures++
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}${ok ? "" : `\n         got ${JSON.stringify(actual)}\n         want ${JSON.stringify(expected)}`}`)
}

console.log("\n— timezone —")
// Netherlands is UTC+1 in winter, UTC+2 in summer. A fixed offset would
// silently shift every booking by an hour twice a year.
check("winter 09:00 → 08:00Z", zonedToUtc("2026-01-15", "09:00").toISOString(), "2026-01-15T08:00:00.000Z")
check("summer 09:00 → 07:00Z", zonedToUtc("2026-08-12", "09:00").toISOString(), "2026-08-12T07:00:00.000Z")
// 2026 changeovers: 29 March and 25 October
check("day before spring DST", zonedToUtc("2026-03-28", "09:00").toISOString(), "2026-03-28T08:00:00.000Z")
check("day of spring DST", zonedToUtc("2026-03-29", "09:00").toISOString(), "2026-03-29T07:00:00.000Z")
check("day of autumn DST", zonedToUtc("2026-10-25", "09:00").toISOString(), "2026-10-25T08:00:00.000Z")
check("round-trips back to 09:00", utcToZonedTime(zonedToUtc("2026-08-12", "09:00")), "09:00")
check("2026-08-12 is a Wednesday", zonedWeekday("2026-08-12"), 3)
check("09:00 + 210min = 12:30", addMinutesToHHMM("09:00", 210), "12:30")

console.log("\n— pricing —")
const bands = [
  { id: "b1", min_m2: 65, max_m2: 99, label_nl: "65 – 99 m²", label_en: "65 – 99 m²", base_cents: 8900, deep_cents: 6000, base_duration_min: 120, sort_order: 1 },
  { id: "b2", min_m2: 100, max_m2: 139, label_nl: "100 – 139 m²", label_en: "100 – 139 m²", base_cents: 11900, deep_cents: 7000, base_duration_min: 180, sort_order: 2 },
]
const addons = [
  { id: "a1", slug: "deep-cleaning", name_nl: "Dieptereiniging", name_en: "Deep cleaning", price_cents: 6000, duration_min: 60, sort_order: 1 },
  { id: "a2", slug: "washing-up", name_nl: "Afwas doen", name_en: "Washing up", price_cents: 1200, duration_min: 30, sort_order: 2 },
]

const plain = calculateQuote({ band: bands[0], deepCleaning: false, addonSlugs: [], addons })
check("general only = €89", plain.totalCents, 8900)
check("65–99 m² is a two-hour job", plain.durationMin, 120)
check("blocks 150 min with buffer", plain.blockedMin, 150)

const deep = calculateQuote({ band: bands[0], deepCleaning: true, addonSlugs: [], addons })
check("general + deep = €149 (matches flyer)", deep.totalCents, 14900)
check("65–99 + deep = 180 min", deep.durationMin, 180)

const deepBig = calculateQuote({ band: bands[1], deepCleaning: true, addonSlugs: [], addons })
check("100–139 + deep = €189 (matches flyer)", deepBig.totalCents, 18900)
check("100–139 stays a three-hour base", deepBig.durationMin, 240)

const bigPlain = calculateQuote({ band: bands[1], deepCleaning: false, addonSlugs: [], addons })
check("100–139 alone = 180 min", bigPlain.durationMin, 180)

const everything = calculateQuote({ band: bands[0], deepCleaning: true, addonSlugs: ["washing-up"], addons })
check("both add-ons = €161", everything.totalCents, 16100)
check("65–99 + both add-ons = 210 min", everything.durationMin, 210)

const discounted = calculateQuote({
  band: bands[1], deepCleaning: false, addonSlugs: [], addons,
  discount: { code: "WELKOM20", percent_off: 20 },
})
check("20% off €119 = €95.20", discounted.totalCents, 9520)

console.log("\n— availability —")
const rules = [1, 2, 3, 4, 5, 6].flatMap((weekday) =>
  ["09:00:00", "12:00:00", "15:00:00"].map((start_time) => ({ weekday, start_time, active: true })),
)
// Fixed "now" well before the test dates so notice rules never interfere.
const now = new Date("2026-08-01T08:00:00Z")
const base = { rules, overrides: [], busy: [], durationMin: 180, blockedMin: 210, now }

const wed = availabilityForDay("2026-08-12", base)
check("Wednesday offers 3 slots", wed.slots.map((s) => s.time), ["09:00", "12:00", "15:00"])
check("all three bookable", wed.slots.filter((s) => s.available).length, 3)
check("09:00 job labelled to 12:00", wed.slots[0].endTime, "12:00")

const sun = availabilityForDay("2026-08-16", base)
check("Sunday is closed", sun.slots.length, 0)
check("Sunday has no availability", sun.hasAvailability, false)

// A 4.5h job (both add-ons) cannot fit the 15:00 slot before 18:00 closing.
const longJob = availabilityForDay("2026-08-12", { ...base, durationMin: 270, blockedMin: 300 })
check("long job: 15:00 rejected as closed", longJob.slots[2].reason, "closed")
check("long job: 09:00 still fine", longJob.slots[0].available, true)
check("long job: slot still shown, not hidden", longJob.slots.length, 3)

// An existing 09:00–12:30 booking must block 12:00 too, via the buffer.
const withBooking = availabilityForDay("2026-08-12", {
  ...base,
  busy: [{ starts_at: "2026-08-12T07:00:00Z", ends_at: "2026-08-12T10:30:00Z" }],
})
check("booked slot marked booked", withBooking.slots[0].reason, "booked")
check("buffer also blocks 12:00", withBooking.slots[1].reason, "booked")
check("15:00 remains free", withBooking.slots[2].available, true)

const blockedDay = availabilityForDay("2026-08-12", {
  ...base,
  overrides: [{ on_date: "2026-08-12", start_time: null, kind: "block" as const }],
})
check("whole-day block closes the day", blockedDay.slots.length, 0)

const blockedSlot = availabilityForDay("2026-08-12", {
  ...base,
  overrides: [{ on_date: "2026-08-12", start_time: "12:00:00", kind: "block" as const }],
})
check("single-slot block removes just that one", blockedSlot.slots.map((s) => s.time), ["09:00", "15:00"])

const openedSunday = availabilityForDay("2026-08-16", {
  ...base,
  overrides: [{ on_date: "2026-08-16", start_time: "10:00:00", kind: "open" as const }],
})
check("override can open a Sunday", openedSunday.slots.map((s) => s.time), ["10:00"])

const soon = availabilityForDay("2026-08-12", { ...base, now: new Date("2026-08-11T18:00:00Z") })
check("inside 24h notice is refused", soon.slots[0].reason, "too-soon")

console.log(failures ? `\n${failures} FAILURE(S)\n` : "\nall passed\n")
process.exit(failures ? 1 : 0)
