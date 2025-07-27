"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconUsers, IconShield, IconClock, IconMapPin, IconStar, IconAward, IconHeart, IconDroplet, IconSparkles, IconCheck, IconBuilding, IconHome, IconBriefcase, IconBuildingWarehouse } from '@tabler/icons-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'
import { CleaningBackground } from '@/components/cleaning-background'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen">
      <CleaningBackground />
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-r from-wj-dark to-wj-accent text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4 sm:mb-6">{t('aboutUs')}</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              {t('aboutHeroTitle')}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-wj-light leading-relaxed font-light max-w-3xl mx-auto px-4">
              {t('aboutHeroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <Badge className="bg-wj-light/20 text-wj-dark mb-3 sm:mb-4">Our Story</Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Built on Trust, Driven by Excellence
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Founded by Winfred and Jackie, a dedicated couple who understood the importance of trust, reliability, and
                  attention to detail. What started as a small family business has grown into a trusted partner for hundreds
                  of satisfied customers.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconHeart className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Family-Owned Business</h3>
                    <p className="text-sm sm:text-base text-gray-600">We treat every client like family, ensuring personalized care and attention to every detail.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconShield className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Trusted & Reliable</h3>
                    <p className="text-sm sm:text-base text-gray-600">Our reputation is built on consistent quality, reliability, and exceptional customer service.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconStar className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Excellence in Service</h3>
                    <p className="text-sm sm:text-base text-gray-600">We go above and beyond to exceed expectations, delivering results that speak for themselves.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/pexels-tima-miroshnichenko-6197122.jpg"
                  alt="Winfred and Jackie - Founders of WJ Cleanforce"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">Winfred & Jackie</p>
                  <p className="text-xs text-gray-600">Founders, WJ Cleanforce</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-wj-accent-light/10 relative overflow-hidden">
        <CleaningBackground />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-wj-light/30 rounded-full blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-wj-accent-light/20 text-wj-accent-dark rounded-full mb-6">
              <span className="text-sm font-semibold">Our Values</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Principles That
              <span className="block text-wj-accent-dark">Guide Us Daily</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our core values shape every decision we make and every service we provide. They're the foundation of our
              success and the reason our customers trust us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-dark">
                    <IconHeart className="h-5 w-5 text-wj-dark" />
                  </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Passion for Excellence</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We approach every task with dedication and attention to detail, ensuring exceptional results that exceed expectations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-accent">
                    <IconShield className="h-5 w-5 text-wj-accent" />
                  </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Trust & Reliability</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Building lasting relationships through consistent, dependable service and transparent communication.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-dark">
                    <IconClock className="h-5 w-5 text-wj-dark" />
                  </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Timely Service</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Respecting your time with punctual arrivals and efficient service delivery that fits your schedule.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-accent">
                    <IconStar className="h-5 w-5 text-wj-accent" />
                  </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Maintaining the highest standards through rigorous quality control and continuous improvement processes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-dark">
                    <IconUsers className="h-5 w-5 text-wj-dark" />
                  </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Customer Focus</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Putting your needs first with personalized solutions and responsive support that adapts to your requirements.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-accent">
                    <IconAward className="h-5 w-5 text-wj-accent" />
                  </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Continuous Growth</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Embracing innovation and learning to deliver cutting-edge solutions that evolve with industry standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-wj-light/20 text-wj-dark rounded-full mb-6">
              <span className="text-sm font-semibold">Our Work</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Professional Excellence
              <span className="block text-wj-dark">in Every Detail</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the quality and attention to detail that sets WJ Cleaning Services apart from the competition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/giorgio-trovato-5TXz228u4eo-unsplash.jpg"
                alt="Professional cleaning service"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-white font-semibold text-lg">Residential Cleaning</h3>
                <p className="text-white/90 text-sm">Complete home cleaning solutions</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/pexels-karolina-grabowska-4239145.jpg"
                alt="Commercial cleaning service"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-white font-semibold text-lg">Commercial Cleaning</h3>
                <p className="text-white/90 text-sm">Professional office and facility cleaning</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/pexels-tima-miroshnichenko-6197121.jpg"
                alt="Warehouse staffing service"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-white font-semibold text-lg">Warehouse Staffing</h3>
                <p className="text-white/90 text-sm">Reliable workforce solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-wj-dark text-white relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm font-medium">{t('readyToWorkTogether')}</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              {t('letsBuildAmazing')}
            </h2>
            <p className="text-xl text-wj-light mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('aboutCtaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold">
                <Link href="/contact">{t('getStartedToday')}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-wj-dark bg-transparent"
              >
                <Link href="/services">View Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
