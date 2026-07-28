import type { Metadata } from "next"
import Link from "next/link"
import { Warning } from "@phosphor-icons/react/dist/ssr"

import { CONTACT_DETAILS } from "@/components/constant"
import { loadBookingByToken } from "@/lib/booking/manage"
import { ManagePanel } from "./manage-panel"

export const metadata: Metadata = {
  title: "Your booking",
  // A manage link must never end up in a search index. It is a credential.
  robots: { index: false, follow: false, nocache: true },
}

export const dynamic = "force-dynamic"

export default async function ManageBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const result = await loadBookingByToken(token)

  if (!result.ok) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 md:px-8">
          <div className="mx-auto max-w-md border border-gray-200 bg-white p-8 text-center">
            <Warning weight="fill" className="mx-auto h-10 w-10 text-amber-500" />
            <h1 className="mt-5 text-xl font-semibold tracking-tight text-gray-900">
              This link isn&rsquo;t valid
            </h1>
            {/*
              Deliberately one message for every failure. Distinguishing
              "expired" from "no such booking" would turn this page into a way
              to test whether a given link ever existed.
            */}
            <p className="mt-3 leading-relaxed text-gray-600">
              It may have expired, or the booking may already have been changed. Please use the
              link in your most recent email, or call us and we&rsquo;ll sort it out.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`tel:${CONTACT_DETAILS.phoneTel}`}
                className="inline-flex h-11 items-center justify-center bg-wj-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
              >
                Call {CONTACT_DETAILS.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const b = result.booking

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 md:px-8">
        <div className="mx-auto max-w-2xl">
          <ManagePanel
            token={token!}
            booking={{
              reference: b.reference,
              startsAtISO: b.startsAt.toISOString(),
              endsAtISO: b.endsAt.toISOString(),
              durationMin: b.durationMin,
              status: b.status,
              m2Label: b.m2Label,
              deepCleaning: b.deepCleaning,
              washingUp: b.washingUp,
              lines: b.lines,
              totalCents: b.totalCents,
              discountCents: b.discountCents,
              language: b.language,
              customerName: b.customer.name,
              address: `${b.customer.street}, ${b.customer.postcode} ${b.customer.city}`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
