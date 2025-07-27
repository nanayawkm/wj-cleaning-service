"use client"

import { Button } from "@/components/ui/button"
import { IconPhone, IconMessage, IconMail, IconShieldCheck } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function MobileBottomBar() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      setIsVisible(scrolled > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 shadow-2xl">
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-wj-dark hover:bg-wj-darker text-white font-semibold py-3 px-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open(`tel:${t('phoneNumber')}`)}
          >
            <IconPhone className="h-5 w-5" />
            <span className="ml-1 text-xs hidden sm:inline">{t('callNow')}</span>
          </Button>
          <Button
            className="flex-1 bg-wj-accent hover:bg-wj-accent-dark text-white font-semibold py-3 px-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open(`https://wa.me/${t('phoneNumber').replace(/\D/g, '')}`)}
          >
            <IconMessage className="h-5 w-5" />
            <span className="ml-1 text-xs hidden sm:inline">WhatsApp</span>
          </Button>
          <Button
            className="flex-1 bg-wj-accent hover:bg-wj-accent-dark text-white font-semibold py-3 px-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open(`mailto:${t('email')}`)}
          >
            <IconMail className="h-5 w-5" />
            <span className="ml-1 text-xs hidden sm:inline">{t('email')}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
