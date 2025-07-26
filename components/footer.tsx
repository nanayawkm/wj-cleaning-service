import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Enhanced Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-wj-dark to-wj-accent rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">WJ Cleanforce</span>
            </Link>
            <p className="text-gray-300 leading-relaxed text-lg">
              Professional cleaning and staffing services built on trust, reliability, and excellence. Founded by
              William and Jennifer with love and dedication to exceptional service.
            </p>
            <div className="flex space-x-4">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-wj-dark rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-wj-dark rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-wj-dark rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-wj-dark rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">Quick Links</h3>
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                About Us
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                Our Services
              </Link>
              <Link
                href="/contact"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">Services</h3>
            <div className="space-y-4">
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                Residential Cleaning
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                Office Cleaning
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                Warehouse Staffing
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                Event Staffing
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">Stay Connected</h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-wj-dark to-wj-darker rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 text-lg">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-wj-accent to-wj-accent-dark rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 text-lg">info@wjcleanforce.com</span>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-wj-accent to-wj-accent-dark rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 text-lg">Greater Metro Area</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white text-lg">Newsletter</h4>
              <div className="flex space-x-3">
                <Input
                  placeholder="Your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-xl flex-1"
                />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 relative">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 text-lg">© {new Date().getFullYear()} WJ Cleanforce. Made with</p>
              <Heart className="h-4 w-4 text-red-500" />
              <p className="text-gray-400 text-lg">by William & Jennifer</p>
            </div>
            <div className="flex space-x-8 text-lg">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
