import type { Metadata } from "next"
import { LegalPage, type LegalContent } from "@/components/legal-page"
import { CONTACT_DETAILS } from "@/components/constant"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WJ Cleaning Services collects, uses and protects your personal data under the GDPR.",
}

const en: LegalContent = {
  title: "Privacy Policy",
  lastUpdated: "28 July 2026",
  intro:
    "This policy explains what personal data WJ Cleaning Services collects, why we collect it, and what rights you have. We are the data controller for the information described here.",
  sections: [
    {
      h: "What we collect",
      p: ["When you book or contact us through this website we collect:"],
      ul: [
        "Your name, email address and phone number",
        "The address where the work is to be carried out",
        "The service you are booking or asking about, and anything you write in the notes",
      ],
    },
    {
      h: "Why we collect it, and our legal basis",
      ul: [
        "**To carry out the work you have booked** — necessary for the performance of a contract with you, or to take steps at your request before entering into one (Article 6(1)(b) GDPR). We cannot clean your home without knowing where it is.",
        "**To send offers or discounts** — only if you have explicitly opted in. This is based on your consent (Article 6(1)(a) GDPR), and you can withdraw it at any time using the unsubscribe link in any such email.",
      ],
      p: [
        "Service messages about a job you have booked — confirmations, changes, reminders — are not marketing and are sent regardless of marketing consent.",
        "We do not use analytics or advertising trackers on this site, and we do not build profiles about visitors.",
      ],
    },
    {
      h: "Where your data is stored",
      p: [
        "Booking and customer records are held in a database hosted in the European Union. Access is restricted to WJ Cleaning Services personnel who need it to deliver the service.",
      ],
    },
    {
      h: "How long we keep it",
      p: [
        "We keep booking and customer records only as long as necessary for the purpose above, and for any period required by Dutch tax and administration law. After that, records are deleted or anonymised.",
      ],
    },
    {
      h: "Who we share it with",
      p: [
        "We do not sell your data. We share it only with service providers who process it on our behalf under a data processing agreement:",
      ],
      ul: [
        "**Vercel** — website hosting.",
        "**Supabase** — database hosting, in the European Union.",
        "**Resend** — email delivery. Resend processes data in the United States. That transfer is covered by the EU–US Data Privacy Framework and by Standard Contractual Clauses.",
      ],
    },
    {
      h: "Your rights",
      p: ["Under the GDPR you have the right to:"],
      ul: [
        "Access the personal data we hold about you",
        "Have inaccurate data corrected",
        "Have your data erased",
        "Restrict or object to how we process it",
        "Receive your data in a portable format",
        "Withdraw consent for marketing at any time",
      ],
    },
    {
      h: "Making a request or a complaint",
      p: [
        `To exercise any of these rights, email us at [${CONTACT_DETAILS.email}](mailto:${CONTACT_DETAILS.email}). We will respond within one month.`,
        "If you believe we have handled your data improperly, you can lodge a complaint with the Dutch data protection authority, the [Autoriteit Persoonsgegevens](https://autoriteitpersoonsgegevens.nl).",
      ],
    },
    {
      h: "Security",
      p: [
        "This site is served over HTTPS. Booking records are protected by access controls at the database itself, so they cannot be read without an authorised account.",
      ],
    },
  ],
}

const nl: LegalContent = {
  title: "Privacybeleid",
  lastUpdated: "28 juli 2026",
  intro:
    "In dit beleid leest u welke persoonsgegevens WJ Cleaning Services verzamelt, waarom wij dat doen en welke rechten u heeft. Wij zijn de verwerkingsverantwoordelijke voor de hier beschreven gegevens.",
  sections: [
    {
      h: "Wat wij verzamelen",
      p: ["Wanneer u via deze website boekt of contact opneemt, verzamelen wij:"],
      ul: [
        "Uw naam, e-mailadres en telefoonnummer",
        "Het adres waar het werk moet worden uitgevoerd",
        "De dienst die u boekt of waarover u vraagt, en wat u bij opmerkingen invult",
      ],
    },
    {
      h: "Waarom wij dit verzamelen, en onze grondslag",
      ul: [
        "**Om het geboekte werk uit te voeren** — noodzakelijk voor de uitvoering van een overeenkomst met u, of om op uw verzoek stappen te zetten voordat die tot stand komt (artikel 6, lid 1, onder b, AVG). Wij kunnen uw woning niet schoonmaken zonder te weten waar die is.",
        "**Om aanbiedingen of kortingen te sturen** — alleen als u zich hier uitdrukkelijk voor heeft aangemeld. Dit gebeurt op basis van uw toestemming (artikel 6, lid 1, onder a, AVG) en u kunt die op elk moment intrekken via de afmeldlink in zo'n e-mail.",
      ],
      p: [
        "Serviceberichten over een geboekte afspraak — bevestigingen, wijzigingen, herinneringen — zijn geen marketing en worden altijd verstuurd, ongeacht uw keuze voor aanbiedingen.",
        "Wij gebruiken op deze site geen analyse- of advertentietrackers en stellen geen profielen op van bezoekers.",
      ],
    },
    {
      h: "Waar uw gegevens staan",
      p: [
        "Boekings- en klantgegevens staan in een database die binnen de Europese Unie wordt gehost. Alleen medewerkers van WJ Cleaning Services die de gegevens nodig hebben om de dienst te leveren, hebben toegang.",
      ],
    },
    {
      h: "Hoe lang wij het bewaren",
      p: [
        "Wij bewaren boekings- en klantgegevens niet langer dan nodig is voor het bovenstaande doel, en zolang de Nederlandse fiscale en administratieve wetgeving dat voorschrijft. Daarna worden gegevens verwijderd of geanonimiseerd.",
      ],
    },
    {
      h: "Met wie wij het delen",
      p: [
        "Wij verkopen uw gegevens niet. Wij delen ze uitsluitend met dienstverleners die ze namens ons verwerken op basis van een verwerkersovereenkomst:",
      ],
      ul: [
        "**Vercel** — hosting van de website.",
        "**Supabase** — hosting van de database, binnen de Europese Unie.",
        "**Resend** — bezorging van e-mail. Resend verwerkt gegevens in de Verenigde Staten. Die doorgifte valt onder het EU-VS Data Privacy Framework en onder standaardcontractbepalingen.",
      ],
    },
    {
      h: "Uw rechten",
      p: ["Op grond van de AVG heeft u het recht om:"],
      ul: [
        "De persoonsgegevens in te zien die wij over u hebben",
        "Onjuiste gegevens te laten corrigeren",
        "Uw gegevens te laten verwijderen",
        "De verwerking te beperken of daartegen bezwaar te maken",
        "Uw gegevens in een overdraagbaar formaat te ontvangen",
        "Uw toestemming voor marketing op elk moment in te trekken",
      ],
    },
    {
      h: "Een verzoek of klacht indienen",
      p: [
        `Wilt u een van deze rechten uitoefenen, mail ons dan op [${CONTACT_DETAILS.email}](mailto:${CONTACT_DETAILS.email}). Wij reageren binnen één maand.`,
        "Vindt u dat wij niet zorgvuldig met uw gegevens zijn omgegaan, dan kunt u een klacht indienen bij de Nederlandse toezichthouder, de [Autoriteit Persoonsgegevens](https://autoriteitpersoonsgegevens.nl).",
      ],
    },
    {
      h: "Beveiliging",
      p: [
        "Deze site werkt via HTTPS. Boekingsgegevens zijn beveiligd met toegangsregels in de database zelf, waardoor ze niet leesbaar zijn zonder een geautoriseerd account.",
      ],
    },
  ],
}

export default function PrivacyPage() {
  return <LegalPage en={en} nl={nl} />
}
