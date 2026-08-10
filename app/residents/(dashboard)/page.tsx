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

  type Booking = (typeof bookings)[number]
  // Same axis as the bookings table: status decides, never the clock. Keeping
  // the two in step means a tile can never disagree with the tab beneath it,
  // and the figures stay disjoint instead of counting one job twice.
  const isOpen = (b: Booking) => b.status === "confirmed" || b.status === "rescheduled"
  const isDone = (b: Booking) => b.status === "completed"

  const open = bookings.filter(isOpen)
  const openValue = open.reduce((s, b) => s + b.totalCents, 0)

  // Earned this month: work Jackie has marked done, whether or not the cash has
  // arrived yet. Marked done is the signal — a slot whose time has passed with
  // nothing recorded against it is not revenue, it is a job to chase, and it
  // stays under Open until she says otherwise.
  const monthKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit" })
  const thisMonth = monthKey.format(new Date())
  const earned = bookings
    .filter((b) => isDone(b) && monthKey.format(new Date(b.startsAt)) === thisMonth)
    .reduce((s, b) => s + b.totalCents, 0)

  const owed = bookings
    .filter((b) => isDone(b) && !b.paidAt)
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
        <Stat Icon={CalendarBlank} label="Open jobs" value={String(open.length)} />
        <Stat Icon={CurrencyEur} label="Open value" value={formatCents(openValue, "nl")} />
        <Stat Icon={CurrencyEur} label="Earned this month" value={formatCents(earned, "nl")} />
        <Stat Icon={Warning} label="Awaiting payment" value={formatCents(owed, "nl")} />
      </div>

      <BookingsTable bookings={bookings} />
    </div>
  )
}
