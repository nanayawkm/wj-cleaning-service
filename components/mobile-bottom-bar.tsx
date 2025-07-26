"use client"

import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Mail } from "lucide-react"
import { useState, useEffect } from "react"

export default function MobileBottomBar() {
  const [isVisible, setIsVisible] = useState(false)

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
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-2xl">
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-wj-dark hover:bg-wj-darker text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open("tel:+15551234567")}
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Now
          </Button>
          <Button
            className="flex-1 bg-wj-accent hover:bg-wj-accent-dark text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open("https://wa.me/15551234567")}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp
          </Button>
          <Button
            className="flex-1 bg-wj-accent hover:bg-wj-accent-dark text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open("mailto:info@wjcleanforce.com")}
          >
            <Mail className="mr-2 h-5 w-5" />
            Email
          </Button>
        </div>
      </div>
    </div>
  )
}
