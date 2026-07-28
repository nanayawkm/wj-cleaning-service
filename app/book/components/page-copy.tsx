"use client"

import { CalendarCheck, CurrencyEur, EnvelopeSimple } from "@phosphor-icons/react"

import { useLanguage } from "@/contexts/LanguageContext"

/**
 * The booking page itself must stay a server component — it loads the pricing
 * catalogue — so it cannot read the language context, which is a client hook.
 * Every string on it was therefore stuck in English while the flow beneath it
 * switched to Dutch. These two pieces carry the page's own copy across.
 */

export function BookHeroCopy() {
  const { language } = useLanguage()
  const nl = language === "nl"

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {nl ? "Boek uw schoonmaak" : "Book your clean"}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-white/90">
        {nl
          ? "Vaste prijzen op basis van de grootte van uw woning. Kies uw tijd en wij bevestigen per e-mail."
          : "Fixed prices by the size of your home. Choose your time and we confirm by email."}
      </p>
    </>
  )
}

export function BookAssurances() {
  const { language } = useLanguage()
  const nl = language === "nl"

  const items = nl
    ? [
        { Icon: CurrencyEur, text: "Vaste prijs, zichtbaar voordat u gegevens invult" },
        { Icon: CalendarCheck, text: "Uw tijdslot ligt vast zodra u bevestigt" },
        { Icon: EnvelopeSimple, text: "Bevestiging per e-mail met agenda-uitnodiging" },
      ]
    : [
        { Icon: CurrencyEur, text: "Fixed price, shown before you enter any details" },
        { Icon: CalendarCheck, text: "Your slot is held the moment you confirm" },
        { Icon: EnvelopeSimple, text: "Confirmation by email with a calendar invite" },
      ]

  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-3">
      {items.map(({ Icon, text }) => (
        <li key={text} className="flex items-start gap-2.5">
          <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-wj-dark" />
          <span className="text-sm leading-snug text-gray-600">{text}</span>
        </li>
      ))}
    </ul>
  )
}
