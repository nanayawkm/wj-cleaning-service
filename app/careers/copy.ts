/**
 * Copy for the vacancy page and its application form.
 *
 * Kept local rather than in LanguageContext for the same reason
 * app/book/components/page-copy.tsx exists: this is a large block of long-form
 * prose used on exactly one page. Threading ~70 single-use keys through the
 * global dictionary makes that dictionary harder to read for the keys that are
 * genuinely shared across the site.
 *
 * The Dutch is the primary text — this is a Dutch job, advertised under the
 * Dutch cleaning CAO — and the English is there because roughly half the people
 * who apply for cleaning work here read English first.
 */

const copy = {
  en: {
    // ---- hero ------------------------------------------------------------
    badge: "Working at WJ",
    title: "Cleaner (m/f) — Open Application",
    tagline: "Brilliance in every corner",
    lead: "We're growing, and we're always looking for motivated cleaners to join us.",
    applyCta: "Apply now",
    emailCta: "Email us instead",

    // The single most important thing to say up front — an applicant who
    // expects a start date next week should know before they write anything.
    openNoticeTitle: "This is an open application",
    openNotice:
      "We don't have one specific vacancy open right now, but we do have ongoing work. Apply now and we'll be in touch to discuss when you can start with us.",

    aboutTitle: "About us",
    aboutBody:
      "WJ Cleaning Services provides professional cleaning, not only for private homes but also for businesses across various sectors. We're a small, personal team with short communication lines — you'll always know who you're working for.",

    dutiesTitle: "What will you do?",
    dutiesLead:
      "General and deep cleaning of private homes and commercial premises. We have ongoing work — new team members start with us right away.",
    duties: [
      "Vacuuming and mopping floors",
      "Cleaning bathrooms and sanitary areas",
      "Kitchen and pantry cleaning",
      "Dusting and surface work",
      "Glasswork and windows",
      "Deep cleaning when a job calls for it",
    ],

    offerTitle: "What do we offer?",
    offerLead: "Proper terms, paid to the Dutch cleaning industry standard.",
    offer: [
      {
        title: "Salary per the CAO Schoonmaak",
        body: "Pay in line with the Dutch cleaning industry collective labour agreement.",
      },
      {
        title: "Travel reimbursement",
        body: "Paid per kilometre if you use your own transport and hold a driving licence.",
      },
      { title: "Company uniform", body: "Provided by us, so you always turn up looking the part." },
      { title: "Christmas hamper", body: "A kerstpakket at the end of the year." },
      { title: "Varied work", body: "Different locations and different jobs, not the same room every day." },
      { title: "Flexible scheduling", body: "We work around your availability wherever we can." },
    ],

    lookingTitle: "What are we looking for?",
    looking: [
      "You work independently, accurately, and present yourself professionally",
      "You're flexible in your availability — different days and times, including on short notice when needed",
      "Experience with cleaning work is a plus, but not required",
      "You speak good Dutch or English",
    ],
    noExperienceNote:
      "No cleaning experience? Apply anyway. We'd rather train someone reliable than hire someone who isn't.",

    // ---- form ------------------------------------------------------------
    formTitle: "Send your open application",
    formLead:
      "Fill in the form and we'll get straight back to you by email. Prefer to write your own letter? Send it to us directly.",

    sectionYou: "About you",
    sectionWork: "Your work situation",
    sectionMotivation: "Your introduction",

    name: "Full name",
    namePlaceholder: "Your first and last name",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    phone: "Phone number",
    phonePlaceholder: "06 12345678",
    city: "Where do you live?",
    cityPlaceholder: "Town or city",

    availability: "How much do you want to work?",
    availabilityOptions: {
      fulltime: "Full-time",
      parttime: "Part-time",
      flexible: "Flexible / on call",
      weekends: "Weekends only",
    },

    experience: "Cleaning experience",
    experienceOptions: {
      none: "None yet — happy to learn",
      lessThanOne: "Less than a year",
      oneToThree: "One to three years",
      threePlus: "More than three years",
    },

    transport: "How would you get to a job?",
    transportOptions: {
      ownCarLicence: "Own car and driving licence",
      licenceNoCar: "Driving licence, no car",
      bicycle: "Bicycle or scooter",
      publicTransport: "Public transport",
    },
    transportHint: "Travel costs are reimbursed per kilometre if you drive your own transport.",

    languages: "Which languages do you speak?",
    languageOptions: { nl: "Dutch", en: "English", other: "Another language" },
    languagesHint: "Good Dutch or English is enough.",

    motivation: "Motivation and short introduction",
    motivationPlaceholder:
      "Tell us a little about yourself, why you'd like to work with us, and when you could start.",
    motivationHint: "A few sentences is plenty. Please don't include health or medical details.",

    consent:
      "I agree that WJ Cleaning Services may keep my details on file to contact me about work.",
    consentHint:
      "We keep open applications for 12 months and then delete them. Email us any time to be removed sooner.",

    submit: "Send my application",
    submitting: "Sending…",

    // ---- outcomes --------------------------------------------------------
    successTitle: "Thanks — we've got your application",
    successBody:
      "A confirmation is on its way to your inbox. Jackie reads every application personally and will contact you to discuss when you can start.",
    successReference: "Your reference",
    successCvNote:
      "Want to send a CV as well? Just reply to the confirmation email and attach it — it reaches us directly.",

    errorGeneric: "Something went wrong sending your application. Please try again, or email us directly.",
    errorRateLimited: "You've sent a few applications already. Please try again later, or email us directly.",
    errorRequired: "Please fill in all the required fields.",
    errorEmail: "Please check your email address.",
    errorConsent: "Please tick the box so we may keep your details.",
    required: "required",

    // ---- closing ---------------------------------------------------------
    directTitle: "Rather write your own letter?",
    directBody:
      "Send your open application — motivation plus a short introduction — straight to our inbox, or contact us by telephone.",
    callCta: "Contact us by telephone",
  },

  nl: {
    badge: "Werken bij WJ",
    title: "Schoonmaker (m/v) — Open sollicitatie",
    tagline: "Schittering in elke hoek",
    lead: "Wij groeien en zijn altijd op zoek naar gemotiveerde schoonmakers.",
    applyCta: "Solliciteer nu",
    emailCta: "Liever mailen",

    openNoticeTitle: "Dit is een open sollicitatie",
    openNotice:
      "Op dit moment hebben wij geen specifieke vacature openstaan, maar wij hebben wel doorlopend werk. Solliciteer nu — wij nemen contact op om te bespreken wanneer u kunt starten.",

    aboutTitle: "Over ons",
    aboutBody:
      "WJ Cleaning Services levert professionele schoonmaak, niet alleen voor particuliere woningen maar ook voor bedrijven in verschillende sectoren. Wij zijn een klein, persoonlijk team met korte lijnen — u weet altijd voor wie u werkt.",

    dutiesTitle: "Wat ga je doen?",
    dutiesLead:
      "Algemene schoonmaak en dieptereiniging van particuliere woningen en bedrijfspanden. Wij hebben doorlopend werk — nieuwe teamleden gaan direct met ons mee aan de slag.",
    duties: [
      "Stofzuigen en dweilen",
      "Badkamers en sanitair reinigen",
      "Keuken en pantry schoonmaken",
      "Stofwerk en oppervlakken",
      "Glaswerk en ramen",
      "Dieptereiniging waar de opdracht daarom vraagt",
    ],

    offerTitle: "Wat bieden wij?",
    offerLead: "Nette voorwaarden, betaald volgens de Nederlandse schoonmaakstandaard.",
    offer: [
      {
        title: "Salaris volgens CAO Schoonmaak",
        body: "Beloning conform de collectieve arbeidsovereenkomst voor het schoonmaakbedrijf.",
      },
      {
        title: "Reiskostenvergoeding",
        body: "Per kilometer vergoed als u eigen vervoer gebruikt en een rijbewijs heeft.",
      },
      { title: "Bedrijfskleding", body: "Wij zorgen voor de kleding, zodat u er altijd verzorgd staat." },
      { title: "Kerstpakket", body: "Een kerstpakket aan het einde van het jaar." },
      { title: "Afwisselend werk", body: "Verschillende locaties en opdrachten, niet elke dag dezelfde ruimte." },
      { title: "Flexibele planning", body: "Wij plannen zoveel mogelijk rond uw beschikbaarheid." },
    ],

    lookingTitle: "Wie zoeken wij?",
    looking: [
      "U werkt zelfstandig, nauwkeurig en presenteert zich professioneel",
      "U bent flexibel in beschikbaarheid — verschillende dagen en tijden, ook op korte termijn wanneer dat nodig is",
      "Ervaring met schoonmaakwerk is een pré, maar geen vereiste",
      "U spreekt goed Nederlands of Engels",
    ],
    noExperienceNote:
      "Geen schoonmaakervaring? Solliciteer toch. Wij leiden liever iemand op die betrouwbaar is dan dat wij iemand aannemen die dat niet is.",

    formTitle: "Stuur uw open sollicitatie",
    formLead:
      "Vul het formulier in, dan reageren wij per e-mail. Liever uw eigen brief schrijven? Stuur die rechtstreeks naar ons toe.",

    sectionYou: "Over u",
    sectionWork: "Uw werksituatie",
    sectionMotivation: "Uw introductie",

    name: "Volledige naam",
    namePlaceholder: "Uw voor- en achternaam",
    email: "E-mailadres",
    emailPlaceholder: "u@voorbeeld.nl",
    phone: "Telefoonnummer",
    phonePlaceholder: "06 12345678",
    city: "Waar woont u?",
    cityPlaceholder: "Plaats of gemeente",

    availability: "Hoeveel wilt u werken?",
    availabilityOptions: {
      fulltime: "Fulltime",
      parttime: "Parttime",
      flexible: "Flexibel / oproepbasis",
      weekends: "Alleen weekenden",
    },

    experience: "Schoonmaakervaring",
    experienceOptions: {
      none: "Nog geen — leer het graag",
      lessThanOne: "Minder dan een jaar",
      oneToThree: "Eén tot drie jaar",
      threePlus: "Meer dan drie jaar",
    },

    transport: "Hoe komt u bij een opdracht?",
    transportOptions: {
      ownCarLicence: "Eigen auto en rijbewijs",
      licenceNoCar: "Rijbewijs, geen auto",
      bicycle: "Fiets of scooter",
      publicTransport: "Openbaar vervoer",
    },
    transportHint: "Reiskosten worden per kilometer vergoed als u eigen vervoer gebruikt.",

    languages: "Welke talen spreekt u?",
    languageOptions: { nl: "Nederlands", en: "Engels", other: "Een andere taal" },
    languagesHint: "Goed Nederlands of Engels is voldoende.",

    motivation: "Motivatie en korte introductie",
    motivationPlaceholder:
      "Vertel kort iets over uzelf, waarom u bij ons wilt werken en wanneer u zou kunnen beginnen.",
    motivationHint: "Een paar zinnen is genoeg. Vermeld hier geen gezondheids- of medische gegevens.",

    consent:
      "Ik ga ermee akkoord dat WJ Cleaning Services mijn gegevens bewaart om contact met mij op te nemen over werk.",
    consentHint:
      "Wij bewaren open sollicitaties 12 maanden en verwijderen ze daarna. Mail ons gerust om eerder verwijderd te worden.",

    submit: "Verstuur mijn sollicitatie",
    submitting: "Versturen…",

    successTitle: "Bedankt — wij hebben uw sollicitatie ontvangen",
    successBody:
      "Er is een bevestiging onderweg naar uw inbox. Jackie leest elke sollicitatie persoonlijk en neemt contact op om te bespreken wanneer u kunt starten.",
    successReference: "Uw referentie",
    successCvNote:
      "Wilt u ook een cv sturen? Beantwoord de bevestigingsmail en voeg deze toe — die komt rechtstreeks bij ons binnen.",

    errorGeneric: "Er ging iets mis bij het versturen. Probeer het opnieuw of mail ons rechtstreeks.",
    errorRateLimited: "U heeft al een paar sollicitaties verstuurd. Probeer het later nog eens of mail ons rechtstreeks.",
    errorRequired: "Vul alstublieft alle verplichte velden in.",
    errorEmail: "Controleer alstublieft uw e-mailadres.",
    errorConsent: "Vink het vakje aan zodat wij uw gegevens mogen bewaren.",
    required: "verplicht",

    directTitle: "Liever uw eigen brief schrijven?",
    directBody:
      "Stuur uw open sollicitatie — motivatie plus een korte introductie — rechtstreeks naar onze inbox, of neem telefonisch contact op en vraag naar Jackie.",
    callCta: "Neem telefonisch contact op",
  },
} as const

export type CareersCopy = (typeof copy)["en"]

export const careersCopy = copy

/**
 * The option values that travel to the API. Declared once, here, so the form's
 * radio groups and the server's Zod schema cannot drift apart — if a value is
 * added on one side without the other, TypeScript stops it.
 */
export const AVAILABILITY = ["fulltime", "parttime", "flexible", "weekends"] as const
export const EXPERIENCE = ["none", "lessThanOne", "oneToThree", "threePlus"] as const
export const TRANSPORT = ["ownCarLicence", "licenceNoCar", "bicycle", "publicTransport"] as const
export const LANGUAGES = ["nl", "en", "other"] as const

export type Availability = (typeof AVAILABILITY)[number]
export type Experience = (typeof EXPERIENCE)[number]
export type Transport = (typeof TRANSPORT)[number]
export type SpokenLanguage = (typeof LANGUAGES)[number]
