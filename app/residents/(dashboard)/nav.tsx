"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarBlank, ClipboardText, Receipt, SignOut, Sliders, Sun, Tag, UserPlus, Users } from "@phosphor-icons/react"

const NAV = [
  // Today first: it is the screen Jackie opens most, and on a phone the first
  // tab is the one under her thumb.
  { href: "/residents/today", label: "Today", Icon: Sun },
  { href: "/residents", label: "Bookings", Icon: ClipboardText },
  // Third because it is reached mid-job, standing on someone's doorstep —
  // it has to be within reach without scrolling the tab strip.
  { href: "/residents/invoices", label: "Invoices", Icon: Receipt },
  { href: "/residents/customers", label: "Customers", Icon: Users },
  // Next to Customers because it is the same kind of screen — people, not
  // settings. Everything below this line is configuration she sets once.
  { href: "/residents/applications", label: "Applications", Icon: UserPlus },
  { href: "/residents/availability", label: "Availability", Icon: CalendarBlank },
  { href: "/residents/pricing", label: "Pricing", Icon: Sliders },
  { href: "/residents/discounts", label: "Discounts", Icon: Tag },
]

/**
 * Rail on desktop, tab strip on phones.
 *
 * The rail used to be `hidden lg:flex` with nothing in its place, so on a
 * phone the dashboard had no navigation at all — once Jackie opened
 * Availability there was no way back to Bookings except the browser button.
 */
export function AdminNav({ email, signOut }: { email: string; signOut: () => Promise<void> }) {
  const pathname = usePathname()

  // /residents must not light up for every child route, so it matches exactly.
  const isActive = (href: string) =>
    href === "/residents" ? pathname === "/residents" : pathname.startsWith(href)

  return (
    <>
      {/* ------------------------------------------------------------- rail */}
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="border-b border-gray-200 px-5 py-5">
          <p className="text-sm font-semibold text-gray-900">WJ Cleaning</p>
          <p className="text-xs text-gray-500">Dashboard</p>
        </div>

        <nav className="flex-1 p-3">
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`mb-1 flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-wj-dark font-semibold text-white"
                    : "font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon weight={active ? "fill" : "regular"} className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <p className="truncate px-3 pb-2 text-xs text-gray-500">{email}</p>
          <form action={signOut}>
            <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <SignOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ------------------------------------------------------ mobile tabs */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="text-sm font-semibold text-gray-900">WJ Cleaning</p>
          <form action={signOut}>
            <button className="flex h-9 items-center gap-1.5 px-2 text-xs font-medium text-gray-500 hover:text-gray-900">
              <SignOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pt-2">
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-wj-dark font-semibold text-wj-dark"
                    : "border-transparent font-medium text-gray-500"
                }`}
              >
                <Icon weight={active ? "fill" : "regular"} className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
