import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { CONTACT_DETAILS, OPENING_HOURS } from "@/components/constant"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms under which WJ Cleaning Services provides cleaning and staffing work.",
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="27 July 2026">
      <p>
        These terms apply to cleaning and staffing services provided by WJ Cleaning Services,
        based in {CONTACT_DETAILS.city}, {CONTACT_DETAILS.country}. By requesting a service you
        agree to them.
      </p>

      <div>
        <h2>Quotes and pricing</h2>
        <p className="mt-3">
          Prices quoted are based on the information you give us, including the size of the space
          and the work required. If conditions on the day differ materially from what was
          described, we will discuss any change with you before starting rather than adjusting the
          price afterwards.
        </p>
      </div>

      <div>
        <h2>Scheduling and access</h2>
        <p className="mt-3">
          Work is carried out during our normal hours ({OPENING_HOURS.weekdays}; closed{" "}
          {OPENING_HOURS.closed}). You are responsible for providing access to the property at the
          agreed time. If we cannot gain access, the appointment may be treated as a late
          cancellation.
        </p>
      </div>

      <div>
        <h2>Cancellation and rescheduling</h2>
        <p className="mt-3">
          Please give as much notice as possible if you need to cancel or move an appointment. We
          ask for at least 24 hours so the slot can be offered to someone else. We will give you
          the same notice if we ever have to move an appointment.
        </p>
      </div>

      <div>
        <h2>Payment</h2>
        <p className="mt-3">
          Unless agreed otherwise in writing, payment is due after the work is completed, by the
          method stated on your invoice. Prices include VAT where applicable.
        </p>
      </div>

      <div>
        <h2>Our commitments</h2>
        <ul className="mt-3">
          <li>We arrive at the agreed time, or contact you in advance if we are delayed.</li>
          <li>We carry liability insurance for the work we perform.</li>
          <li>
            If you are not satisfied with the result, tell us within 48 hours and we will return
            and put it right at no extra charge.
          </li>
        </ul>
      </div>

      <div>
        <h2>Liability</h2>
        <p className="mt-3">
          We take care in your property and are insured for damage caused by our work. Report any
          damage to us within 48 hours so it can be investigated while the circumstances are
          clear. We are not liable for pre-existing damage, normal wear, or items that were
          already faulty or fragile beyond ordinary handling.
        </p>
      </div>

      <div>
        <h2>Your data</h2>
        <p className="mt-3">
          How we handle your personal information is described in our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>

      <div>
        <h2>Governing law</h2>
        <p className="mt-3">
          These terms are governed by Dutch law. Disputes will be brought before the competent
          court in the Netherlands.
        </p>
      </div>
    </LegalPage>
  )
}
