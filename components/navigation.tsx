"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CaretDown, Globe, List, Phone, Sparkle, Users } from "@phosphor-icons/react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { CONTACT_DETAILS } from "./constant"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const { language, setLanguage, t } = useLanguage()
  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'nl' : 'en')
  }

  // The dashboard is a tool, not a page of the marketing site. Rendering the
  // public nav above it put "Book Now" and the services menu on top of
  // Jackie's admin, which is both confusing and a way to lose her session by
  // wandering off into the public site.
  //
  // This must sit below every hook: returning earlier changes the hook count
  // between routes, and React throws "rendered fewer hooks than expected" the
  // moment anyone navigates client-side from a public page into the dashboard.
  if (pathname?.startsWith("/residents")) return null

  const navItems: {
    href: string
    label: string
    children?: { href: string; label: string; hint: string; Icon: typeof Sparkle }[]
  }[] = [
    { href: "/", label: t('home') },
    { href: "/about", label: t('about') },
    {
      href: "/services",
      label: t('services'),
      // The two halves want different things from a visitor, so they are
      // reachable directly rather than buried in one combined page.
      children: [
        {
          href: "/services/cleaning",
          label: t('cleaningServicesNav'),
          hint: t('homeCleaningLead'),
          Icon: Sparkle,
        },
        {
          href: "/services/staffing",
          label: t('staffingServicesNav'),
          hint: t('supportStaffDesc'),
          Icon: Users,
        },
      ],
    },
    { href: "/contact", label: t('contact') },
  ]

  const isStaffingContext = pathname?.startsWith("/services/staffing") ?? false

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-24 h-12 sm:w-32 sm:h-16">
              <Image
                src="/images/logo1.png"
                alt={t('wjCleaningServices')}
                width={256}
                height={128}
                quality={90}
                priority
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) =>
              item.children ? (
                /*
                  Opens on hover and on focus, and the trigger is itself a link —
                  so the menu is reachable by keyboard and still works on touch,
                  where hover never fires.
                */
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-wj-dark ${
                      isActive(item.href) ? "text-wj-dark" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                    <CaretDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                    {isActive(item.href) && (
                      <span className="absolute -bottom-1 left-0 right-4 h-0.5 rounded-full bg-wj-dark" />
                    )}
                  </Link>

                  <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="overflow-hidden rounded-xl border border-wj-cream-deep bg-white shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-wj-cream"
                        >
                          <child.Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-wj-dark" />
                          <span>
                            <span className="block text-sm font-semibold text-gray-900">
                              {child.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-gray-500">
                              {child.hint}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition-all duration-300 hover:text-wj-dark relative ${
                    isActive(item.href) ? "text-wj-dark" : "text-gray-700"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-wj-dark rounded-full"></div>
                  )}
                </Link>
              ),
            )}
          </nav>

          {/* Language Toggle */}
          <div className="hidden md:flex items-center mr-3 lg:mr-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="flex items-center space-x-1 text-gray-700 hover:text-wj-dark"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'NL' : 'EN'}</span>
            </Button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold border-2 border-gray-200 hover:border-wj-dark hover:text-wj-dark rounded-lg bg-transparent text-xs lg:text-sm"
              asChild
            >
              <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>
                <Phone className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden lg:inline">{CONTACT_DETAILS.phone}</span>
                <span className="lg:hidden">{t('callNow')}</span>
              </a>
            </Button>
            {/*
              Context-aware: on the staffing pages "Book Now" would drop an
              enquirer into the cleaning booking flow, which prices by m² and
              cannot quote a warehouse shift. There it becomes a contact CTA.
            */}
            <Button size="sm" className="font-semibold" asChild>
              <Link href={isStaffingContext ? "/contact" : "/book"}>
                {isStaffingContext ? t('talkToUs') : t('getQuote')}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu remains the same but update the sheet content styling */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-lg">
                <List className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white">
              <div className="flex flex-col space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                <Link href="/" className="flex items-center mb-6 sm:mb-8">
                  <div className="w-28 h-14 sm:w-32 sm:h-16">
                    <Image
                      src="/images/logo1.png"
                      alt={t('wjCleaningServices')}
                      width={128}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>

                {navItems.flatMap((item) =>
                  item.children ? [item, ...item.children] : [item],
                ).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base sm:text-lg font-semibold transition-all duration-300 hover:text-wj-dark py-3 px-4 rounded-lg ${
                      isActive(item.href)
                        ? "text-wj-dark bg-wj-lighter/20 border-l-4 border-wj-dark"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-6 sm:pt-8 space-y-3 sm:space-y-4">
                  {/* Mobile Language Toggle */}
                  <Button
                    variant="outline"
                    onClick={handleLanguageToggle}
                    className="w-full justify-start font-semibold rounded-lg py-4"
                  >
                    <Globe className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {language === 'en' ? 'Nederlands' : 'English'}
                  </Button>

                  {/* Mobile Phone Button */}
                  <Button
                    variant="outline"
                    className="w-full justify-start font-semibold rounded-lg py-4"
                    asChild
                  >
                    <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>
                      <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      {CONTACT_DETAILS.phone}
                    </a>
                  </Button>

                  {/* Mobile CTA Button */}
                  <Button 
                    size="lg" className="w-full"
                    asChild
                  >
                    <Link
                      href={isStaffingContext ? "/contact" : "/book"}
                      onClick={() => setIsOpen(false)}
                    >
                      {isStaffingContext ? t('talkToUs') : t('getFreeQuote')}
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
