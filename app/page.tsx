"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  IconArrowRight,
  IconCheck,
  IconUsers,
  IconSparkles,
  IconBuilding,
  IconHome,
  IconBuildingWarehouse,
  IconPhone,
  IconMessage,
  IconStar,
  IconClock,
  IconDroplet,
  IconShield,
  IconBriefcase,
} from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { CleaningBackground } from "@/components/cleaning-background"
import { useLanguage } from "@/contexts/LanguageContext"

export default function HomePage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-white">


      {/* Hero Section */}
      <section className="relative overflow-hidden bg-wj-dark text-white">
        {/* Abstract Decorative Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-wj-light rounded-full blur-3xl opacity-20 transform translate-x-32 -translate-y-32"></div>

        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-medium">Professional Cleaning & Staffing Solutions</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                  {t('heroTitle')}
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed font-light">
                  {t('heroSubtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-wj-dark hover:bg-wj-lighter/20 font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {t('getFreeQuote')}
                  <IconArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-wj-dark bg-transparent font-semibold text-lg px-8 py-4 rounded-xl"
                >
                  {t('hireStaff')}
                  <IconUsers className="ml-2 h-5 w-5" />
                </Button>
              </div>


            </div>

            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-wj-light/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-wj-accent/20 rounded-full blur-xl"></div>
              
              {/* Main logo container */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl"></div>
                
                {/* Logo with enhanced styling */}
                <div className="relative z-10">
                  <img
                    src="/images/logo.png"
                    alt="WJ Cleaning Services"
                    className="w-full h-auto max-w-sm md:max-w-md lg:max-w-lg mx-auto drop-shadow-lg"
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-wj-dark rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-wj-accent rounded-full opacity-40 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -right-2 w-1 h-1 bg-wj-light rounded-full opacity-50 animate-pulse delay-500"></div>
              </div>
              
              {/* Bottom accent line */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-wj-dark to-wj-accent rounded-full"></div>
            </div>
          </div>
        </div>


      </section>

      {/* Services Section - White Background */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle Cleaning Icons Background */}
        <CleaningBackground />
        
        {/* Purple decorative blob */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-wj-lighter/20 text-wj-dark rounded-full mb-6">
              <span className="text-sm font-semibold">{t('ourServices')}</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              {t('servicesTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('servicesSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Modern Service Cards */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
              <CardContent className="p-8 text-center relative flex-1 flex flex-col">
                <div className="absolute top-0 right-0 w-20 h-20 bg-wj-lighter/20 rounded-bl-3xl opacity-50"></div>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl border-2 border-wj-dark">
                  <IconHome className="h-10 w-10 text-wj-dark" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('residentialCleaning')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  {t('residentialDesc')}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-wj-dark font-semibold hover:text-wj-darker transition-colors group-hover:translate-x-1 duration-300 mt-auto"
                >
                  {t('learnMore')}
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
              <CardContent className="p-8 text-center relative flex-1 flex flex-col">
                <div className="absolute top-0 right-0 w-20 h-20 bg-wj-lighter/20 rounded-bl-3xl opacity-50"></div>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl border-2 border-wj-dark">
                  <IconBriefcase className="h-10 w-10 text-wj-dark" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('officeCleaning')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  {t('officeDesc')}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-wj-dark font-semibold hover:text-wj-darker transition-colors group-hover:translate-x-1 duration-300 mt-auto"
                >
                  {t('learnMore')}
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
              <CardContent className="p-8 text-center relative flex-1 flex flex-col">
                <div className="absolute top-0 right-0 w-20 h-20 bg-wj-lighter/20 rounded-bl-3xl opacity-50"></div>
                                                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl border-2 border-wj-dark">
                  <IconBuildingWarehouse className="h-10 w-10 text-wj-dark" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('warehouseStaffing')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  {t('warehouseDesc')}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-wj-dark font-semibold hover:text-wj-darker transition-colors group-hover:translate-x-1 duration-300 mt-auto"
                >
                  {t('learnMore')}
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
              <CardContent className="p-8 text-center relative flex-1 flex flex-col">
                <div className="absolute top-0 right-0 w-20 h-20 bg-wj-lighter/20 rounded-bl-3xl opacity-50"></div>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl border-2 border-wj-dark">
                  <IconUsers className="h-10 w-10 text-wj-dark" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('eventStaffing')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  {t('eventDesc')}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-wj-dark font-semibold hover:text-wj-darker transition-colors group-hover:translate-x-1 duration-300 mt-auto"
                >
                  {t('learnMore')}
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Split-Color About Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Subtle Cleaning Icons Background */}
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            {/* Left side - White background with content */}
            <div className="bg-white p-12 lg:p-16 h-full flex flex-col justify-center">
              <div className="space-y-8">
                              <div className="inline-flex items-center px-4 py-2 bg-wj-accent-light/20 text-wj-accent-dark rounded-full">
                <span className="text-sm font-semibold">About WJ Cleanforce</span>
              </div>

                <div className="space-y-6">
                                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {t('aboutTitle')}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('aboutDesc')}
                </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconShield className="h-6 w-6 text-wj-dark" />
                  </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{t('experienceYears')}</h3>
                      <p className="text-gray-600">Ons team beschikt over meer dan 5 jaar ervaring in de schoonmaaksector.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconClock className="h-6 w-6 text-wj-dark" />
                  </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{t('personalizedSchedules')}</h3>
                      <p className="text-gray-600">Op maat gemaakte schoonmaakschema's die perfect aansluiten bij jouw wensen.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconSparkles className="h-6 w-6 text-wj-dark" />
                  </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{t('extraHygiene')}</h3>
                      <p className="text-gray-600">Extra aandacht aan hygiëne voor een volledig schone en gezonde omgeving.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - WJ Accent background with image and decorative elements */}
            <div className="bg-wj-accent-light/20 p-12 lg:p-16 h-full flex flex-col justify-center relative">
              {/* Decorative sparkles */}
              <div className="absolute top-8 right-8">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-wj-accent rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-wj-accent-light rounded-full animate-pulse delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-wj-accent-dark rounded-full animate-pulse delay-200"></div>
                </div>
              </div>

              {/* Abstract accent blob */}
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-wj-accent/30 rounded-full blur-2xl opacity-50"></div>

              <div className="relative z-10">
                <img
                  src="/images/pexels-tima-miroshnichenko-6197122.jpg"
                  alt="Professional cleaning team William and Jennifer"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />

                {/* Quote badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-wj-accent">
                  <p className="text-sm font-medium text-gray-900 mb-2">"Excellence in Every Detail"</p>
                  <p className="text-xs text-gray-600">- William & Jennifer, Founders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Accent Background */}
      <section className="py-24 bg-wj-accent-light/10 relative overflow-hidden">

        
        {/* Blue decorative blob */}
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-wj-light/30 rounded-full blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-wj-accent-light/20 text-wj-accent-dark rounded-full mb-6">
              <span className="text-sm font-semibold">How It Works</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Simple Process,
              <span className="block text-wj-purple">Outstanding Results</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Getting started with WJ Cleanforce is easy. Our streamlined process ensures you get the service you need
              quickly and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-56 h-48 rounded-2xl shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center mx-auto">
                  <img
                    src="/images/call.jpg"
                    alt="Get your quote - phone consultation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-wj-dark rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Your Quote</h3>
              <p className="text-gray-600 leading-relaxed">
                Contact us for a free consultation. We'll assess your needs and provide a transparent, competitive
                quote.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-64 h-48 rounded-2xl shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center mx-auto">
                  <img
                    src="/images/calendar.jpg"
                    alt="Schedule service - calendar planning"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-wj-dark rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose a time that works for you. We offer flexible scheduling to fit your busy lifestyle and business
                needs.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-64 h-48 rounded-2xl shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center mx-auto">
                  <img
                    src="/images/clean.jpg"
                    alt="Enjoy clean spaces - professional cleaning results"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-wj-dark rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
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

      {/* CTA Section - WJ Accent Background */}
      <section className="py-24 bg-wj-accent text-white relative overflow-hidden">
        {/* Blue decorative blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-wj-light rounded-full blur-3xl opacity-10"></div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm font-medium">Ready to Get Started?</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Experience the WJ Cleanforce
              <span className="block text-wj-light">Difference Today</span>
            </h2>

            <p className="text-xl text-wj-light mb-12 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of satisfied customers who trust us with their cleaning and staffing needs. Get your free
              quote in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <IconPhone className="mr-2 h-5 w-5" />
                Get Free Quote Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-wj-dark bg-transparent font-semibold text-lg px-10 py-4 rounded-xl"
              >
                <IconMessage className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </div>

            <div className="flex justify-center">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-wj-light font-medium">Satisfaction Guaranteed</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
