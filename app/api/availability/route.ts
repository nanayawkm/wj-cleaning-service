import { NextResponse } from "next/server"
import { z } from "zod"

import { availabilityForRange, bookingWindow } from "@/lib/booking/availability"
import { BASE_DURATION_MIN, TRAVEL_BUFFER_MIN } from "@/lib/booking/config"
import {
  getAddons,
  getAvailabilityOverrides,
  getAvailabilityRules,
  getBusyIntervals,
} from "@/lib/booking/queries"
import { addDaysISO, todayISO } from "@/lib/booking/time"

/**
 * Free/busy for the booking calendar.
 *
 * Duration is derived here from the chosen add-ons rather than accepted from
 * the client — otherwise a caller could ask for a 30-minute job, take a slot,
 * and turn up needing four and a half hours.
 *
 * The response contains no customer data of any kind: times and booleans only.
 */

const querySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  days: z.coerce.number().int().min(1).max(90).optional(),
  deep: z.enum(["true", "false"]).optional(),
  addons: z.string().optional(), // comma-separated slugs
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 })
  }

  const window = bookingWindow()
  const from = parsed.data.from && parsed.data.from >= window.from ? parsed.data.from : window.from
  const days = parsed.data.days ?? 35
  const to = addDaysISO(from, days)

  // Never offer beyond the booking horizon, whatever was asked for.
  if (from > window.to) {
    return NextResponse.json({ days: [] })
  }

  try {
    const [rules, overrides, busy, addons] = await Promise.all([
      getAvailabilityRules(),
      getAvailabilityOverrides(from, to),
      getBusyIntervals(from, to),
      getAddons(),
    ])

    const wantedSlugs = (parsed.data.addons ?? "").split(",").filter(Boolean)
    const deepCleaning = parsed.data.deep === "true"

    let durationMin = BASE_DURATION_MIN
    if (deepCleaning) durationMin += addons.find((a) => a.slug === "deep-cleaning")?.duration_min ?? 60
    for (const slug of wantedSlugs) {
      if (slug === "deep-cleaning") continue
      durationMin += addons.find((a) => a.slug === slug)?.duration_min ?? 0
    }

    const result = availabilityForRange(from, days, {
      rules,
      overrides,
      busy,
      durationMin,
      blockedMin: durationMin + TRAVEL_BUFFER_MIN,
    })

    return NextResponse.json(
      { from, to, durationMin, days: result },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (err) {
    console.error("[availability]", err)
    return NextResponse.json({ error: "Could not load availability" }, { status: 500 })
  }
}
