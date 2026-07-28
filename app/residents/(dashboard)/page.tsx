import Link from "next/link"
import { CalendarBlank, CurrencyEur, Plus, Warning } from "@phosphor-icons/react/dist/ssr"

import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"
import { getAdminBookings } from "./queries"
import { BookingsTable } from "./bookings-table"
import { PageHeader, Stat } from "./ui"

export const dynamic = "force-dynamic"

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings()

  const now = Date.now()
  const active = (b: (typeof bookings)[number]) =>
    b.status === "confirmed" || b.status === "rescheduled"

  const upcoming = bookings.filter((b) => active(b) && new Date(b.startsAt).getTime() >= now)
  const upcomingValue = upcoming.reduce((s, b) => s + b.totalCents, 0)

  // Earned this month: jobs that have happened and were not cancelled, whether
  // or not the cash has arrived yet.
  const monthKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit" })
  const thisMonth = monthKey.format(new Date())
  const earned = bookings
    .filter(
      (b) =>
        b.status !== "cancelled" &&
        new Date(b.startsAt).getTime() < now &&
        monthKey.format(new Date(b.startsAt)) === thisMonth,
    )
    .reduce((s, b) => s + b.totalCents, 0)

  const owed = bookings
    .filter((b) => !b.paidAt && b.status !== "cancelled" && new Date(b.startsAt).getTime() < now)
    .reduce((s, b) => s + b.totalCents, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Bookings"
        hint={`Tap any booking to call, move, cancel or mark it done. Times are ${TIMEZONE.replace("_", " ")}.`}
        action={
          <Link
            href="/residents/new"
            className="inline-flex h-11 flex-shrink-0 items-center gap-1.5 bg-wj-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
          >
            <Plus weight="bold" className="h-4 w-4" />
            Add booking
          </Link>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat Icon={CalendarBlank} label="Upcoming jobs" value={String(upcoming.length)} />
        <Stat Icon={CurrencyEur} label="Upcoming value" value={formatCents(upcomingValue, "nl")} />
        <Stat Icon={CurrencyEur} label="Earned this month" value={formatCents(earned, "nl")} />
        <Stat Icon={Warning} label="Awaiting payment" value={formatCents(owed, "nl")} />
      </div>

      <BookingsTable bookings={bookings} />
    </div>
  )
}
