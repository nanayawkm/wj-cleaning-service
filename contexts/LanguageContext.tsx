"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { CONTACT_DETAILS } from '@/components/constant'

type Language = 'en' | 'nl'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    services: "Services", 
    contact: "Contact",
    getQuote: "Get Quote",
    
    // Hero Section
    heroTitle: "Clean Spaces, Reliable Staff",
    heroSubtitle: "WJ Cleaning Services delivers exceptional cleaning services and professional staffing solutions. From residential homes to corporate offices, we ensure spotless results and dependable workforce.",
    getFreeQuote: "Get Free Quote",
    hireStaff: "Hire Staff Today",
    
    // Services Section
    ourServices: "Our Services",
    servicesTitle: "Complete Cleaning & Staffing Solutions",
    servicesSubtitle: "From sparkling clean spaces to reliable workforce solutions, we deliver excellence in every service with unmatched quality and professionalism.",
    
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
    commercialIndustrialDesc: "Specialized cleaning services for commercial spaces, warehouses, and industrial facilities.",
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
    industriesDesc: "Our expertise spans across multiple industries, providing tailored solutions for each sector's unique needs.",
    warehouses: "Warehouses",
    warehousesDesc: "Specialized cleaning and staffing solutions for warehouse operations and logistics.",
    offices: "Offices",
    officesDesc: "Professional cleaning and support staff for office environments.",
    restaurantsCafes: "Restaurants & Cafés",
    restaurantsDesc: "Cleaning services and staffing solutions for food service establishments.",
    hotels: "Hotels",
    hotelsDesc: "Comprehensive cleaning and hospitality staffing for hotel operations.",
    schools: "Schools",
    schoolsDesc: "Educational facility cleaning and support staff for schools and learning environments.",
    serviceExcellence: "Service Excellence",
    whyChooseWJ: "Why Choose WJ Cleaning Services",
    qualityAssured: "Quality Assured",
    qualityAssuredDesc: "Every service is backed by our quality guarantee and attention to detail.",
    fullyInsured: "Fully Insured",
    fullyInsuredDesc: "Complete coverage for your peace of mind and protection.",
    support247: "24/7 Support",
    support247Desc: "Round-the-clock availability for emergencies and urgent needs.",
    readyToExperience: "Ready to Experience the Difference?",
    readyToExperienceDesc: "Get your free quote today and discover why hundreds of customers trust WJ Cleaning Services for their cleaning and staffing needs.",
    callNow: "Call Now",
    
    // About Page - Updated with meaningful content
    aboutUs: "Who We Are",
    aboutHeroTitle: "Committed to Clean Spaces, Driven by Excellence",
    aboutHeroSubtitle: "WJ Cleaning Services is committed to delivering exceptional cleaning and staffing services. We've built our reputation on trust, reliability, and exceptional service that transforms spaces and exceeds expectations.",
    ourStory: "Our Journey",
    ourStoryDesc: "WJ Cleaning Services was established with a clear understanding of the importance of trust, reliability, and attention to detail. What started as a small business has grown into a trusted partner for hundreds of satisfied customers.",
    ourMission: "Our Mission",
    ourMissionDesc: "To provide exceptional cleaning services and reliable staffing solutions that exceed expectations, while building lasting relationships based on trust and quality.",
    ourValues: "Our Core Values",
    trustReliability: "Trust & Reliability",
    trustReliabilityDesc: "We build lasting relationships through consistent, dependable service delivery.",
    qualityExcellence: "Quality & Excellence",
    qualityExcellenceDesc: "Every service is delivered with attention to detail and commitment to excellence.",
    customerSatisfaction: "Customer Satisfaction",
    customerSatisfactionDesc: "Your satisfaction is our priority, and we go above and beyond to meet your needs.",
    satisfiedCustomers: "Satisfied Customers",
    satisfiedCustomersDesc: "Hundreds of happy customers who trust us with their cleaning and staffing needs.",
    professionalTeam: "Professional Team",
    professionalTeamDesc: "Qualified and vetted professionals committed to delivering exceptional results.",
    
    // Contact Page - Updated with meaningful content
    contactUs: "Get in Touch",
    contactHeroTitle: "Ready to Transform Your Space?",
    contactHeroSubtitle: "Let's discuss how we can help you achieve spotless results and reliable staffing solutions. Contact us today for a personalized consultation.",
    getInTouch: "Start Your Project",
    getInTouchDesc: "We're here to help with all your cleaning and staffing needs. Contact us today for a free consultation.",
    contactInfo: "Contact Information",
    contactInfoDesc: "Reach out to us through any of these channels. We're here to help 24/7.",
    businessHours: "Business Hours",
    businessHoursDesc: "We're available during these hours for consultations and support.",
    sendMessage: "Send Your Message",
    sendMessageDesc: "Fill out the form below and we'll get back to you within 24 hours with a personalized solution.",
    name: "Full Name",
    email: "Email Address",
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
    whatsapp: "WhatsApp",
    email: "Email",
    
    // Service tabs
    cleaning: "Cleaning",
    staffing: "Staffing",
    
    // Additional translations for hardcoded text
    professionalCleaningStaffing: "Professional Cleaning & Staffing Solutions",
    aboutWJCleanforce: "About WJ Cleaning Services",
    trustedPartnersExcellence: "Trusted Partners in Excellence",
    aboutDescription: "WJ Cleaning Services was established with a simple mission: to provide exceptional cleaning and staffing services that exceed expectations. Our commitment to quality, reliability, and customer satisfaction has made us the go-to choice for businesses and homeowners alike.",
    experienceYearsDesc: "Our team has over 5 years of experience in the cleaning industry.",
    personalizedSchedulesDesc: "Customized cleaning schedules that perfectly match your preferences.",
    extraHygieneDesc: "Extra attention to hygiene for a completely clean and healthy environment.",
    excellenceInDetail: "Excellence in Every Detail",
    foundersQuote: "Winfred & Jackie, Founders",
    howItWorks: "How It Works",
    simpleProcessOutstanding: "Simple Process, Outstanding Results",
    howItWorksDesc: "Getting started with WJ Cleaning Services is easy. Our streamlined process ensures you get the service you need quickly and efficiently.",
    getYourQuote: "Get Your Quote",
    getYourQuoteDesc: "Contact us for a free consultation. We'll assess your needs and provide a transparent, competitive quote.",
    scheduleService: "Schedule Service",
    scheduleServiceDesc: "Choose a time that works for you. We offer flexible scheduling to fit your busy lifestyle and business needs.",
    enjoyCleanSpaces: "Enjoy Clean Spaces",
    enjoyCleanSpacesDesc: "Sit back and relax while our professional team delivers exceptional results that exceed your expectations.",
    readyToGetStarted: "Ready to Get Started?",
    experienceDifference: "Experience the WJ Cleaning Services Difference Today",
    ctaDescription: "Join hundreds of satisfied customers who trust us with their cleaning and staffing needs. Get your free quote in minutes.",
    getFreeQuoteNow: "Get Free Quote Now",
    whatsappUs: "WhatsApp Us",
    satisfactionGuaranteed: "Satisfaction Guaranteed",
    
    // Services page specific translations
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
    whatAreasServeAnswer: "We primarily serve the Flevoland region and surrounding areas. Contact us to confirm if we cover your specific location.",
    howQuicklyStart: "How quickly can you start?",
    howQuicklyStartAnswer: "We can often accommodate same-day or next-day requests for urgent needs. Regular scheduling typically requires 24-48 hours notice.",
    staffInsuredBonded: "Are your staff insured and bonded?",
    staffInsuredBondedAnswer: "Yes, all our staff are fully insured and bonded. We carry comprehensive liability coverage for your peace of mind.",
    cleaningProducts: "What cleaning products do you use?",
    cleaningProductsAnswer: "We use eco-friendly, professional-grade cleaning products that are safe for families, pets, and the environment while delivering exceptional results.",
    provideSupplies: "Do you provide supplies and equipment?",
    provideSuppliesAnswer: "Yes, we bring all necessary cleaning supplies and equipment. You don't need to provide anything - we come fully prepared.",
    satisfactionGuarantee: "What is your satisfaction guarantee?",
    satisfactionGuaranteeAnswer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with our service, we'll return to fix it at no additional cost.",
    
    // Contact page FAQ translations
    schedulingFlexibility: "Scheduling Flexibility",
    schedulingFlexibilityAnswer: "We offer flexible scheduling options to accommodate your needs, including early morning, evening, and weekend appointments.",
    emergencyServices: "Emergency Services",
    emergencyServicesAnswer: "Yes, we provide emergency cleaning services for urgent situations. Contact us immediately for rapid response.",
    qualityGuarantee: "Quality Guarantee",
    qualityGuaranteeAnswer: "We stand behind our work with a quality guarantee. If you're not satisfied, we'll make it right.",
    
    // About page specific translations
    readyToWorkTogether: "Ready to Work Together?",
    letsBuildAmazing: "Let's Build Something Amazing Together",
    aboutCtaDescription: "Ready to experience the WJ Cleaning Services difference? Contact us today for a free consultation and discover how we can help you achieve your goals.",
    getStartedToday: "Get Started Today",
    viewOurServices: "View Our Services",
    deliveringExcellence: "Delivering Excellence in Every Service",
    customerCentricApproach: "Customer-Centric Approach",
    customerCentricDesc: "We prioritize your satisfaction with personalized care and attention to every detail of your project.",
    trustedReliable: "Trusted & Reliable",
    trustedReliableDesc: "Building lasting relationships through consistent, dependable service delivery.",
    excellenceInService: "Excellence in Service",
    excellenceInServiceDesc: "We go above and beyond to exceed expectations, delivering results that speak for themselves.",
    professionalExcellence: "Professional Excellence",
    qualityServiceGuaranteed: "Quality Service Guaranteed",
    principlesGuideUs: "The Principles That Guide Us Daily",
    valuesDescription: "Our core values shape every decision we make and every service we provide. They're the foundation of our success and the reason our customers trust us.",
    passionForExcellence: "Passion for Excellence",
    passionForExcellenceDesc: "We approach every task with dedication and attention to detail, ensuring exceptional results that exceed expectations.",
    discoverQuality: "Discover the quality and attention to detail that sets WJ Cleaning Services apart from the competition.",
    
    // Values section translations
    trustReliabilityTitle: "Trust & Reliability",
    timelyServiceTitle: "Timely Service",
    timelyServiceDesc: "Respecting your time with punctual arrivals and efficient service delivery that fits your schedule.",
    qualityAssuranceTitle: "Quality Assurance",
    qualityAssuranceDesc: "Maintaining the highest standards through rigorous quality control and continuous improvement processes.",
    customerFocusTitle: "Customer Focus",
    customerFocusDesc: "Putting your needs first with personalized solutions and responsive support that adapts to your requirements.",
    continuousGrowthTitle: "Continuous Growth",
    continuousGrowthDesc: "Embracing innovation and learning to deliver cutting-edge solutions that evolve with industry standards.",
    ourWork: "Our Work",
    professionalExcellenceInEveryDetail: "Professional Excellence in Every Detail",
    
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
    serviceType: "Service Type",
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
    warehouseStaffingService: "Warehouse staffing service",
    
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
    footerDescription: "Professional cleaning and staffing services built on trust, reliability, and excellence. Built with dedication to exceptional service.",
    
    // Gallery section translations
    commercialCleaning: "Commercial Cleaning",
    commercialCleaningDesc: "Professional office and facility cleaning",
    reliableWorkforce: "Reliable workforce solutions",
  },
  nl: {
    // Navigation  
    home: "Home",
    about: "Over Ons",
    services: "Diensten",
    contact: "Contact", 
    getQuote: "Offerte",
    
    // Hero Section
    heroTitle: "Schone Ruimtes, Betrouwbaar Personeel",
    heroSubtitle: "WJ Cleaning Services levert uitzonderlijke schoonmaakdiensten en professionele personeelsoplossingen. Van particuliere woningen tot kantoren, wij zorgen voor vlekkeloze resultaten.",
    getFreeQuote: "Gratis Offerte",
    hireStaff: "Personeel Inhuren",
    
    // Services Section
    ourServices: "Onze Diensten", 
    servicesTitle: "Volledige Schoonmaak- en Personeelsdiensten",
    servicesSubtitle: "Van glanzende schone ruimtes tot betrouwbare personeelsdiensten - wij leveren uitmuntende kwaliteit in elke service.",
    
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
    commercialIndustrialDesc: "Gespecialiseerde schoonmaakdiensten voor commerciële ruimtes, magazijnen en industriële faciliteiten.",
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
    industriesDesc: "Onze expertise strekt zich uit over meerdere industrieën, waarbij wij op maat gemaakte oplossingen bieden voor de unieke behoeften van elke sector.",
    warehouses: "Magazijnen",
    warehousesDesc: "Gespecialiseerde schoonmaak- en personeelsoplossingen voor magazijnoperaties en logistiek.",
    offices: "Kantoren",
    officesDesc: "Professionele schoonmaak en ondersteunend personeel voor kantooromgevingen.",
    restaurantsCafes: "Restaurants & Cafés",
    restaurantsDesc: "Schoonmaakdiensten en personeelsoplossingen voor horeca-ondernemingen.",
    hotels: "Hotels",
    hotelsDesc: "Uitgebreide schoonmaak en gastvrijheidspersoneel voor hoteloperaties.",
    schools: "Scholen",
    schoolsDesc: "Educatieve faciliteit schoonmaak en ondersteunend personeel voor scholen en leeromgevingen.",
    serviceExcellence: "Service Uitmuntendheid",
    whyChooseWJ: "Waarom Kiezen voor WJ Cleaning Services",
    qualityAssured: "Gegarandeerde Kwaliteit",
    qualityAssuredDesc: "Elke service wordt ondersteund door onze kwaliteitsgarantie en aandacht voor detail.",
    fullyInsured: "Volledig Verzekerd",
    fullyInsuredDesc: "Volledige dekking voor uw gemoedsrust en bescherming.",
    support247: "24/7 Ondersteuning",
    support247Desc: "Rond-de-klok beschikbaarheid voor noodgevallen en urgente behoeften.",
    readyToExperience: "Klaar om het Verschil te Ervaren?",
    readyToExperienceDesc: "Krijg vandaag nog uw gratis offerte en ontdek waarom honderden klanten WJ Cleaning Services vertrouwen voor hun schoonmaak- en personeelsbehoeften.",
    callNow: "Nu Bellen",
    
    // About Page
    aboutUs: "Over Ons",
    aboutHeroTitle: "Vertrouwen en Uitmuntendheid in Elke Service",
    aboutHeroSubtitle: "WJ Cleaning Services is uw betrouwbare partner voor professionele schoonmaak- en personeelsdiensten. Wij leveren uitmuntende resultaten die uw verwachtingen overtreffen.",
    ourStory: "Onze Geschiedenis",
    ourStoryDesc: "WJ Cleaning Services is opgericht met een duidelijk begrip van het belang van vertrouwen, betrouwbaarheid en aandacht voor detail. Wat begon als een klein bedrijf is uitgegroeid tot een vertrouwde partner.",
    ourMission: "Onze Missie",
    ourMissionDesc: "Om uitmuntende schoonmaakdiensten en betrouwbare personeelsoplossingen te leveren die verwachtingen bovenstebruiken, terwijl we langdurige relaties opbouwen op vertrouwen en kwaliteit.",
    ourValues: "Onze Waarden",
    trustReliability: "Vertrouwen & Betrouwbaarheid",
    trustReliabilityDesc: "We bouwen langdurige relaties op door consistente, betrouwbare dienstlevering.",
    qualityExcellence: "Kwaliteit & Uitmuntendheid",
    qualityExcellenceDesc: "Elke dienst wordt geleverd met aandacht voor detail en een verplichting tot uitmuntendheid.",
    customerSatisfaction: "Klanttevredenheid",
    customerSatisfactionDesc: "Uw tevredenheid is ons prioriteit, en we gaan boven en buiten de noden van u.",
    satisfiedCustomers: "Tevreden Klanten",
    satisfiedCustomersDesc: "Honderden tevreden klanten die ons vertrouwen met hun schoonmaak- en personeelsbehoeften.",
    professionalTeam: "Professionele Team",
    professionalTeamDesc: "Gekwalificeerd en geverifieerd professionals die uitmuntend resultaat leveren.",
    
    // Contact Page
    contactUs: "Contact",
    contactHeroTitle: "Bel Ons",
    contactHeroSubtitle: "Klaar om het verschil te ervaren? Neem vandaag contact met ons op voor een gratis offerte of bespreek uw schoonmaak- en personeelsbehoeften.",
          getInTouch: "Bel Ons",
    getInTouchDesc: "Wij zijn hier om u te helpen met al uw schoonmaak- en personeelsbehoeften. Neem vandaag contact met ons op voor een gratis consultatie.",
    contactInfo: "Contact Informatie",
    contactInfoDesc: "Stuur ons een bericht via een van deze kanalen. Wij zijn hier om u te helpen 24/7.",
    businessHours: "Bedrijfsuren",
    businessHoursDesc: "Wij zijn beschikbaar tijdens deze uren voor consultaties en ondersteuning.",
    sendMessage: "Stuur Bericht",
    sendMessageDesc: "Vul het formulier hieronder in en wij nemen binnen 24 uur contact met u op.",
    name: "Naam",
    email: "E-mail",
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
    whatsapp: "WhatsApp",
    email: "E-mail",
    
    // Service tabs
    cleaning: "Schoonmaak",
    staffing: "Personeel",
    
    // Additional translations for hardcoded text
    professionalCleaningStaffing: "Professionele Schoonmaak & Personeelsoplossingen",
    aboutWJCleanforce: "Over WJ Cleaning Services",
    trustedPartnersExcellence: "Vertrouwde Partners in Uitmuntendheid",
    aboutDescription: "WJ Cleaning Services is opgericht met een eenvoudige missie: het leveren van uitzonderlijke schoonmaak- en personeelsdiensten die verwachtingen overtreffen. Onze toewijding aan kwaliteit, betrouwbaarheid en klanttevredenheid heeft ons tot de eerste keuze gemaakt voor bedrijven en huiseigenaren.",
    experienceYearsDesc: "Ons team heeft meer dan 5 jaar ervaring in de schoonmaaksector.",
    personalizedSchedulesDesc: "Op maat gemaakte schoonmaakschema's die perfect aansluiten bij jouw wensen.",
    extraHygieneDesc: "Extra aandacht aan hygiëne voor een volledig schone en gezonde omgeving.",
    excellenceInDetail: "Uitmuntendheid in Elk Detail",
    foundersQuote: "WJ Cleaning Services",
    howItWorks: "Hoe Het Werkt",
    simpleProcessOutstanding: "Eenvoudig Proces, Uitzonderlijke Resultaten",
    howItWorksDesc: "Beginnen met WJ Cleaning Services is eenvoudig. Ons gestroomlijnde proces zorgt ervoor dat je snel en efficiënt de service krijgt die je nodig hebt.",
    getYourQuote: "Krijg Je Offerte",
    getYourQuoteDesc: "Neem contact met ons op voor een gratis consultatie. We beoordelen je behoeften en geven een transparante, concurrerende offerte.",
    scheduleService: "Plan Service",
    scheduleServiceDesc: "Kies een tijd die voor jou werkt. We bieden flexibele planning die past bij je drukke levensstijl en zakelijke behoeften.",
    enjoyCleanSpaces: "Geniet van Schone Ruimtes",
    enjoyCleanSpacesDesc: "Leun achterover en ontspan terwijl ons professionele team uitzonderlijke resultaten levert die je verwachtingen overtreffen.",
    readyToGetStarted: "Klaar om te Beginnen?",
    experienceDifference: "Ervaar het WJ Cleaning Services Verschil Vandaag",
    ctaDescription: "Sluit je aan bij honderden tevreden klanten die ons vertrouwen met hun schoonmaak- en personeelsbehoeften. Krijg je gratis offerte in minuten.",
    getFreeQuoteNow: "Krijg Nu Gratis Offerte",
    whatsappUs: "WhatsApp Ons",
    satisfactionGuaranteed: "Tevredenheid Gegarandeerd",
    
    // Services page specific translations
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
    whatAreasServeAnswer: "We bedienen voornamelijk de regio Flevoland en omliggende gebieden. Neem contact met ons op om te bevestigen of we jouw specifieke locatie bedienen.",
    howQuicklyStart: "Hoe snel kunnen jullie beginnen?",
    howQuicklyStartAnswer: "We kunnen vaak dezelfde dag of de volgende dag accommoderen voor urgente behoeften. Regelmatige planning vereist meestal 24-48 uur kennisgeving.",
    staffInsuredBonded: "Zijn jullie personeel verzekerd en gebonden?",
    staffInsuredBondedAnswer: "Ja, al ons personeel is volledig verzekerd en gebonden. We hebben uitgebreide aansprakelijkheidsdekking voor je gemoedsrust.",
    cleaningProducts: "Welke schoonmaakproducten gebruiken jullie?",
    cleaningProductsAnswer: "We gebruiken milieuvriendelijke, professionele schoonmaakproducten die veilig zijn voor gezinnen, huisdieren en het milieu terwijl ze uitzonderlijke resultaten leveren.",
    provideSupplies: "Leveren jullie benodigdheden en apparatuur?",
    provideSuppliesAnswer: "Ja, we brengen alle benodigde schoonmaakbenodigdheden en apparatuur mee. Je hoeft niets te leveren - we komen volledig voorbereid.",
    satisfactionGuarantee: "Wat is jullie tevredenheidsgarantie?",
    satisfactionGuaranteeAnswer: "We bieden een 100% tevredenheidsgarantie. Als je niet volledig tevreden bent met onze service, komen we terug om het gratis op te lossen.",
    
    // Contact page FAQ translations
    schedulingFlexibility: "Planning Flexibiliteit",
    schedulingFlexibilityAnswer: "Wij bieden flexibele planningsopties om aan uw behoeften te voldoen, inclusief vroege ochtend-, avond- en weekendafspraken.",
    emergencyServices: "Spoeddiensten",
    emergencyServicesAnswer: "Ja, wij bieden spoedschoonmaakdiensten voor urgente situaties. Neem direct contact met ons op voor snelle reactie.",
    qualityGuarantee: "Kwaliteitsgarantie",
    qualityGuaranteeAnswer: "Wij staan achter ons werk met een kwaliteitsgarantie. Als u niet tevreden bent, maken wij het goed.",
    
    // About page specific translations
    readyToWorkTogether: "Klaar om Samen te Werken?",
    letsBuildAmazing: "Laten We Iets Geweldigs Samen Bouwen",
    aboutCtaDescription: "Klaar om het WJ Cleaning Services verschil te ervaren? Neem vandaag contact met ons op voor een gratis consultatie en ontdek hoe we je kunnen helpen je doelen te bereiken.",
    getStartedToday: "Begin Vandaag",
    viewOurServices: "Bekijk Onze Diensten",
    deliveringExcellence: "Uitmuntendheid Leveren in Elke Service",
    customerCentricApproach: "Klantgerichte Aanpak",
    customerCentricDesc: "Wij prioriteren uw tevredenheid met persoonlijke zorg en aandacht voor elk detail van uw project.",
    trustedReliable: "Betrouwbaar & Vertrouwd",
    trustedReliableDesc: "Langdurige relaties opbouwen door consistente, betrouwbare dienstverlening.",
    excellenceInService: "Uitmuntendheid in Service",
    excellenceInServiceDesc: "Wij gaan boven en beyond om verwachtingen te overtreffen en leveren resultaten die voor zich spreken.",
    professionalExcellence: "Professionele Uitmuntendheid",
    qualityServiceGuaranteed: "Gegarandeerde Kwaliteitsservice",
    principlesGuideUs: "De Principes Die Ons Dagelijks Leiden",
    valuesDescription: "Onze kernwaarden vormen elke beslissing die wij nemen en elke service die wij leveren. Zij zijn de basis van ons succes en de reden waarom onze klanten ons vertrouwen.",
    passionForExcellence: "Passie voor Uitmuntendheid",
    passionForExcellenceDesc: "Wij benaderen elke taak met toewijding en aandacht voor detail, waarbij wij uitzonderlijke resultaten garanderen die verwachtingen overtreffen.",
    discoverQuality: "Ontdek de kwaliteit en aandacht voor detail die WJ Cleaning Services onderscheidt van de concurrentie.",
    
    // Values section translations
    trustReliabilityTitle: "Vertrouwen & Betrouwbaarheid",
    timelyServiceTitle: "Tijdelijke Service",
    timelyServiceDesc: "Respect voor uw tijd met stipte aankomsten en efficiënte service die past bij uw schema.",
    qualityAssuranceTitle: "Kwaliteitsgarantie",
    qualityAssuranceDesc: "Het handhaven van de hoogste normen door rigoureuze kwaliteitscontrole en continue verbeteringsprocessen.",
    customerFocusTitle: "Klantgerichtheid",
    customerFocusDesc: "Uw behoeften op de eerste plaats stellen met gepersonaliseerde oplossingen en responsieve ondersteuning die zich aanpast aan uw vereisten.",
    continuousGrowthTitle: "Continue Groei",
    continuousGrowthDesc: "Innovatie en leren omarmen om geavanceerde oplossingen te leveren die evolueren met industriestandaarden.",
    ourWork: "Ons Werk",
    professionalExcellenceInEveryDetail: "Professionele Uitmuntendheid in Elk Detail",
    
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
    selectService: "Selecteer een service",
    serviceType: "Type Service",
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
    warehouseStaffingService: "Magazijn personeel service",
    
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
    footerDescription: "Professionele schoonmaak- en personeelsdiensten gebouwd op vertrouwen, betrouwbaarheid en uitmuntendheid. Gebouwd met toewijding aan uitzonderlijke service.",
    
    // Gallery section translations
    commercialCleaning: "Commerciële Schoonmaak",
    commercialCleaningDesc: "Professionele kantoor- en faciliteitsreiniging",
    reliableWorkforce: "Betrouwbare personeelsoplossingen",
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if we're in the browser and get saved language
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wj-language')
      return (saved === 'nl' || saved === 'en') ? saved as Language : 'en'
    }
    return 'en'
  })

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  // Save language preference to localStorage
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('wj-language', lang)
    }
  }

  // Update HTML lang attribute and meta tags when language changes
  useEffect(() => {
    // Update the html lang attribute when language changes
    document.documentElement.lang = language
    
    // Update meta tags for SEO
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        language === 'nl' 
          ? 'Professionele schoonmaak- en personeelsdiensten gebouwd op vertrouwen, betrouwbaarheid en uitmuntendheid. Gebouwd met toewijding aan uitzonderlijke service.'
          : 'Professional cleaning and staffing services built on trust, reliability, and excellence. Built with dedication to exceptional service.'
      )
    }

    // Update title based on language
    const title = document.querySelector('title')
    if (title) {
      title.textContent = language === 'nl' 
        ? 'WJ Cleaning Services - Professionele Schoonmaak & Personeelsdiensten'
        : 'WJ Cleaning Services - Professional Cleaning & Staffing Services'
    }
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 