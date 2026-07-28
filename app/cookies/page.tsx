import type { Metadata } from "next"
import { LegalPage, type LegalContent } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What this site stores in your browser, and why.",
}

const en: LegalContent = {
  title: "Cookie Policy",
  lastUpdated: "28 July 2026",
  intro:
    "This website does not use tracking cookies, advertising cookies, or third-party analytics. We do not show a cookie banner because we do not set anything that requires consent.",
  sections: [
    {
      h: "What we do store",
      p: ["One item is saved in your browser's local storage:"],
      ul: [
        "**wj-language** — your choice of English or Dutch, so the site opens in the same language next time.",
      ],
    },
    {
      h: "Why that needs no consent",
      p: [
        "This is a functional preference that you set yourself. It contains no personal information, is never sent to our servers, and is not shared with anyone. Under the EU ePrivacy rules, strictly functional storage of this kind does not require consent.",
      ],
    },
    {
      h: "Removing it",
      p: [
        "You can clear it at any time through your browser's settings for site data. The site will simply open in Dutch the next time you visit.",
      ],
    },
    {
      h: "Changes",
      p: [
        "If we ever add analytics or any non-essential storage, we will update this page and ask for your consent before setting anything.",
      ],
    },
  ],
}

const nl: LegalContent = {
  title: "Cookiebeleid",
  lastUpdated: "28 juli 2026",
  intro:
    "Deze website gebruikt geen tracking cookies, geen advertentiecookies en geen analyse van derden. U ziet geen cookiemelding, omdat wij niets plaatsen waarvoor toestemming nodig is.",
  sections: [
    {
      h: "Wat wij wel opslaan",
      p: ["Er wordt één ding bewaard in de lokale opslag van uw browser:"],
      ul: [
        "**wj-language** — uw keuze voor Nederlands of Engels, zodat de site de volgende keer in dezelfde taal opent.",
      ],
    },
    {
      h: "Waarom hiervoor geen toestemming nodig is",
      p: [
        "Dit is een functionele voorkeur die u zelf instelt. Er staat geen persoonlijke informatie in, hij wordt nooit naar onze servers gestuurd en niet met anderen gedeeld. Volgens de Europese ePrivacy-regels is voor strikt functionele opslag geen toestemming vereist.",
      ],
    },
    {
      h: "Verwijderen",
      p: [
        "U kunt dit op elk moment wissen via de instellingen voor websitegegevens in uw browser. De site opent bij uw volgende bezoek dan gewoon in het Nederlands.",
      ],
    },
    {
      h: "Wijzigingen",
      p: [
        "Als wij ooit analyse of andere niet-noodzakelijke opslag toevoegen, passen wij deze pagina aan en vragen wij vooraf uw toestemming.",
      ],
    },
  ],
}

export default function CookiesPage() {
  return <LegalPage en={en} nl={nl} />
}
