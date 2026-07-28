"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, WhatsappLogo } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { CONTACT_DETAILS } from "@/components/constant"

const telHref = `tel:${CONTACT_DETAILS.phoneTel}`
const whatsappHref = `https://wa.me/${CONTACT_DETAILS.phoneWa}`

export default function MobileBottomBar() {
  const { t } = useLanguage()
  const pathname = usePathname()

  // Hidden inside the booking flow: "Book Now" is meaningless once you are
  // booking, and this bar sat on top of the running total, which is the one
  // piece of UI that has to stay visible there.
  if (pathname?.startsWith("/book")) return null

  // Nor on the dashboard — a customer-facing "Book Now" bar sat over Jackie's
  // own tools, covering the bottom of every table on a phone.
  if (pathname?.startsWith("/admin")) return null

  /*
    Context-aware, matching the header. Staffing cannot be priced from a form —
    m² tells you nothing about a warehouse shift — so there the primary action
    is a conversation. Everywhere else it is the booking flow.

    This button previously pointed at /contact on every page while reading
    "Book Now", which sent the whole of mobile past the booking flow entirely.
  */
  const isStaffing = pathname?.startsWith("/services/staffing") ?? false
  const primaryHref = isStaffing ? "/contact" : "/book"
  const primaryLabel = isStaffing ? t("talkToUs") : t("getFreeQuote")

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        {/* Primary action takes the majority of the bar */}
        {/*
          min-w-0 + px-4: `size="lg"` carries px-8, and combined with the base
          `whitespace-nowrap` the label could not shrink, so at 320px this
          button pushed past the viewport edge.
        */}
        <Button asChild size="lg" className="min-w-0 flex-1 px-4">
          <Link href={primaryHref}>
            <span className="truncate">{primaryLabel}</span>
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          size="icon"
          className="h-12 w-12 flex-shrink-0 border-gray-300"
        >
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={t('whatsapp')}>
            <WhatsappLogo className="h-5 w-5 text-green-600" />
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          size="icon"
          className="h-12 w-12 flex-shrink-0 border-gray-300"
        >
          <a href={telHref} aria-label={t('callNow')}>
            <Phone className="h-5 w-5 text-wj-dark" />
          </a>
        </Button>
      </div>
    </div>
  )
}
