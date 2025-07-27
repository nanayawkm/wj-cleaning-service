"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

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
    heroSubtitle: "WJ Cleanforce delivers exceptional cleaning services and professional staffing solutions. From residential homes to corporate offices, we ensure spotless results and dependable workforce.",
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
    whyChooseWJ: "Why Choose WJ Cleanforce",
    qualityAssured: "Quality Assured",
    qualityAssuredDesc: "Every service is backed by our quality guarantee and attention to detail.",
    fullyInsured: "Fully Insured",
    fullyInsuredDesc: "Complete coverage for your peace of mind and protection.",
    support247: "24/7 Support",
    support247Desc: "Round-the-clock availability for emergencies and urgent needs.",
    readyToExperience: "Ready to Experience the Difference?",
    readyToExperienceDesc: "Get your free quote today and discover why hundreds of customers trust WJ Cleanforce for their cleaning and staffing needs.",
    callNow: "Call Now",
    
    // About Page - Updated with meaningful content
    aboutUs: "Who We Are",
    aboutHeroTitle: "Committed to Clean Spaces, Driven by Excellence",
    aboutHeroSubtitle: "Meet Winfred and Jackie, the dedicated couple behind WJ Cleanforce. We've built our reputation on trust, reliability, and exceptional service that transforms spaces and exceeds expectations.",
    ourStory: "Our Journey",
    ourStoryDesc: "Founded by Winfred and Jackie, a dedicated couple who understood the importance of trust, reliability, and attention to detail. What started as a small family business has grown into a trusted partner for hundreds of satisfied customers.",
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
    phoneNumber: "+31 (0) 685063641",
    contactEmail: "info@wjcleaningservices.nl",
    region: "Flevoland Region",
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
    heroSubtitle: "WJ Cleanforce levert uitzonderlijke schoonmaakdiensten en professionele personeelsoplossingen. Van particuliere woningen tot kantoren, wij zorgen voor vlekkeloze resultaten.",
    getFreeQuote: "Gratis Offerte",
    hireStaff: "Personeel Inhuren",
    
    // Services Section
    ourServices: "Onze Diensten", 
    servicesTitle: "Complete Schoonmaak & Personeelsoplossingen",
    servicesSubtitle: "Van sprankelende schone ruimtes tot betrouwbare personeelsoplossingen, wij leveren uitmuntendheid in elke service met ongeëvenaarde kwaliteit.",
    
    // Service Cards
    residentialCleaning: "Particuliere Reiniging",
    residentialDesc: "Transformeer uw huis tot een pristine heiligdom met onze uitgebreide particuliere schoonmaakdiensten.",
    
    officeCleaning: "Kantoor Reiniging",
    officeDesc: "Onderhoud een perfecte werkomgeving met onze uitgebreide commerciële schoonmaakoplossingen voor kantoren.",
    
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
    whyChooseWJ: "Waarom Kiezen voor WJ Cleanforce",
    qualityAssured: "Gegarandeerde Kwaliteit",
    qualityAssuredDesc: "Elke service wordt ondersteund door onze kwaliteitsgarantie en aandacht voor detail.",
    fullyInsured: "Volledig Verzekerd",
    fullyInsuredDesc: "Volledige dekking voor uw gemoedsrust en bescherming.",
    support247: "24/7 Ondersteuning",
    support247Desc: "Rond-de-klok beschikbaarheid voor noodgevallen en urgente behoeften.",
    readyToExperience: "Klaar om het Verschil te Ervaren?",
    readyToExperienceDesc: "Krijg vandaag nog uw gratis offerte en ontdek waarom honderden klanten WJ Cleanforce vertrouwen voor hun schoonmaak- en personeelsbehoeften.",
    callNow: "Nu Bellen",
    
    // About Page
    aboutUs: "Over Ons",
    aboutHeroTitle: "Gebouwd op Vertrouwen, Geleverd met Uitmuntendheid",
    aboutHeroSubtitle: "Ontdek het verhaal achter WJ Cleanforce en ontmoet het toegewijde echtpaar dat dit betrouwbare schoonmaak- en personeelsdienstverlening heeft opgebouwd.",
    ourStory: "Onze Geschiedenis",
    ourStoryDesc: "Opgericht door Winfred en Jackie, een toegewijd echtpaar dat het belang van vertrouwen, betrouwbaarheid en aandacht voor detail begreep. Wat begon als een klein familiebedrijf is uitgegroeid tot een vertrouwde partner.",
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
    contactHeroTitle: "Raak Ons Op",
    contactHeroSubtitle: "Klaar om het verschil te ervaren? Neem vandaag contact met ons op voor een gratis offerte of bespreek uw schoonmaak- en personeelsbehoeften.",
    getInTouch: "Raak Ons Op",
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
    phoneNumber: "+31 (0) 685063641", 
    contactEmail: "info@wjcleaningservices.nl",
    region: "Regio Flevoland",
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('nl') // Default to Dutch

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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