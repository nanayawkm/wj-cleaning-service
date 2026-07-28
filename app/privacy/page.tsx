import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { CONTACT_DETAILS } from "@/components/constant"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WJ Cleaning Services collects, uses and protects your personal data under the GDPR.",
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="27 July 2026">
      <p>
        This policy explains what personal data WJ Cleaning Services collects, why we collect it,
        and what rights you have. We are the data controller for the information described here.
      </p>

      <div>
        <h2>What we collect</h2>
        <p className="mt-3">When you contact us through this website we collect:</p>
        <ul className="mt-3">
          <li>Your name, email address and phone number</li>
          <li>The service you are enquiring about and any message you write</li>
        </ul>
        <p className="mt-3">
          We do not use analytics or advertising trackers on this site, and we do not build
          profiles about visitors.
        </p>
      </div>

      <div>
        <h2>Why we collect it, and our legal basis</h2>
        <ul className="mt-3">
          <li>
            <strong>To respond to your enquiry and deliver the service you request</strong> —
            necessary for the performance of a contract with you, or to take steps at your request
            before entering into one (Article 6(1)(b) GDPR).
          </li>
          <li>
            <strong>To send offers or discounts</strong> — only if you have explicitly opted in.
            This is based on your consent (Article 6(1)(a) GDPR), and you can withdraw it at any
            time using the unsubscribe link in any such email.
          </li>
        </ul>
        <p className="mt-3">
          Service messages about a job you have booked — confirmations, changes, reminders — are
          not marketing and are sent regardless of marketing consent.
        </p>
      </div>

      <div>
        <h2>How long we keep it</h2>
        <p className="mt-3">
          We keep enquiry and job records only as long as necessary for the purpose above, and for
          any period required by Dutch tax and administration law. After that, records are deleted
          or anonymised.
        </p>
      </div>

      <div>
        <h2>Who we share it with</h2>
        <p className="mt-3">
          We do not sell your data. We share it only with service providers who process it on our
          behalf under a data processing agreement:
        </p>
        <ul className="mt-3">
          <li>
            <strong>Vercel</strong> — website hosting.
          </li>
          <li>
            <strong>Resend</strong> — email delivery. Resend processes data in the United States.
            That transfer is covered by the EU–US Data Privacy Framework and by Standard
            Contractual Clauses.
          </li>
        </ul>
      </div>

      <div>
        <h2>Your rights</h2>
        <p className="mt-3">Under the GDPR you have the right to:</p>
        <ul className="mt-3">
          <li>Access the personal data we hold about you</li>
          <li>Have inaccurate data corrected</li>
          <li>Have your data erased</li>
          <li>Restrict or object to how we process it</li>
          <li>Receive your data in a portable format</li>
          <li>Withdraw consent for marketing at any time</li>
        </ul>
        <p className="mt-3">
          To exercise any of these, email us at{" "}
          <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>. We will respond
          within one month.
        </p>
        <p className="mt-3">
          If you believe we have handled your data improperly, you can lodge a complaint with the
          Dutch data protection authority, the{" "}
          <a
            href="https://autoriteitpersoonsgegevens.nl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Autoriteit Persoonsgegevens
          </a>
          .
        </p>
      </div>

      <div>
        <h2>Security</h2>
        <p className="mt-3">
          This site is served over HTTPS. Access to enquiry data is restricted to WJ Cleaning
          Services personnel who need it to deliver the service.
        </p>
      </div>
    </LegalPage>
  )
}
