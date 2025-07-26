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
    
    // About Section  
    aboutTitle: "Built on Trust, Delivered with Excellence",
    aboutDesc: "Founded by William and Jennifer, a dedicated couple who understood the importance of trust, reliability, and attention to detail. What started as a small family business has grown into a trusted partner for hundreds of satisfied customers.",
    
    // Company Info (Real WJ Cleaning Services info)
    experienceYears: "5+ Years Experience",
    personalizedSchedules: "Personalized Schedules", 
    extraHygiene: "Extra Hygiene",
    
    // Contact
    phoneNumber: "+31 (0) 685063641",
    email: "info@wjcleaningservices.nl",
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
    
    // About Section
    aboutTitle: "Gebouwd op Vertrouwen, Geleverd met Uitmuntendheid", 
    aboutDesc: "Opgericht door William en Jennifer, een toegewijd echtpaar dat het belang van vertrouwen, betrouwbaarheid en aandacht voor detail begreep. Wat begon als een klein familiebedrijf is uitgegroeid tot een vertrouwde partner.",
    
    // Company Info (Real WJ Cleaning Services info)
    experienceYears: "5+ Jaar Ervaring",
    personalizedSchedules: "Gepersonaliseerde Schema's",
    extraHygiene: "Extra Hygiëne",
    
    // Contact
    phoneNumber: "+31 (0) 685063641", 
    email: "info@wjcleaningservices.nl",
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