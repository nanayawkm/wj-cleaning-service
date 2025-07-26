"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              WJ <span className="text-blue-600">Cleanforce</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition-all duration-300 hover:text-blue-600 relative ${
                  isActive(item.href) ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 rounded-xl bg-transparent"
            >
              <Phone className="mr-2 h-4 w-4" />
              (555) 123-4567
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 font-semibold px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu remains the same but update the sheet content styling */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50 rounded-xl">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
              <div className="flex flex-col space-y-6 mt-8">
                <Link href="/" className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    WJ <span className="text-blue-600">Cleanforce</span>
                  </span>
                </Link>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-semibold transition-all duration-300 hover:text-blue-600 py-3 px-4 rounded-xl ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-8 space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start font-semibold border-2 rounded-xl py-6 bg-transparent"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    (555) 123-4567
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl py-6">
                    Get Free Quote
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
