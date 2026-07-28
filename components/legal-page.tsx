"use client"

import { BUSINESS_DETAILS, CONTACT_DETAILS } from "@/components/constant"
import { useLanguage } from "@/contexts/LanguageContext"

/**
 * Shared shell for the privacy / terms / cookie pages.
 *
 * These used to be hardcoded English JSX, so the language toggle did nothing on
 * any of them — a Dutch visitor to a Dutch business got English legal text,
 * which is the one place it matters most. Content is now data in both
 * languages and the shell picks one, so the toggle works here like everywhere
 * else.
 *
 * Sections are described rather than marked up. Legal copy is only ever
 * headings, paragraphs and bullets, and keeping it as data means the Dutch and
 * English versions cannot drift apart structurally.
 */

export interface LegalSection {
  h: string
  p?: string[]
  ul?: string[]
}

export interface LegalContent {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

/** The only inline markup allowed in legal copy: **bold** and [text](href). */
function render(text: string, key: string) {
  const parts: React.ReactNode[] = []
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0

  while ((m = pattern.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) {
      parts.push(<strong key={`${key}-b${i}`}>{m[1]}</strong>)
    } else {
      const external = m[3].startsWith("http")
      parts.push(
        <a
          key={`${key}-a${i}`}
          href={m[3]}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {m[2]}
        </a>,
      )
    }
    last = m.index + m[0].length
    i++
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function LegalPage({ en, nl }: { en: LegalContent; nl: LegalContent }) {
  const { language } = useLanguage()
  const isNl = language === "nl"
  const c = isNl ? nl : en

  const t = isNl
    ? {
        updated: "Laatst bijgewerkt",
        contact: "Contact",
        question: "Vragen over deze pagina? Neem contact op met WJ Cleaning Services via",
        or: "of",
      }
    : {
        updated: "Last updated",
        contact: "Contact",
        question: "Questions about this page? Contact WJ Cleaning Services at",
        or: "or",
      }

  return (
    <div className="min-h-screen bg-wj-cream">
      <section className="bg-wj-dark pb-12 pt-28 text-white sm:pb-16 sm:pt-36">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl tracking-tight sm:text-4xl">{c.title}</h1>
            <p className="mt-3 text-sm text-wj-lighter">
              {t.updated}: {c.lastUpdated}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-3xl space-y-8 text-gray-700 [&_a]:text-wj-dark [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            <p>{render(c.intro, "intro")}</p>

            {c.sections.map((s, si) => (
              <div key={s.h}>
                <h2>{s.h}</h2>
                {s.p?.map((para, pi) => (
                  <p key={pi} className="mt-3">
                    {render(para, `s${si}p${pi}`)}
                  </p>
                ))}
                {s.ul && (
                  <ul className="mt-3">
                    {s.ul.map((item, ii) => (
                      <li key={ii}>{render(item, `s${si}l${ii}`)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="border border-wj-cream-deep bg-white p-6">
              <h2 className="mb-3 text-xl text-gray-900">{t.contact}</h2>
              <p>
                {t.question} <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>{" "}
                {t.or} <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>{CONTACT_DETAILS.phone}</a>.
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
