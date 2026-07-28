import type { Metadata } from "next"
import { LegalPage, type LegalContent } from "@/components/legal-page"
import { CONTACT_DETAILS, OPENING_HOURS } from "@/components/constant"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms under which WJ Cleaning Services provides cleaning and staffing work.",
}

const en: LegalContent = {
  title: "Terms of Service",
  lastUpdated: "28 July 2026",
  intro: `These terms apply to cleaning and staffing services provided by WJ Cleaning Services, based in ${CONTACT_DETAILS.city}, ${CONTACT_DETAILS.country}. By requesting a service you agree to them.`,
  sections: [
    {
      h: "Quotes and pricing",
      p: [
        "Prices quoted are based on the information you give us, including the size of the space and the work required. If conditions on the day differ materially from what was described, we will discuss any change with you before starting rather than adjusting the price afterwards.",
      ],
    },
    {
      h: "Scheduling and access",
      p: [
        `Work is carried out during our normal hours (${OPENING_HOURS.weekdays}; closed ${OPENING_HOURS.closed}). You are responsible for providing access to the property at the agreed time. If we cannot gain access, the appointment may be treated as a late cancellation.`,
      ],
    },
    {
      h: "Cancellation and rescheduling",
      p: [
        "Please give as much notice as possible if you need to cancel or move an appointment. We ask for at least 24 hours so the slot can be offered to someone else. You can do this yourself using the link in your confirmation email. We will give you the same notice if we ever have to move an appointment.",
      ],
    },
    {
      h: "Payment",
      p: [
        "Unless agreed otherwise in writing, payment is due after the work is completed, by the method stated on your invoice. Prices include VAT where applicable.",
      ],
    },
    {
      h: "Our commitments",
      ul: [
        "We arrive at the agreed time, or contact you in advance if we are delayed.",
        "We carry liability insurance for the work we perform.",
        "If you are not satisfied with the result, tell us **within 24 hours** and we will return and put it right at no extra charge.",
      ],
    },
    {
      h: "Liability",
      p: [
        "We take care in your property and are insured for damage caused by our work. Report any damage to us **within 24 hours** so it can be investigated while the circumstances are clear. We are not liable for pre-existing damage, normal wear, or items that were already faulty or fragile beyond ordinary handling.",
      ],
    },
    {
      h: "Your data",
      p: ["How we handle your personal information is described in our [Privacy Policy](/privacy)."],
    },
    {
      h: "Governing law",
      p: [
        "These terms are governed by Dutch law. Disputes will be brought before the competent court in the Netherlands.",
      ],
    },
  ],
}

const nl: LegalContent = {
  title: "Algemene voorwaarden",
  lastUpdated: "28 juli 2026",
  intro: `Deze voorwaarden gelden voor schoonmaak- en personeelsdiensten van WJ Cleaning Services, gevestigd in ${CONTACT_DETAILS.city}, ${CONTACT_DETAILS.country}. Door een dienst aan te vragen gaat u hiermee akkoord.`,
  sections: [
    {
      h: "Offertes en prijzen",
      p: [
        "Onze prijzen zijn gebaseerd op de informatie die u ons geeft, waaronder de grootte van de ruimte en het benodigde werk. Wijkt de situatie op de dag zelf wezenlijk af van wat is opgegeven, dan bespreken wij een eventuele wijziging vooraf met u en passen wij de prijs niet achteraf aan.",
      ],
    },
    {
      h: "Planning en toegang",
      p: [
        `Wij werken tijdens onze reguliere tijden (${OPENING_HOURS.weekdays}; gesloten ${OPENING_HOURS.closed}). U zorgt ervoor dat wij op het afgesproken tijdstip toegang hebben tot de locatie. Kunnen wij er niet in, dan kan de afspraak worden behandeld als een late annulering.`,
      ],
    },
    {
      h: "Annuleren en verzetten",
      p: [
        "Laat het zo vroeg mogelijk weten als u een afspraak wilt annuleren of verzetten. Wij vragen om minimaal 24 uur, zodat het tijdslot aan iemand anders kan worden aangeboden. U kunt dit zelf doen via de link in uw bevestigingsmail. Moeten wij een afspraak verzetten, dan houden wij dezelfde termijn aan.",
      ],
    },
    {
      h: "Betaling",
      p: [
        "Tenzij schriftelijk anders afgesproken, betaalt u na afloop van het werk, op de wijze die op uw factuur staat. Prijzen zijn inclusief btw waar dat van toepassing is.",
      ],
    },
    {
      h: "Wat wij toezeggen",
      ul: [
        "Wij komen op het afgesproken tijdstip, of laten het vooraf weten als wij later zijn.",
        "Wij zijn verzekerd voor aansprakelijkheid voor het werk dat wij uitvoeren.",
        "Bent u niet tevreden over het resultaat, laat het ons dan **binnen 24 uur** weten. Wij komen terug en maken het kosteloos in orde.",
      ],
    },
    {
      h: "Aansprakelijkheid",
      p: [
        "Wij gaan zorgvuldig om met uw eigendom en zijn verzekerd voor schade die door ons werk ontstaat. Meld schade **binnen 24 uur**, zodat die kan worden onderzocht nu de omstandigheden nog duidelijk zijn. Wij zijn niet aansprakelijk voor al bestaande schade, normale slijtage, of zaken die al defect of buitengewoon kwetsbaar waren.",
      ],
    },
    {
      h: "Uw gegevens",
      p: [
        "Hoe wij met uw persoonsgegevens omgaan, leest u in ons [privacybeleid](/privacy).",
      ],
    },
    {
      h: "Toepasselijk recht",
      p: [
        "Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.",
      ],
    },
  ],
}

export default function TermsPage() {
  return <LegalPage en={en} nl={nl} />
}
