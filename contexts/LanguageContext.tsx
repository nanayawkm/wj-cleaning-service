"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react'
import { CONTACT_DETAILS } from '@/components/constant'

type Language = 'en' | 'nl'

// Keys are derived from the English dictionary, so a typo in t('...') is a
// compile error instead of silently rendering the key name to the customer.
export type TranslationKey = keyof (typeof translations)['en']

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    services: "Services",
    contact: "Contact",
    careers: "Work with us",
    careersNavHint: "Open application for cleaners",
    getQuote: "Book Now",
    
    // Hero Section
    heroTitle: "Professional Cleaning and Staffing in Lelystad",
    heroSubtitle: "Cleaning for homes and offices, plus vetted staff for warehouses, hotels and events. Based in Lelystad, serving Flevoland and the surrounding region.",
    getFreeQuote: "Book Now",
    hireStaff: "Hire Staff Today",
    
    // Services Section
    ourServices: "Our Services",
    servicesTitle: "Complete Cleaning & Staffing Solutions",
    servicesSubtitle: "Cleaning for homes, offices and commercial spaces — plus qualified personnel when you need extra hands.",
    
    // Service Cards
    residentialCleaning: "Residential Cleaning",
    residentialDesc: "Transform your home into a pristine sanctuary with our comprehensive residential cleaning services.",
    
    officeCleaning: "Office Cleaning", 
    officeDesc: "Maintain a pristine work environment with our comprehensive commercial cleaning solutions for offices and corporate spaces.",
    
    warehouseStaffing: "Warehouse Staffing",
    warehouseDesc: "Reliable warehouse personnel to keep your operations running smoothly and efficiently.",
    
    eventStaffing: "Event Staffing",
    eventDesc: "Professional event staff to ensure your special occasions run flawlessly from start to finish.",
    
    learnMore: "Learn More",
    
    // Services Page
    comprehensiveCleaning: "Comprehensive Cleaning Services",
    comprehensiveCleaningDesc: "Professional cleaning services that cover every aspect of maintaining clean and hygienic spaces.",
    commercialIndustrial: "Commercial & Industrial",
    commercialIndustrialDesc: "Cleaning for commercial premises, warehouses and industrial units.",
    getCleaningQuote: "Get Cleaning Quote",
    personnelOutsourcing: "Personnel Outsourcing",
    qualifiedVetted: "Qualified & Vetted Personnel",
    personnelOutsourcingDesc: "We provide qualified and vetted personnel for various business needs. Our specialisation lies in staffing for warehouses, but we also supply support staff for offices, restaurants, schools, and hotels.",
    warehouseStaffingTitle: "Warehouse Staffing",
    warehouseStaffingDesc: "Our specialisation in warehouse staffing provides reliable personnel to keep your operations running smoothly and efficiently.",
    supportStaffTitle: "Support Staff for Various Industries",
    supportStaffDesc: "We supply qualified support staff for diverse business environments and operational needs.",
    hireSupportStaff: "Hire Support Staff",
    industriesWeServe: "Industries We Serve",
    servingDiverse: "Serving Diverse Industries",
    industriesDesc: "We work across a range of sectors and adapt the job to what each one actually needs.",
    warehouses: "Warehouses",
    warehousesDesc: "Cleaning and staff for warehouses and logistics.",
    offices: "Offices",
    officesDesc: "Professional cleaning and support staff for office environments.",
    restaurantsCafes: "Restaurants & Cafés",
    restaurantsDesc: "Cleaning and staff for restaurants, cafés and kitchens.",
    hotels: "Hotels",
    hotelsDesc: "Comprehensive cleaning and hospitality staffing for hotel operations.",
    schools: "Schools",
    schoolsDesc: "Cleaning and support staff for schools and other learning environments.",
    serviceExcellence: "Doing it properly",
    whyChooseWJ: "Why Choose WJ Cleaning Services",
    qualityAssured: "Quality Assured",
    qualityAssuredDesc: "Every job is worked through and checked over before we leave.",
    fullyInsured: "Fully Insured",
    fullyInsuredDesc: "Complete coverage for your peace of mind and protection.",
    flexibleScheduling: "Flexible scheduling",
    flexibleSchedulingDesc: "Cleaning schedules arranged around your routine.",
    readyToExperience: "Get a price for your space",
    readyToExperienceDesc: "Tell us the size of the space and what you need. You get a price and a time, usually the same working day.",
    
    // About Page - Updated with meaningful content
    aboutUs: "Who We Are",
    aboutHeroTitle: "A small cleaning company from Lelystad",
    aboutHeroSubtitle: "We clean homes, offices and commercial spaces in Lelystad, across Flevoland and up to about 50 km around it — Almere, Amsterdam, Utrecht, Amersfoort and Zwolle included.",
    ourStory: "Our Journey",
    ourStoryDesc: "WJ Cleaning Services started small and stayed close to the people it works for, in Lelystad and the wider Flevoland region.",
    ourMission: "Our Mission",
    ourMissionDesc: "Reliable cleaning and staffing across Flevoland and the surrounding region, at a price you are told up front, on a schedule that holds.",
    ourValues: "Our Core Values",
    trustReliability: "Trust & Reliability",
    trustReliabilityDesc: "We build lasting relationships by doing work you can count on.",
    qualityExcellence: "Quality & Excellence",
    qualityExcellenceDesc: "Every service is delivered with attention to detail and commitment to excellence.",
    customerSatisfaction: "Customer Satisfaction",
    customerSatisfactionDesc: "Your satisfaction is our priority, and we work to your preferences.",
    satisfiedCustomers: "Satisfied Customers",
    satisfiedCustomersDesc: "Hundreds of happy customers who trust us with their cleaning and staffing needs.",
    professionalTeam: "Professional Team",
    professionalTeamDesc: "Qualified and vetted professionals committed to delivering exceptional results.",
    
    // Contact Page - Updated with meaningful content
    contactUs: "Get in Touch",
    contactHeroTitle: "Ready to Transform Your Space?",
    contactHeroSubtitle: "Let's discuss how we can help you achieve spotless results and reliable staffing solutions. Contact us today for a personalized consultation.",
    getInTouch: "Get in touch",
    getInTouchDesc: "We're here to help with all your cleaning and staffing needs. Contact us today for a free consultation.",
    contactInfo: "Contact Information",
    contactInfoDesc: "Reach us by phone, WhatsApp or email. We answer within 4 working hours, Monday to Saturday.",
    businessHours: "Business Hours",
    businessHoursDesc: "We're available during these hours for consultations and support.",
    sendMessage: "Send Your Message",
    sendMessageDesc: "Fill out the form below and we'll get back to you within 24 hours with a personalized solution.",
    name: "Full Name",
    phone: "Phone Number",
    message: "Tell Us About Your Needs",
    submit: "Send Message",
    submitMessage: "Thank you for your message. We'll get back to you within 24 hours.",
    
    // Company Info (Real WJ Cleaning Services info)
    experienceYears: "5+ Years Experience",
    personalizedSchedules: "Personalized Schedules", 
    extraHygiene: "Extra Hygiene",
    
    // Contact
    phoneNumber: CONTACT_DETAILS.phone,
    contactEmail: "info@wjcleaningservices.nl",
    region: "Flevoland Region",
    
    // Mobile bottom bar
    callNow: "Call Now",
    email: "Email",
    
    // Service tabs
    cleaning: "Cleaning",
    staffing: "Staffing",
    
    // Additional translations for hardcoded text
    professionalCleaningStaffing: "Professional Cleaning & Staffing Solutions",
    aboutWJCleanforce: "About WJ Cleaning Services",
    trustedPartnersExcellence: "Trusted Partners in Excellence",
    aboutDescription: "WJ Cleaning Services provides cleaning and staffing for homes and businesses in Lelystad and across Flevoland, built on quality, reliability and customer satisfaction.",
    experienceYearsDesc: "Our team has over 5 years of experience in the cleaning industry.",
    personalizedSchedulesDesc: "Customized cleaning schedules that perfectly match your preferences.",
    extraHygieneDesc: "Extra attention to hygiene for a completely clean and healthy environment.",
    excellenceInDetail: "Excellence in Every Detail",
    foundersQuote: "Winfred & Jackie, Founders",
    howItWorks: "How It Works",
    simpleProcessOutstanding: "How it works",
    howItWorksDesc: "Three steps from first contact to a clean space. No long forms, no waiting days for a quote.",
    getYourQuote: "Get Your Quote",
    getYourQuoteDesc: "Tell us the size of the space and what you need. You get an actual price, not ‘contact us for pricing’.",
    scheduleService: "Schedule Service",
    scheduleServiceDesc: "Choose a time that works for you. We offer flexible scheduling to fit your busy lifestyle and business needs.",
    enjoyCleanSpaces: "Enjoy Clean Spaces",
    enjoyCleanSpacesDesc: "Sit back while our team delivers professional results.",
    readyToGetStarted: "Ready to Get Started?",
    experienceDifference: "Ready for a clean you don’t have to chase?",
    ctaDescription: "Send us the details and we’ll confirm your slot. Most requests get an answer the same working day.",
    getFreeQuoteNow: "Book Now",
    whatsappUs: "WhatsApp Us",
    satisfactionGuaranteed: "Satisfaction Guaranteed",
    
    // Services page specific translations
    staffOfficeB1: "Reception and visitor cover",
    staffOfficeB2: "Post, filing and meeting rooms",
    staffOfficeB3: "Holiday and sickness cover",
    staffRestaurantB1: "Kitchen porters and dishwashing",
    staffRestaurantB2: "Runners and front-of-house",
    staffRestaurantB3: "Short-notice service cover",
    staffHotelB1: "Housekeeping and room turnaround",
    staffHotelB2: "Linen, laundry and restocking",
    staffHotelB3: "Public areas and corridors",
    staffSchoolB1: "Caretaking and site support",
    staffSchoolB2: "Term-time and holiday cover",
    staffSchoolB3: "Checked before they attend",
    staffEventB1: "Set-up and breakdown crews",
    staffEventB2: "Service and floor staff",
    staffEventB3: "Clear-down after the event",
    staffRolesTitle: "The staff we place",
    staffRolesLead: "Vetted, briefed and ready for the shift. Tell us the role and the hours, and we cover it.",
    staffOfficeDesc: "Reception cover, post and filing, meeting rooms turned around, and a hand during busy periods or holiday gaps.",
    staffRestaurantDesc: "Kitchen porters, runners and front-of-house cover for service, so a sudden absence does not close a section.",
    staffHotelDesc: "Housekeeping and turnaround staff who work to your standard and keep rooms ready for the next guest.",
    staffSchoolDesc: "Caretaking and support staff for term time, holidays and cover days, all checked before they set foot on site.",
    staffEventDesc: "Set-up, service and clear-down crews for one-off events, briefed in advance and there when the doors open.",
    officeSupportStaff: "Office support staff",
    restaurantCafePersonnel: "Restaurant & café personnel",
    hotelStaff: "Hotel staff",
    schoolSupportStaff: "School support staff",
    eventStaffingText: "Event staffing",
    
    // Footer translations
    quickLinks: "Quick Links",
    stayConnected: "Stay Connected",
    allRightsReserved: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",
    designedByQuube: "Designed and developed by",
    
    // FAQ translations
    frequentlyAskedQuestions: "Frequently Asked Questions",
    commonQuestionsAnswered: "Common Questions Answered",
    faqDescription: "Find answers to the most frequently asked questions about our services, pricing, and policies.",
    whatAreasServe: "What areas do you serve?",
    whatAreasServeAnswer: "We work in Lelystad, across Flevoland and up to about 50 km beyond it. Not sure whether your address is covered? Call or email and we will tell you.",
    howQuicklyStart: "How quickly can you start?",
    howQuicklyStartAnswer: "You can book online up to 24 hours ahead. If you need us sooner than that, give us a call — we can often still fit you in.",
    staffInsuredBonded: "Are your staff insured and bonded?",
    staffInsuredBondedAnswer: "Yes, our staff are insured. We carry liability insurance for the work we perform.",
    cleaningProducts: "What cleaning products do you use?",
    cleaningProductsAnswer: "We use professional products that are safe around children and pets. Tell us when you book if you have pets and we will plan around them.",
    provideSupplies: "Do you provide supplies and equipment?",
    provideSuppliesAnswer: "Yes, we bring all the products and equipment ourselves. You do not need to set anything out.",
    satisfactionGuarantee: "What is your satisfaction guarantee?",
    satisfactionGuaranteeAnswer: "If you are not happy with the result, tell us within 24 hours. We will come back and put it right at no extra charge.",
    
    // Contact page FAQ translations
    schedulingFlexibility: "Scheduling Flexibility",
    schedulingFlexibilityAnswer: "We offer flexible scheduling options to accommodate your needs, including early morning, evening, and weekend appointments.",
    emergencyServices: "Emergency Services",
    emergencyServicesAnswer: "Yes, we provide emergency cleaning services for urgent situations. Contact us immediately for rapid response.",
    qualityGuarantee: "Quality Guarantee",
    qualityGuaranteeAnswer: "We stand behind our work with a quality guarantee. If you're not satisfied, we'll make it right.",
    
    // About page specific translations
    readyToWorkTogether: "Ready to Work Together?",
    letsBuildAmazing: "Let us take cleaning off your list",
    aboutCtaDescription: "Tell us what you need cleaned and how often. We reply within 4 working hours with a price and the slots we have free.",
    getStartedToday: "Get Started Today",
    viewOurServices: "View Our Services",
    deliveringExcellence: "What we do",
    customerCentricApproach: "Customer-Centric Approach",
    customerCentricDesc: "We prioritize your satisfaction with personalized care and attention to every detail of your project.",
    trustedReliable: "Trusted & Reliable",
    trustedReliableDesc: "Building lasting relationships through consistent, dependable service delivery.",
    excellenceInService: "Doing it properly",
    excellenceInServiceDesc: "We go the extra step to deliver results that speak for themselves.",
    professionalExcellence: "Professional Excellence",
    qualityServiceGuaranteed: "Quality Service Guaranteed",
    principlesGuideUs: "How we work",
    valuesDescription: "Six things we hold ourselves to on every job, whether it is a weekly home clean or a warehouse shift.",
    passionForExcellence: "Passion for Excellence",
    passionForExcellenceDesc: "We approach every task with dedication and attention to detail.",
    discoverQuality: "Homes, offices and commercial spaces across Lelystad and the wider Flevoland region.",
    
    // Values section translations
    trustReliabilityTitle: "Trust & Reliability",
    timelyServiceTitle: "On time",
    timelyServiceDesc: "We arrive at the time we agreed and get on with it, so your day is not left waiting on us.",
    qualityAssuranceTitle: "Quality Assurance",
    qualityAssuranceDesc: "Maintaining the highest standards through rigorous quality control and continuous improvement processes.",
    customerFocusTitle: "Customer Focus",
    customerFocusDesc: "Putting your needs first with personalized solutions and responsive support that adapts to your requirements.",
    continuousGrowthTitle: "Continuous Growth",
    continuousGrowthDesc: "Embracing innovation and learning to deliver cutting-edge solutions that evolve with industry standards.",
    ourWork: "Our Work",
    professionalExcellenceInEveryDetail: "The kind of work we do",
    
    completeHomeCleaning: "Complete home cleaning solutions",
    orderPickingPacking: "Order picking and packing",
    inventoryManagement: "Inventory management",
    loadingUnloading: "Loading and unloading",
    qualityControlSupport: "Quality control support",
    forkliftOperation: "Forklift operation",
    or: "or",
    us: "us",
    
    // Service descriptions
    floorCareMaintenance: "Floor care and maintenance",
    wasteCollectionDisposal: "Waste collection and disposal",
    restroomCleaning: "Restroom cleaning",
    glassWindowCleaning: "Glass and window cleaning",
    generalUpkeep: "General upkeep of workspaces and common areas",
    
    // Form and UI translations
    selectService: "Select a service",
    serviceType: "Type of service",
    messagePlaceholder: "Tell us about your cleaning or staffing needs, preferred schedule, and any specific requirements...",
    serviceArea: "Service Area",
    needImmediateAssistance: "Need Immediate Assistance?",
    immediateAssistanceDesc: "For urgent cleaning or staffing needs, call us directly. We offer emergency services and can often accommodate same-day requests.",
    weRespondWithin: "We respond within 2-4 hours",
    servingGreaterMetro: "Serving the greater metropolitan area",
    mondayFriday: "Monday - Friday: 8:00 AM - 6:00 PM",
    weekendAppointments: "Weekend appointments available",
    whatsapp: "WhatsApp",
    other: "Other",
    
    // Contact form translations
    cleaningServices: "Cleaning Services",
    staffingServices: "Staffing Services",
    
    // Industry alt text translations
    warehouseIndustry: "Warehouse industry",
    officeIndustry: "Office industry", 
    restaurantIndustry: "Restaurant industry",
    hotelIndustry: "Hotel industry",
    schoolIndustry: "School industry",
    
    // Image alt text translations
    professionalCleaningServices: "Professional cleaning services",
    professionalSupportStaff: "Professional support staff",
    wjCleaningServices: "WJ Cleaning Services",
    professionalCleaningService: "Professional cleaning service",
    commercialCleaningService: "Commercial cleaning service",
    warehouseStaffingService: "Warehouse staff",
    
    // Contact page specific translations
    quickResponseGuaranteed: "Quick Response Guaranteed",
    quickResponseDesc: "We typically respond within 2-4 hours during business hours.",
    contactUsProfessionalCleaning: "Contact us - professional cleaning service",
    professionalCleaningTeam: "Professional cleaning team at work",
    
    // Additional cleaning service translations
    warehouseCleaning: "Warehouse Cleaning",
    restaurantCleaning: "Restaurant/Cafe Cleaning",
    hotelCleaning: "Hotel Cleaning",
    schoolCleaning: "School Cleaning",
    
    // Footer translations
    footerDescription: "Cleaning and staffing services based in Lelystad. Homes, offices, warehouses, hotels and schools across Flevoland.",
    
    // Gallery section translations
    commercialCleaning: "Commercial Cleaning",
    commercialCleaningDesc: "Cleaning for offices and business premises",
    reliableWorkforce: "Reliable workforce solutions",
    // Trust strip + form labels
    fullName: "Full name",
    fullNamePlaceholder: "e.g. Anna de Vries",
    emailUs: "Email us",
    trustInsured: "Fully insured",
    trustInsuredDesc: "Liability cover on every job.",
    trustLocal: "Lelystad based",
    trustLocalDesc: "Serving Flevoland and nearby.",
    trustResponse: "Fast reply",
    trustResponseDesc: "Answer within 4 working hours.",
    // hero booking card
    heroCardTitle: "Book online in 2 minutes",
    heroCardBody: "Fixed price by the size of your home.",
    from: "from",

    // services split
    cleaningServicesNav: "Cleaning",
    staffingServicesNav: "Staffing",
    allServices: "All services",
    cleaningPageTitle: "Cleaning for homes and businesses",
    cleaningPageLead: "Fixed prices by the size of your home, booked online in two minutes. For offices and commercial spaces we quote per site.",
    staffingPageTitle: "Staff when you need extra hands",
    staffingPageLead: "Vetted personnel for warehouses, hotels, restaurants, schools and events. Tell us what you need and we'll match people to it.",
    whatsIncluded: "What's included",
    homeCleaningTitle: "Home cleaning",
    homeCleaningLead: "Priced by the size of your home. Book online and pick your own slot.",
    addDeepClean: "Add a deep clean",
    addDeepCleanDesc: "Descaling, inside cupboards and appliances, windows inside and out, behind and under furniture.",
    commercialTitle: "Offices and commercial",
    commercialLead: "Priced per site rather than per m², because no two are the same. Tell us the space and how often.",
    bookOnline: "Book online",
    requestQuote: "Request a quote",
    talkToUs: "Talk to us",
    staffingHowTitle: "How staffing works",
    staffingStep1: "Tell us the role, the hours and the site.",
    staffingStep2: "We match vetted people and confirm availability.",
    staffingStep3: "They start. You deal with us, not paperwork.",
    whyBookOnline: "Why book online",
    priceUpFront: "Price up front",
    priceUpFrontDesc: "See the cost before you enter a single detail.",
    pickYourSlot: "Pick your own slot",
    pickYourSlotDesc: "Real availability, confirmed straight away.",
    changeAnytime: "Change it easily",
    changeAnytimeDesc: "Reschedule or cancel from a link in your email.",
  },
  nl: {
    // Navigation  
    home: "Home",
    about: "Over Ons",
    services: "Diensten",
    contact: "Contact",
    careers: "Werken bij ons",
    careersNavHint: "Open sollicitatie voor schoonmakers",
    getQuote: "Nu Boeken",
    
    // Hero Section
    heroTitle: "Professionele Schoonmaak en Personeel in Lelystad",
    heroSubtitle: "Schoonmaak voor woningen en kantoren, plus gescreend personeel voor magazijnen, hotels en evenementen. Gevestigd in Lelystad, actief in Flevoland en omgeving.",
    getFreeQuote: "Nu Boeken",
    hireStaff: "Personeel Inhuren",
    
    // Services Section
    ourServices: "Onze Diensten", 
    servicesTitle: "Volledige Schoonmaak- en Personeelsdiensten",
    servicesSubtitle: "Schoonmaak voor woningen, kantoren en bedrijfsruimtes — plus gekwalificeerd personeel wanneer u extra handen nodig heeft.",
    
    // Service Cards
    residentialCleaning: "Particuliere Reiniging",
    residentialDesc: "Maak van uw huis een schone oase met onze uitgebreide particuliere schoonmaakdiensten.",
    
    officeCleaning: "Kantoor Reiniging",
    officeDesc: "Behoud een perfecte werkomgeving met onze uitgebreide commerciële schoonmaakdiensten voor kantoren.",
    
    warehouseStaffing: "Magazijn Personeel", 
    warehouseDesc: "Betrouwbaar magazijnpersoneel om uw operaties soepel en efficiënt te laten verlopen.",
    
    eventStaffing: "Evenement Personeel",
    eventDesc: "Professioneel evenementpersoneel om ervoor te zorgen dat uw speciale gelegenheden vlekkeloos verlopen.",
    
    learnMore: "Meer Weten",
    
    // Services Page
    comprehensiveCleaning: "Uitgebreide Schoonmaakdiensten",
    comprehensiveCleaningDesc: "Professionele schoonmaakdiensten die elk aspect van het onderhouden van schone en hygiënische ruimtes dekken.",
    commercialIndustrial: "Commercieel & Industrieel",
    commercialIndustrialDesc: "Schoonmaak voor bedrijfsruimtes, magazijnen en industriële panden.",
    getCleaningQuote: "Schoonmaak Offerte",
    personnelOutsourcing: "Personeelsuitbesteding",
    qualifiedVetted: "Gekwalificeerd & Geverifieerd Personeel",
    personnelOutsourcingDesc: "Wij leveren gekwalificeerd en geverifieerd personeel voor verschillende zakelijke behoeften. Onze specialisatie ligt bij personeel voor magazijnen, maar wij leveren ook ondersteunend personeel voor kantoren, restaurants, scholen en hotels.",
    warehouseStaffingTitle: "Magazijn Personeel",
    warehouseStaffingDesc: "Onze specialisatie in magazijnpersoneel biedt betrouwbaar personeel om uw operaties soepel en efficiënt te laten verlopen.",
    supportStaffTitle: "Ondersteunend Personeel voor Diverse Industrieën",
    supportStaffDesc: "Wij leveren gekwalificeerd ondersteunend personeel voor diverse zakelijke omgevingen en operationele behoeften.",
    hireSupportStaff: "Ondersteunend Personeel Inhuren",
    industriesWeServe: "Industrieën die wij Bedienen",
    servingDiverse: "Diverse Industrieën Bedienen",
    industriesDesc: "Wij werken in verschillende sectoren en stemmen het werk af op wat er in die sector nodig is.",
    warehouses: "Magazijnen",
    warehousesDesc: "Schoonmaak en personeel voor magazijnen en logistiek.",
    offices: "Kantoren",
    officesDesc: "Professionele schoonmaak en ondersteunend personeel voor kantooromgevingen.",
    restaurantsCafes: "Restaurants & Cafés",
    restaurantsDesc: "Schoonmaak en personeel voor de horeca.",
    hotels: "Hotels",
    hotelsDesc: "Uitgebreide schoonmaak en gastvrijheidspersoneel voor hoteloperaties.",
    schools: "Scholen",
    schoolsDesc: "Schoonmaak en ondersteunend personeel voor scholen en andere leeromgevingen.",
    serviceExcellence: "Vakwerk",
    whyChooseWJ: "Waarom kiezen voor WJ Cleaning Services",
    qualityAssured: "Gegarandeerde Kwaliteit",
    qualityAssuredDesc: "Elke opdracht wordt met zorg uitgevoerd en nagelopen voordat wij vertrekken.",
    fullyInsured: "Volledig Verzekerd",
    fullyInsuredDesc: "Volledige dekking voor uw gemoedsrust en bescherming.",
    flexibleScheduling: "Flexibele planning",
    flexibleSchedulingDesc: "Schoonmaakschema’s afgestemd op uw routine.",
    readyToExperience: "Vraag een prijs voor uw ruimte",
    readyToExperienceDesc: "Vertel ons de grootte van de ruimte en wat u nodig heeft. U krijgt een prijs en een tijd, meestal dezelfde werkdag.",
    
    // About Page
    aboutUs: "Over Ons",
    aboutHeroTitle: "Een klein schoonmaakbedrijf uit Lelystad",
    aboutHeroSubtitle: "Wij maken woningen, kantoren en bedrijfsruimtes schoon in Lelystad, in heel Flevoland en tot ongeveer 50 km daarbuiten — ook in Almere, Amsterdam, Utrecht, Amersfoort en Zwolle.",
    ourStory: "Onze Geschiedenis",
    ourStoryDesc: "WJ Cleaning Services begon klein en bleef dicht bij de mensen voor wie het werkt, in Lelystad en de rest van Flevoland.",
    ourMission: "Onze Missie",
    ourMissionDesc: "Betrouwbare schoonmaak en personeel in heel Flevoland en de omgeving, tegen een prijs die u vooraf weet en op een moment dat we nakomen.",
    ourValues: "Onze Waarden",
    trustReliability: "Vertrouwen & Betrouwbaarheid",
    trustReliabilityDesc: "Wij bouwen langdurige relaties op door werk te leveren waar u op kunt rekenen.",
    qualityExcellence: "Kwaliteit & Uitmuntendheid",
    qualityExcellenceDesc: "Elke dienst wordt geleverd met aandacht voor detail en een verplichting tot uitmuntendheid.",
    customerSatisfaction: "Klanttevredenheid",
    customerSatisfactionDesc: "Uw tevredenheid staat voorop en wij werken naar uw voorkeuren.",
    satisfiedCustomers: "Tevreden Klanten",
    satisfiedCustomersDesc: "Honderden tevreden klanten die ons vertrouwen met hun schoonmaak- en personeelsbehoeften.",
    professionalTeam: "Professioneel team",
    professionalTeamDesc: "Gekwalificeerd en geverifieerd professionals die uitmuntend resultaat leveren.",
    
    // Contact Page
    contactUs: "Contact",
    contactHeroTitle: "Bel Ons",
    contactHeroSubtitle: "Klaar om het verschil te ervaren? Neem vandaag contact met ons op voor een gratis offerte of bespreek uw schoonmaak- en personeelsbehoeften.",
    getInTouch: "Neem contact op",
    getInTouchDesc: "Wij zijn hier om u te helpen met al uw schoonmaak- en personeelsbehoeften. Neem vandaag contact met ons op voor een gratis consultatie.",
    contactInfo: "Contact Informatie",
    contactInfoDesc: "Bereik ons via telefoon, WhatsApp of e-mail. Wij reageren binnen 4 werkuren, maandag tot en met zaterdag.",
    businessHours: "Bedrijfsuren",
    businessHoursDesc: "Wij zijn beschikbaar tijdens deze uren voor consultaties en ondersteuning.",
    sendMessage: "Stuur Bericht",
    sendMessageDesc: "Vul het formulier hieronder in en wij nemen binnen 24 uur contact met u op.",
    name: "Naam",
    phone: "Telefoon",
    message: "Bericht",
    submit: "Indienen",
    submitMessage: "Bedankt voor uw bericht. Wij nemen binnen 24 uur contact met u op.",
    
    // Company Info (Real WJ Cleaning Services info)
    experienceYears: "5+ Jaar Ervaring",
    personalizedSchedules: "Gepersonaliseerde Schema's",
    extraHygiene: "Extra Hygiëne",
    
    // Contact
    phoneNumber: CONTACT_DETAILS.phone, 
    contactEmail: "info@wjcleaningservices.nl",
    region: "Regio Flevoland",
    
    // Mobile bottom bar
    callNow: "Nu Bellen",
    email: "E-mail",
    
    // Service tabs
    cleaning: "Schoonmaak",
    staffing: "Personeel",
    
    // Additional translations for hardcoded text
    professionalCleaningStaffing: "Professionele Schoonmaak & Personeelsoplossingen",
    aboutWJCleanforce: "Over WJ Cleaning Services",
    trustedPartnersExcellence: "Vertrouwde Partners in Uitmuntendheid",
    aboutDescription: "WJ Cleaning Services levert schoonmaak en personeel voor woningen en bedrijven in Lelystad en heel Flevoland, gebouwd op kwaliteit, betrouwbaarheid en klanttevredenheid.",
    experienceYearsDesc: "Ons team heeft meer dan 5 jaar ervaring in de schoonmaaksector.",
    personalizedSchedulesDesc: "Op maat gemaakte schoonmaakschema's die perfect aansluiten bij jouw wensen.",
    extraHygieneDesc: "Extra aandacht aan hygiëne voor een volledig schone en gezonde omgeving.",
    excellenceInDetail: "Uitmuntendheid in Elk Detail",
    foundersQuote: "Winfred & Jackie, oprichters",
    howItWorks: "Hoe Het Werkt",
    simpleProcessOutstanding: "Zo werkt het",
    howItWorksDesc: "Drie stappen van eerste contact tot een schone ruimte. Geen lange formulieren, geen dagen wachten op een offerte.",
    getYourQuote: "Krijg Je Offerte",
    getYourQuoteDesc: "Vertel ons de grootte van de ruimte en wat u nodig heeft. U krijgt een echte prijs, geen ‘neem contact op voor tarieven’.",
    scheduleService: "Plan de afspraak",
    scheduleServiceDesc: "Kies een tijd die voor jou werkt. We bieden flexibele planning die past bij je drukke levensstijl en zakelijke behoeften.",
    enjoyCleanSpaces: "Geniet van Schone Ruimtes",
    enjoyCleanSpacesDesc: "Leun achterover terwijl ons team professionele resultaten levert.",
    readyToGetStarted: "Klaar om te Beginnen?",
    experienceDifference: "Klaar voor schoonmaak waar u niet achteraan hoeft te bellen?",
    ctaDescription: "Stuur ons de details en wij bevestigen uw moment. De meeste aanvragen krijgen dezelfde werkdag antwoord.",
    getFreeQuoteNow: "Nu Boeken",
    whatsappUs: "WhatsApp Ons",
    satisfactionGuaranteed: "Tevredenheid Gegarandeerd",
    
    // Services page specific translations
    staffOfficeB1: "Receptie en ontvangst",
    staffOfficeB2: "Post, archief en vergaderruimtes",
    staffOfficeB3: "Vervanging bij vakantie en ziekte",
    staffRestaurantB1: "Afwashulp en keukenhulp",
    staffRestaurantB2: "Runners en bediening",
    staffRestaurantB3: "Invallen op korte termijn",
    staffHotelB1: "Housekeeping en kamers wisselen",
    staffHotelB2: "Linnen, was en aanvullen",
    staffHotelB3: "Openbare ruimtes en gangen",
    staffSchoolB1: "Conciërge- en locatieondersteuning",
    staffSchoolB2: "Tijdens schooltijd en vakanties",
    staffSchoolB3: "Vooraf gecontroleerd",
    staffEventB1: "Op- en afbouwploegen",
    staffEventB2: "Bediening en vloerpersoneel",
    staffEventB3: "Opruimen na afloop",
    staffRolesTitle: "Het personeel dat wij plaatsen",
    staffRolesLead: "Gescreend, ingewerkt en klaar voor de dienst. Geef door welke rol en welke uren, dan vullen wij het in.",
    staffOfficeDesc: "Receptie, post en archief, vergaderruimtes klaarmaken en extra handen tijdens drukte of vakanties.",
    staffRestaurantDesc: "Afwashulp, runners en bediening voor tijdens de service, zodat één ziekmelding geen sectie sluit.",
    staffHotelDesc: "Housekeeping en wisselpersoneel dat op uw manier werkt en kamers klaar houdt voor de volgende gast.",
    staffSchoolDesc: "Conciërge- en ondersteunend personeel voor schooltijd, vakanties en vervangingsdagen, vooraf gecontroleerd.",
    staffEventDesc: "Ploegen voor opbouw, service en afbouw bij eenmalige evenementen, vooraf ingelicht en aanwezig als de deuren opengaan.",
    officeSupportStaff: "Kantoorpersoneel",
    restaurantCafePersonnel: "Horecapersoneel",
    hotelStaff: "Hotelpersoneel",
    schoolSupportStaff: "Schoolpersoneel",
    eventStaffingText: "Evenementpersoneel",
    
    // Footer translations
    quickLinks: "Snelle Links",
    stayConnected: "Blijf Verbonden",
    allRightsReserved: "Alle rechten voorbehouden.",
    privacyPolicy: "Privacybeleid",
    termsOfService: "Algemene voorwaarden",
    cookiePolicy: "Cookiebeleid",
    designedByQuube: "Ontwikkeld en ontworpen door",
    
    // FAQ translations
    frequentlyAskedQuestions: "Veelgestelde Vragen",
    commonQuestionsAnswered: "Veelgestelde Vragen Beantwoord",
    faqDescription: "Vind antwoorden op de meest gestelde vragen over onze diensten, prijzen en beleid.",
    whatAreasServe: "Welke gebieden bedienen jullie?",
    whatAreasServeAnswer: "Wij werken in Lelystad, heel Flevoland en tot ongeveer 50 km daarbuiten. Twijfelt u of uw adres erbij hoort? Bel of mail ons even.",
    howQuicklyStart: "Hoe snel kunnen jullie beginnen?",
    howQuicklyStartAnswer: "Online boeken kan tot 24 uur van tevoren. Heeft u het eerder nodig, bel ons dan even — vaak lukt het alsnog.",
    staffInsuredBonded: "Zijn jullie personeel verzekerd en gebonden?",
    staffInsuredBondedAnswer: "Ja, ons personeel is verzekerd. Wij hebben een aansprakelijkheidsverzekering voor het werk dat wij uitvoeren.",
    cleaningProducts: "Welke schoonmaakproducten gebruiken jullie?",
    cleaningProductsAnswer: "Wij gebruiken professionele middelen die veilig zijn voor kinderen en huisdieren. Heeft u huisdieren, geef dat aan bij het boeken, dan houden wij daar rekening mee.",
    provideSupplies: "Leveren jullie benodigdheden en apparatuur?",
    provideSuppliesAnswer: "Ja, wij nemen alle middelen en apparatuur zelf mee. U hoeft niets klaar te zetten.",
    satisfactionGuarantee: "Wat is jullie tevredenheidsgarantie?",
    satisfactionGuaranteeAnswer: "Bent u niet tevreden, laat het ons binnen 24 uur weten. Wij komen terug en maken het kosteloos in orde.",
    
    // Contact page FAQ translations
    schedulingFlexibility: "Planning Flexibiliteit",
    schedulingFlexibilityAnswer: "Wij bieden flexibele planningsopties om aan uw behoeften te voldoen, inclusief vroege ochtend-, avond- en weekendafspraken.",
    emergencyServices: "Spoeddiensten",
    emergencyServicesAnswer: "Ja, wij bieden spoedschoonmaakdiensten voor urgente situaties. Neem direct contact met ons op voor snelle reactie.",
    qualityGuarantee: "Kwaliteitsgarantie",
    qualityGuaranteeAnswer: "Wij staan achter ons werk met een kwaliteitsgarantie. Als u niet tevreden bent, maken wij het goed.",
    
    // About page specific translations
    readyToWorkTogether: "Klaar om Samen te Werken?",
    letsBuildAmazing: "Wij nemen de schoonmaak van uw lijst",
    aboutCtaDescription: "Vertel ons wat er schoongemaakt moet worden en hoe vaak. Wij reageren binnen 4 werkuren met een prijs en de momenten die vrij zijn.",
    getStartedToday: "Begin Vandaag",
    viewOurServices: "Bekijk Onze Diensten",
    deliveringExcellence: "Wat wij doen",
    customerCentricApproach: "Klantgerichte Aanpak",
    customerCentricDesc: "Wij prioriteren uw tevredenheid met persoonlijke zorg en aandacht voor elk detail van uw project.",
    trustedReliable: "Betrouwbaar & Vertrouwd",
    trustedReliableDesc: "Langdurige relaties opbouwen door consistente, betrouwbare dienstverlening.",
    excellenceInService: "Vakwerk in de praktijk",
    excellenceInServiceDesc: "Wij zetten die extra stap voor resultaten die voor zich spreken.",
    professionalExcellence: "Professionele Uitmuntendheid",
    qualityServiceGuaranteed: "Gegarandeerde Kwaliteitsservice",
    principlesGuideUs: "Hoe wij werken",
    valuesDescription: "Zes dingen waar wij ons aan houden bij elke opdracht, of het een wekelijkse schoonmaak thuis is of een dienst in een magazijn.",
    passionForExcellence: "Passie voor Uitmuntendheid",
    passionForExcellenceDesc: "Wij benaderen elke taak met toewijding en aandacht voor detail.",
    discoverQuality: "Woningen, kantoren en bedrijfsruimtes in Lelystad en de rest van Flevoland.",
    
    // Values section translations
    trustReliabilityTitle: "Vertrouwen & Betrouwbaarheid",
    timelyServiceTitle: "Op tijd",
    timelyServiceDesc: "Wij komen op het afgesproken tijdstip en werken door, zodat uw dag niet in de war loopt.",
    qualityAssuranceTitle: "Kwaliteitsgarantie",
    qualityAssuranceDesc: "Het handhaven van de hoogste normen door rigoureuze kwaliteitscontrole en continue verbeteringsprocessen.",
    customerFocusTitle: "Klantgerichtheid",
    customerFocusDesc: "Uw behoeften op de eerste plaats stellen met gepersonaliseerde oplossingen en responsieve ondersteuning die zich aanpast aan uw vereisten.",
    continuousGrowthTitle: "Continue Groei",
    continuousGrowthDesc: "Innovatie en leren omarmen om geavanceerde oplossingen te leveren die evolueren met industriestandaarden.",
    ourWork: "Ons Werk",
    professionalExcellenceInEveryDetail: "Het werk dat wij doen",
    
    completeHomeCleaning: "Complete particuliere schoonmaakoplossingen",
    orderPickingPacking: "Order picking en verpakking",
    inventoryManagement: "Voorraadbeheer",
    loadingUnloading: "Laden en lossen",
    qualityControlSupport: "Kwaliteitscontrole ondersteuning",
    forkliftOperation: "Vorkheftruck bediening",
    or: "of",
    us: "ons",
    
    // Service descriptions
    floorCareMaintenance: "Vloeronderhoud en onderhoud",
    wasteCollectionDisposal: "Afvalinzameling en -verwerking",
    restroomCleaning: "Toilet- en badkamerreiniging",
    glassWindowCleaning: "Glas- en raamreiniging",
    generalUpkeep: "Algemeen onderhoud van werkruimtes en gemeenschappelijke ruimtes",
    
    // Form and UI translations
    selectService: "Kies een dienst",
    serviceType: "Soort dienst",
    messagePlaceholder: "Vertel ons over uw schoonmaak- of personeelsbehoeften, gewenste planning en eventuele specifieke vereisten...",
    serviceArea: "Servicegebied",
    needImmediateAssistance: "Directe Hulp Nodig?",
    immediateAssistanceDesc: "Voor urgente schoonmaak- of personeelsbehoeften, bel ons direct. Wij bieden spoeddiensten en kunnen vaak dezelfde dag accommoderen.",
    weRespondWithin: "Wij reageren binnen 2-4 uur",
    servingGreaterMetro: "Wij bedienen de grotere metropoolregio",
    mondayFriday: "Maandag - Vrijdag: 8:00 - 18:00",
    weekendAppointments: "Weekend afspraken beschikbaar",
    whatsapp: "WhatsApp",
    other: "Anders",
    
    // Contact form translations
    cleaningServices: "Schoonmaakdiensten",
    staffingServices: "Personeelsdiensten",
    
    // Industry alt text translations
    warehouseIndustry: "Magazijn industrie",
    officeIndustry: "Kantoor industrie",
    restaurantIndustry: "Restaurant industrie", 
    hotelIndustry: "Hotel industrie",
    schoolIndustry: "School industrie",
    
    // Image alt text translations
    professionalCleaningServices: "Professionele schoonmaakdiensten",
    professionalSupportStaff: "Professioneel ondersteunend personeel",
    wjCleaningServices: "WJ Schoonmaakdiensten",
    professionalCleaningService: "Professionele schoonmaakservice",
    commercialCleaningService: "Commerciële schoonmaakservice",
    warehouseStaffingService: "Magazijnpersoneel",
    
    // Contact page specific translations
    quickResponseGuaranteed: "Snelle Reactie Gegarandeerd",
    quickResponseDesc: "Wij reageren meestal binnen 2-4 uur tijdens kantooruren.",
    contactUsProfessionalCleaning: "Contact met ons - professionele schoonmaakservice",
    professionalCleaningTeam: "Professioneel schoonmaakteam aan het werk",
    
    // Additional cleaning service translations
    warehouseCleaning: "Magazijn Schoonmaak",
    restaurantCleaning: "Restaurant/Café Schoonmaak",
    hotelCleaning: "Hotel Schoonmaak",
    schoolCleaning: "School Schoonmaak",
    
    // Footer translations
    footerDescription: "Schoonmaak- en personeelsdiensten vanuit Lelystad. Woningen, kantoren, magazijnen, hotels en scholen in heel Flevoland.",
    
    // Gallery section translations
    commercialCleaning: "Commerciële Schoonmaak",
    commercialCleaningDesc: "Schoonmaak van kantoren en bedrijfspanden",
    reliableWorkforce: "Betrouwbare personeelsoplossingen",
    // Trust strip + form labels
    fullName: "Volledige naam",
    fullNamePlaceholder: "bijv. Anna de Vries",
    emailUs: "E-mail ons",
    trustInsured: "Volledig verzekerd",
    trustInsuredDesc: "Aansprakelijkheidsdekking bij elke opdracht.",
    trustLocal: "Gevestigd in Lelystad",
    trustLocalDesc: "Actief in Flevoland en omgeving.",
    trustResponse: "Snel antwoord",
    trustResponseDesc: "Reactie binnen 4 werkuren.",
    // hero booking card
    heroCardTitle: "Boek online in 2 minuten",
    heroCardBody: "Vaste prijs op basis van uw woningoppervlak.",
    from: "vanaf",

    // services split
    cleaningServicesNav: "Schoonmaak",
    staffingServicesNav: "Personeel",
    allServices: "Alle diensten",
    cleaningPageTitle: "Schoonmaak voor huis en bedrijf",
    cleaningPageLead: "Vaste prijzen op basis van uw woningoppervlak, online geboekt in twee minuten. Voor kantoren en bedrijfsruimtes maken wij een offerte per locatie.",
    staffingPageTitle: "Personeel wanneer u extra handen nodig heeft",
    staffingPageLead: "Gescreend personeel voor magazijnen, hotels, restaurants, scholen en evenementen. Vertel ons wat u nodig heeft en wij zoeken de juiste mensen.",
    whatsIncluded: "Wat is inbegrepen",
    homeCleaningTitle: "Schoonmaak thuis",
    homeCleaningLead: "Prijs op basis van uw woningoppervlak. Boek online en kies zelf uw moment.",
    addDeepClean: "Dieptereiniging toevoegen",
    addDeepCleanDesc: "Ontkalken, binnenkant kasten en apparatuur, ramen binnen en buiten, achter en onder meubels.",
    commercialTitle: "Kantoren en bedrijfsruimtes",
    commercialLead: "Prijs per locatie in plaats van per m², omdat geen twee hetzelfde zijn. Vertel ons de ruimte en hoe vaak.",
    bookOnline: "Online boeken",
    requestQuote: "Offerte aanvragen",
    talkToUs: "Neem contact op",
    staffingHowTitle: "Zo werkt personeel inhuren",
    staffingStep1: "Vertel ons de functie, de uren en de locatie.",
    staffingStep2: "Wij zoeken gescreende mensen en bevestigen beschikbaarheid.",
    staffingStep3: "Zij beginnen. U regelt het met ons, niet met papierwerk.",
    whyBookOnline: "Waarom online boeken",
    priceUpFront: "Vooraf de prijs",
    priceUpFrontDesc: "U ziet de kosten voordat u één gegeven invult.",
    pickYourSlot: "Kies zelf uw moment",
    pickYourSlotDesc: "Echte beschikbaarheid, direct bevestigd.",
    changeAnytime: "Eenvoudig wijzigen",
    changeAnytimeDesc: "Verzetten of annuleren via een link in uw e-mail.",
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'wj-language'

const isLanguage = (value: unknown): value is Language => value === 'en' || value === 'nl'

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start on 'en' so the server render and the first client render
  // agree. Reading localStorage during initial state caused a hydration
  // mismatch for anyone whose saved language was 'nl'.
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (isLanguage(saved)) setLanguage(saved)
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      const value = translations[language][key]
      if (value === undefined) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[i18n] missing "${key}" for language "${language}"`)
        }
        return translations.en[key] ?? key
      }
      return value
    },
    [language],
  )

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang)
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({ language, setLanguage: handleSetLanguage, t }),
    [language, handleSetLanguage, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
