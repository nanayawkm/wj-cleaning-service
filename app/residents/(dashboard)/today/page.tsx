import Link from "next/link"
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr"

import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { getBookingsForDay } from "../queries"
import { PageHeader, Panel } from "../ui"
import { TodayList } from "./today-list"

export const dynamic = "force-dynamic"

const todayISO = () => new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date())

const shift = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>
}) {
  const { d } = await searchParams
  // Only accept a clean date; anything else falls back to today rather than
  // being handed to the date parser.
  const date = d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : todayISO()
  const bookings = await getBookingsForDay(date)

  const isToday = date === todayISO()
  const label = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, weekday: "long", day: "numeric", month: "long",
  }).format(new Date(`${date}T12:00:00Z`))

  const live = bookings.filter((b) => b.status !== "cancelled")
  const value = live.reduce((s, b) => s + b.totalCents, 0)
  const minutes = live.reduce((s, b) => s + b.durationMin, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={isToday ? "Today" : label}
        hint={
          live.length
            ? `${live.length} job${live.length === 1 ? "" : "s"} · ${Math.floor(minutes / 60)}h ${minutes % 60}m · ${formatCents(value, "nl")}`
            : "No jobs scheduled."
        }
        action={
          <div className="flex flex-shrink-0 gap-1">
            <Link
              href={`/residents/today?d=${shift(date, -1)}`}
              aria-label="Previous day"
              className="flex h-11 w-11 items-center justify-center border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50"
            >
              <CaretLeft className="h-4 w-4" />
            </Link>
            {!isToday && (
              <Link
                href="/residents/today"
                className="flex h-11 items-center justify-center border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Today
              </Link>
            )}
            <Link
              href={`/residents/today?d=${shift(date, 1)}`}
              aria-label="Next day"
              className="flex h-11 w-11 items-center justify-center border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50"
            >
              <CaretRight className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      {isToday && <p className="mb-4 text-sm capitalize text-gray-500">{label}</p>}

      <TodayList bookings={bookings} />
    </div>
  )
}
