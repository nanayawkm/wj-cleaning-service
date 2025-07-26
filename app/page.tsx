import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  CheckCircle,
  Users,
  Sparkles,
  Building,
  Home,
  Warehouse,
  Phone,
  MessageCircle,
  Star,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-600 text-white">
        {/* Abstract Decorative Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 transform translate-x-32 -translate-y-32"></div>

        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Professional Cleaning & Staffing Solutions</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                  Clean Spaces,
                  <span className="block text-blue-200">Reliable Staff</span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed font-light">
                  WJ Cleanforce delivers exceptional cleaning services and professional staffing solutions. From
                  residential homes to corporate offices, we ensure spotless results and dependable workforce.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold text-lg px-8 py-4 rounded-xl"
                >
                  Hire Staff Today
                  <Users className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-blue-200">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-blue-200">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-blue-200">Guaranteed</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Image
                  src="/placeholder.svg?height=500&width=600&text=Professional+Cleaning+Team"
                  alt="Professional cleaning team"
                  width={600}
                  height={500}
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Smooth Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" fill="none" className="w-full h-16 text-white">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Services Section - White Background */}
      <section className="py-24 bg-white relative">
        {/* Purple decorative blob */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full mb-6">
              <span className="text-sm font-semibold">Our Services</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Complete Cleaning &<span className="block text-blue-600">Staffing Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From sparkling clean spaces to reliable workforce solutions, we deliver excellence in every service with
              unmatched quality and professionalism.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Modern Service Cards */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Residential Cleaning</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Transform your home into a pristine sanctuary with our comprehensive residential cleaning services.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Office Cleaning</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Maintain a pristine work environment with our comprehensive commercial cleaning solutions.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Warehouse className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Warehouse Staffing</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Reliable warehouse personnel to keep your operations running smoothly and efficiently.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Event Staffing</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Professional event staff to ensure your special occasions run flawlessly from start to finish.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Split-Color About Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            {/* Left side - White background with content */}
            <div className="bg-white p-12 lg:p-16 h-full flex flex-col justify-center">
              <div className="space-y-8">
                <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-600 rounded-full">
                  <span className="text-sm font-semibold">About WJ Cleanforce</span>
                </div>

                <div className="space-y-6">
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Built on Trust,
                    <span className="block text-purple-600">Delivered with Excellence</span>
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Founded by William and Jennifer, a dedicated couple who understood the importance of trust,
                    reliability, and attention to detail. What started as a small family business has grown into a
                    trusted partner for hundreds of satisfied customers.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Trust</h3>
                      <p className="text-gray-600">Built on honest relationships and transparent communication.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Quality</h3>
                      <p className="text-gray-600">Meticulous attention to detail in every service we provide.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Reliability</h3>
                      <p className="text-gray-600">Consistent, dependable service you can count on every time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Purple background with image and decorative elements */}
            <div className="bg-purple-100 p-12 lg:p-16 h-full flex flex-col justify-center relative">
              {/* Decorative sparkles */}
              <div className="absolute top-8 right-8">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>

              {/* Abstract purple blob */}
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-50"></div>

              <div className="relative z-10">
                <Image
                  src="/placeholder.svg?height=500&width=600&text=William+and+Jennifer+Cleaning+Team"
                  alt="Professional cleaning team William and Jennifer"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />

                {/* Quote badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-purple-600">
                  <p className="text-sm font-medium text-gray-900 mb-2">"Excellence in Every Detail"</p>
                  <p className="text-xs text-gray-600">- William & Jennifer, Founders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Purple Background */}
      <section className="py-24 bg-purple-50 relative overflow-hidden">
        {/* Blue decorative blob */}
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-full mb-6">
              <span className="text-sm font-semibold">How It Works</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Simple Process,
              <span className="block text-purple-600">Outstanding Results</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Getting started with WJ Cleanforce is easy. Our streamlined process ensures you get the service you need
              quickly and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Your Quote</h3>
              <p className="text-gray-600 leading-relaxed">
                Contact us for a free consultation. We'll assess your needs and provide a transparent, competitive
                quote.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose a time that works for you. We offer flexible scheduling to fit your busy lifestyle and business
                needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enjoy Clean Spaces</h3>
              <p className="text-gray-600 leading-relaxed">
                Sit back and relax while our professional team delivers exceptional results that exceed your
                expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Blue Background */}
      <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
        {/* Purple decorative blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10"></div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm font-medium">Ready to Get Started?</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Experience the WJ Cleanforce
              <span className="block text-blue-200">Difference Today</span>
            </h2>

            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of satisfied customers who trust us with their cleaning and staffing needs. Get your free
              quote in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Phone className="mr-2 h-5 w-5" />
                Get Free Quote Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold text-lg px-10 py-4 rounded-xl"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-200 font-medium">Happy Customers</div>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-200 font-medium">Support Available</div>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-blue-200 font-medium">Satisfaction Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
