"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { IconMenu, IconPhone, IconSparkles, IconWorld, IconDroplet, IconShieldCheck } from "@tabler/icons-react"
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
  const [_, setForceUpdate] = useState(0)
  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'nl' : 'en')
    setForceUpdate(f => f + 1)
  }

  const navItems = [
    { href: "/", label: t('home') },
    { href: "/about", label: t('about') },
    { href: "/services", label: t('services') },
    { href: "/contact", label: t('contact') },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-32 h-16 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/images/logo.png"
                alt="WJ Cleaning Services"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
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
            ))}
          </nav>

          {/* Language Toggle */}
          <div className="hidden md:flex items-center mr-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="flex items-center space-x-1 text-gray-700 hover:text-wj-dark"
            >
              <IconWorld className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'NL' : 'EN'}</span>
            </Button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold border-2 border-gray-200 hover:border-wj-dark hover:text-wj-dark rounded-xl bg-transparent"
              asChild
            >
              <a href={`tel:${CONTACT_DETAILS.phone}`}>
                <IconPhone className="mr-2 h-4 w-4" />
                {CONTACT_DETAILS.phone}
              </a>
            </Button>
            <Button
              size="sm"
              className="bg-wj-dark hover:bg-wj-darker font-semibold px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              asChild
            >
              <Link href="/contact">
                {t('getQuote')}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu remains the same but update the sheet content styling */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-wj-light/20 rounded-xl">
                <IconMenu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
              <div className="flex flex-col space-y-6 mt-8">
                <Link href="/" className="flex items-center mb-8">
                  <div className="w-32 h-16">
                    <img
                      src="/images/logo.png"
                      alt="WJ Cleaning Services"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-semibold transition-all duration-300 hover:text-wj-dark py-3 px-4 rounded-xl ${
                      isActive(item.href)
                        ? "text-wj-dark bg-wj-lighter/20 border-l-4 border-wj-dark"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-8 space-y-4">
                  {/* Mobile Language Toggle */}
                  <Button
                    variant="outline"
                    onClick={handleLanguageToggle}
                    className="w-full justify-start font-semibold border-2 border-gray-200 hover:border-wj-dark hover:text-wj-dark rounded-xl py-6 bg-transparent transition-all duration-300 hover:bg-gray-50"
                  >
                    <IconWorld className="mr-2 h-5 w-5" />
                    {language === 'en' ? 'Nederlands' : 'English'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start font-semibold border-2 border-gray-200 hover:border-wj-accent hover:text-wj-accent rounded-xl py-6 bg-transparent transition-all duration-300 hover:bg-gray-50"
                    asChild
                  >
                    <a href={`tel:${CONTACT_DETAILS.phone}`}>
                      <IconPhone className="mr-2 h-5 w-5" />
                      {CONTACT_DETAILS.phone}
                    </a>
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark font-semibold rounded-xl py-6 shadow-md hover:shadow-lg transition-all duration-300"
                    asChild
                  >
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      {t('getFreeQuote')}
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
