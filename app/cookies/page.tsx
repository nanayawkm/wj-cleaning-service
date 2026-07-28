import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What this site stores in your browser, and why.",
}

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="27 July 2026">
      <p>
        This website does not use tracking cookies, advertising cookies, or third-party analytics.
        We do not show a cookie banner because we do not set anything that requires consent.
      </p>

      <div>
        <h2>What we do store</h2>
        <p className="mt-3">
          One item is saved in your browser&rsquo;s local storage:
        </p>
        <ul className="mt-3">
          <li>
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">wj-language</code> — your
            choice of English or Dutch, so the site opens in the same language next time.
          </li>
        </ul>
        <p className="mt-3">
          This is a functional preference that you set yourself. It contains no personal
          information, is never sent to our servers, and is not shared with anyone. Under the EU
          ePrivacy rules, strictly functional storage of this kind does not require consent.
        </p>
      </div>

      <div>
        <h2>Removing it</h2>
        <p className="mt-3">
          You can clear it at any time through your browser&rsquo;s settings for site data. The
          site will simply open in English the next time you visit.
        </p>
      </div>

      <div>
        <h2>Changes</h2>
        <p className="mt-3">
          If we ever add analytics or any non-essential storage, we will update this page and ask
          for your consent before setting anything.
        </p>
      </div>
    </LegalPage>
  )
}
