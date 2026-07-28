import Link from "next/link"
import { CheckCircle } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { CONTACT_DETAILS } from "@/components/constant"

/**
 * Deliberately shows only the reference. The booking details are already in
 * the customer's confirmation email; putting the address on a page reachable
 * with a guessable query string would undo the care taken everywhere else.
 */
export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams

  return (
    <div className="min-h-screen bg-wj-cream pt-16 sm:pt-20">
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-lg rounded-xl border border-wj-cream-deep bg-white p-8 text-center">
            <CheckCircle weight="fill" className="mx-auto h-12 w-12 text-wj-dark" />
            <h1 className="mt-5 text-2xl tracking-tight text-gray-900">Booking confirmed</h1>
            <p className="mt-3 leading-relaxed text-gray-600">
              We&rsquo;ve sent a confirmation email with your appointment details and a calendar
              invite. It also contains a link to change or cancel your booking.
            </p>

            {ref && (
              <p className="mt-5 inline-block rounded-lg bg-wj-cream px-4 py-2 text-sm text-gray-700">
                Reference <span className="font-semibold text-gray-900">{ref}</span>
              </p>
            )}

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/">Back to home</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>Call us</a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No email after a few minutes? Check your spam folder, or call{" "}
              <a href={`tel:${CONTACT_DETAILS.phoneTel}`} className="font-semibold text-wj-dark">
                {CONTACT_DETAILS.phone}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
