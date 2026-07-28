import type { ReactNode } from "react"
import { BUSINESS_DETAILS, CONTACT_DETAILS } from "@/components/constant"

interface LegalPageProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

/**
 * Shared shell for the privacy / terms / cookie pages so the three stay
 * visually and structurally consistent.
 */
export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-wj-cream">
      <section className="bg-wj-dark pb-12 pt-28 text-white sm:pb-16 sm:pt-36">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm text-wj-lighter">Last updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-3xl space-y-8 text-gray-700 [&_a]:text-wj-dark [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            {children}

            <div className="rounded-xl border border-wj-cream-deep bg-white p-6">
              <h2 className="mb-3 text-xl text-gray-900">Contact</h2>
              <p>
                Questions about this page? Contact WJ Cleaning Services at{" "}
                <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a> or{" "}
                <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>
                  {CONTACT_DETAILS.phone}
                </a>
                .
              </p>
              <p className="mt-2">
                WJ Cleaning Services, {CONTACT_DETAILS.city}, {CONTACT_DETAILS.country}
                {BUSINESS_DETAILS.kvk ? ` · KVK ${BUSINESS_DETAILS.kvk}` : ""}
                {BUSINESS_DETAILS.btw ? ` · BTW ${BUSINESS_DETAILS.btw}` : ""}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
