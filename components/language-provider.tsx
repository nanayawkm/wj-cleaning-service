"use client"

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

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

  return <>{children}</>
} 