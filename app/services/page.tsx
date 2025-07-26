import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home, Building, Warehouse, Users, Sparkles, Clock, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">Our Services</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Comprehensive Cleaning & Staffing Solutions</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              From residential cleaning to professional staffing, we deliver excellence across all our service offerings
              with unmatched quality and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Cleaning Services Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-600 mb-4">Cleaning Services</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Spotless Results, Every Time</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional cleaning services that transform your spaces and exceed your expectations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Residential Cleaning */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Residential cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Residential Cleaning</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Transform your home into a pristine sanctuary with our comprehensive residential cleaning services. We
                  handle everything from regular maintenance to deep cleaning sessions.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Regular weekly, bi-weekly, or monthly cleaning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Deep cleaning and move-in/move-out services</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Kitchen and bathroom sanitization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Eco-friendly cleaning products available</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Home Cleaning Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Office Cleaning */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Office cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Office Cleaning</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Maintain a professional, healthy work environment with our comprehensive commercial cleaning services.
                  Perfect for offices, retail spaces, and corporate facilities.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Daily, weekly, or custom cleaning schedules</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Restroom sanitization and restocking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Floor care and carpet cleaning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Window cleaning and dusting services</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Get Office Cleaning Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Staffing Services Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-600 mb-4">Staffing Services</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Reliable Workforce Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional staffing services to keep your operations running smoothly with qualified, dependable
              personnel.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Warehouse Staffing */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Warehouse staffing"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <Warehouse className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Warehouse Staffing</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Keep your warehouse operations running efficiently with our skilled, reliable warehouse personnel.
                  From inventory management to logistics support, we've got you covered.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Inventory management specialists</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Forklift certified operators</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Packing and shipping personnel</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Flexible scheduling options</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Hire Warehouse Staff
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Event Staffing */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Event staffing"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Event Staffing</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Make your events memorable with our professional event staff. From corporate functions to special
                  celebrations, we provide trained personnel to ensure everything runs smoothly.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Professional event coordinators</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Hospitality and service staff</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Setup and breakdown crews</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Last-minute availability</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Book Event Staff
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-600 mb-4">Service Excellence</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose WJ Cleanforce Services?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600">
                100% satisfaction guarantee on all our services with quality control checks.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fully Insured</h3>
              <p className="text-gray-600">Complete insurance coverage and bonded staff for your peace of mind.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600">Work around your schedule with flexible timing and emergency services.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trained Professionals</h3>
              <p className="text-gray-600">All staff are thoroughly vetted, trained, and committed to excellence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Experience Professional Service?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and discover how WJ Cleanforce can transform your space or support
            your staffing needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
              <Link href="/contact">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Call Now: (555) 123-4567
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
