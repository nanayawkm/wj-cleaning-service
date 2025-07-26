"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, Sparkles, Globe } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

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
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-wj-dark rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              WJ <span className="text-wj-dark">Cleanforce</span>
            </span>
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
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'NL' : 'EN'}</span>
            </Button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold border-2 border-gray-200 hover:border-wj-dark hover:text-wj-dark rounded-xl bg-transparent"
            >
              <Phone className="mr-2 h-4 w-4" />
              {t('phoneNumber')}
            </Button>
            <Button
              size="sm"
              className="bg-wj-dark hover:bg-wj-darker font-semibold px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              {t('getQuote')}
            </Button>
          </div>

          {/* Mobile Menu remains the same but update the sheet content styling */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-wj-light/20 rounded-xl">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
              <div className="flex flex-col space-y-6 mt-8">
                <Link href="/" className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-wj-dark rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    WJ <span className="text-wj-dark">Cleanforce</span>
                  </span>
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
                    className="w-full justify-start font-semibold border-2 rounded-xl py-6 bg-transparent"
                  >
                    <Globe className="mr-2 h-5 w-5" />
                    {language === 'en' ? 'Nederlands' : 'English'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start font-semibold border-2 rounded-xl py-6 bg-transparent"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    {t('phoneNumber')}
                  </Button>
                  <Button className="w-full bg-wj-dark hover:bg-wj-darker font-semibold rounded-xl py-6">
                    {t('getFreeQuote')}
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
