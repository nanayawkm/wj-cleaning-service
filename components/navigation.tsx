"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CaretDown, Globe, List, Phone, Sparkle, Users } from "@phosphor-icons/react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { CONTACT_DETAILS } from "./constant"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const { language, setLanguage, t } = useLanguage()
  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'nl' : 'en')
  }

  /*
    Glass over the hero, solid once you scroll past it.

    Every public page opens on a dark section — an image behind a scrim, or
    flat wj-dark — so white nav text is safe at the top of all of them. The two
    exceptions are the booking confirmation and manage pages, which sit on
    white; those get the solid treatment from the first pixel.
  */
  const hasDarkHero = !pathname?.startsWith("/booking/")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll() // a refresh can restore mid-page; don't assume we start at 0
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Opening the mobile sheet solidifies the bar too, so the panel does not
  // appear to hang off a transparent strip.
  const onGlass = hasDarkHero && !scrolled && !isOpen

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
    /*
      Fixed rather than sticky, so the hero image runs underneath it — that is
      what makes the glass read as glass. Each page's first section carries
      matching top padding so nothing hides behind the bar.

      The tint is backdrop-brightness rather than a fixed dark overlay. A
      fixed overlay has to be dark enough for the brightest hero on the site,
      which then buries every darker one. Brightness scales whatever is
      actually behind it, so the bright window in the homepage photo and the
      flat wj-dark on /about both land in a readable range.
    */
    <header
      className={`fixed top-0 z-50 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        onGlass
          ? "border-b border-white/20 bg-black/30 backdrop-blur-lg backdrop-brightness-[0.55] backdrop-saturate-150"
          : "border-b border-gray-200/80 bg-white/85 shadow-[0_1px_3px_rgba(16,24,40,0.06)] backdrop-blur-xl backdrop-saturate-150"
      }`}
    >
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
                className={`h-full w-full object-contain transition-[filter] duration-300 ${
                  onGlass ? "brightness-0 invert" : ""
                }`}
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
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                      onGlass
                        ? "text-white/90 hover:text-white"
                        : isActive(item.href)
                          ? "text-wj-dark"
                          : "text-gray-700 hover:text-wj-dark"
                    }`}
                  >
                    {item.label}
                    <CaretDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                    {isActive(item.href) && (
                      <span className={`absolute -bottom-1 left-0 right-4 h-0.5 ${onGlass ? "bg-white" : "bg-wj-dark"}`} />
                    )}
                  </Link>

                  <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="overflow-hidden border border-gray-200 bg-white shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
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
                  className={`relative text-sm font-semibold transition-colors ${
                    onGlass
                      ? "text-white/90 hover:text-white"
                      : isActive(item.href)
                        ? "text-wj-dark"
                        : "text-gray-700 hover:text-wj-dark"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className={`absolute -bottom-1 left-0 right-0 h-0.5 ${onGlass ? "bg-white" : "bg-wj-dark"}`} />
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
              className={`flex items-center space-x-1 ${onGlass ? "text-white/90 hover:bg-white/10 hover:text-white" : "text-gray-700 hover:text-wj-dark"}`}
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
              className={`rounded-lg border-2 bg-transparent text-xs font-semibold lg:text-sm ${onGlass ? "border-white/35 text-white hover:border-white hover:bg-white/10 hover:text-white" : "border-gray-200 hover:border-wj-dark hover:text-wj-dark"}`}
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
              <Button variant="ghost" size="icon" className={`rounded-lg md:hidden ${onGlass ? "text-white hover:bg-white/10 hover:text-white" : ""}`}>
                <List className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            {/*
              Same language as the rest of the site: square, hairline rules, one
              accent for the current page. Previously this was rounded pills at
              space-y-6, with Cleaning and Staffing flattened to the same level
              as everything else — six equal items and no sense that two of them
              belong under Services.
            */}
            <SheetContent
              side="right"
              className="flex w-[300px] flex-col gap-0 border-l border-gray-200 bg-white p-0 sm:w-[340px]"
            >
              {/*
                Radix requires a title on a dialog, and it is right to: without
                one a screen reader announces an unnamed dialog and the user has
                no idea what just opened. Visually hidden because the logo below
                already names it for sighted users.
              */}
              <SheetTitle className="sr-only">{t('wjCleaningServices')}</SheetTitle>
              <SheetDescription className="sr-only">
                {language === 'nl' ? 'Hoofdmenu' : 'Main menu'}
              </SheetDescription>

              <div className="border-b border-gray-200 px-5 py-4">
                <Link href="/" onClick={() => setIsOpen(false)} className="inline-block">
                  <Image
                    src="/images/logo1.png"
                    alt={t('wjCleaningServices')}
                    width={96}
                    height={96}
                    className="h-12 w-12 object-contain"
                  />
                </Link>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto py-2">
                {navItems.map((item) => (
                  <div key={item.href}>
                    <SheetLink
                      href={item.href}
                      label={item.label}
                      /* A parent lights up only on its own page. With
                         startsWith, /services/cleaning highlighted both
                         "Services" and "Cleaning" at once. */
                      active={item.children ? pathname === item.href : isActive(item.href)}
                      onNavigate={() => setIsOpen(false)}
                    />
                    {item.children && (
                      /* Indented and rule-marked, so the hierarchy is visible
                         rather than implied by ordering alone. */
                      <div className="ml-5 border-l border-gray-200">
                        {item.children.map((child) => (
                          <SheetLink
                            key={child.href}
                            href={child.href}
                            label={child.label}
                            active={isActive(child.href)}
                            nested
                            onNavigate={() => setIsOpen(false)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleLanguageToggle}
                  className="flex h-14 w-full items-center gap-3 px-5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Globe className="h-4 w-4 text-gray-400" />
                  {language === 'en' ? 'Nederlands' : 'English'}
                </button>

                <a
                  href={`tel:${CONTACT_DETAILS.phoneTel}`}
                  className="flex h-14 w-full items-center gap-3 border-t border-gray-100 px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 text-gray-400" />
                  {CONTACT_DETAILS.phone}
                </a>

                <div className="p-4">
                  <Link
                    href={isStaffingContext ? "/contact" : "/book"}
                    onClick={() => setIsOpen(false)}
                    className="flex h-12 w-full items-center justify-center bg-wj-dark text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
                  >
                    {isStaffingContext ? t('talkToUs') : t('getFreeQuote')}
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

/**
 * One row of the mobile menu. 56px tall so it clears the 44px touch target
 * with room to spare, and the active marker is a 2px rule rather than a filled
 * pill — the same treatment the dashboard uses for its current page.
 */
function SheetLink({
  href,
  label,
  active,
  nested,
  onNavigate,
}: {
  href: string
  label: string
  active: boolean
  nested?: boolean
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`relative flex h-14 items-center transition-colors ${
        nested ? "pl-5 pr-5 text-[0.9375rem]" : "px-5 text-base"
      } ${
        active
          ? "bg-wj-dark/[0.06] font-semibold text-wj-dark"
          : "font-medium text-gray-700 hover:bg-gray-50"
      }`}
    >
      {active && <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-wj-dark" />}
      {label}
    </Link>
  )
}
