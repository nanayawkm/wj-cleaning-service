"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Users, Star, Shield, Clock, Award, Heart, Phone, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CleaningBackground } from '@/components/cleaning-background'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <CleaningBackground />
      {/* Hero Section */}
      <section className="py-24 bg-wj-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-wj-light rounded-full blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-6">About WJ Cleanforce</Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Built on Trust,
              <span className="block text-wj-light">Driven by Excellence</span>
            </h1>
            <p className="text-xl lg:text-2xl text-wj-light leading-relaxed font-light max-w-3xl mx-auto">
              Founded by William and Jennifer, a dedicated couple who understood the importance of trust, reliability, and
              attention to detail. What started as a small family business has grown into a trusted partner for hundreds
              of satisfied customers.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-64 h-64 bg-wj-accent-light/30 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-wj-light/20 text-wj-dark rounded-full">
                <span className="text-sm font-semibold">Our Story</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Trusted Partners
                <span className="block text-wj-dark">in Excellence</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                William and Jennifer started WJ Cleanforce with a simple mission: to provide exceptional cleaning and
                staffing services that exceed expectations. Their commitment to quality, reliability, and customer
                satisfaction has made them the go-to choice for businesses and homeowners alike.
              </p>
              <div className="flex items-center space-x-4 p-6 bg-wj-light/10 rounded-2xl border border-wj-light/20">
                <div className="w-12 h-12 bg-wj-dark rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                  W
                </div>
                <div className="w-12 h-12 bg-wj-accent rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                  J
                </div>
                <div>
                  <p className="text-sm text-gray-600">Founded by</p>
                  <p className="font-semibold text-gray-900">William & Jennifer</p>
                </div>
              </div>
            </div>

            <div className="bg-wj-light/10 p-12 lg:p-16 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-wj-dark rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">500+ Happy Customers</h3>
                    <p className="text-gray-600">Satisfied clients across the region</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-wj-accent rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">5+ Years Experience</h3>
                    <p className="text-gray-600">Industry expertise and reliability</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-wj-dark rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Fully Insured</h3>
                    <p className="text-gray-600">Complete coverage for peace of mind</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-wj-accent-light/10 relative overflow-hidden">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-wj-light/20 rounded-bl-3xl opacity-50"></div>
              <div className="w-16 h-16 bg-wj-dark rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Passion for Excellence</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We approach every task with dedication and attention to detail, ensuring exceptional results that exceed
                expectations.
              </p>
            </div>

            <div className="group relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-wj-light/20 rounded-bl-3xl opacity-50"></div>
              <div className="w-16 h-16 bg-wj-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Trust & Reliability</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Building lasting relationships through consistent, dependable service and transparent communication.
              </p>
            </div>

            <div className="group relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-wj-light/20 rounded-bl-3xl opacity-50"></div>
              <div className="w-16 h-16 bg-wj-dark rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Timely Service</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Respecting your time with punctual arrivals and efficient service delivery that fits your schedule.
              </p>
            </div>

            <div className="group relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-wj-light/20 rounded-bl-3xl opacity-50"></div>
              <div className="w-16 h-16 bg-wj-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Quality Assurance</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Maintaining the highest standards through rigorous quality control and continuous improvement processes.
              </p>
            </div>

            <div className="group relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-wj-light/20 rounded-bl-3xl opacity-50"></div>
              <div className="w-16 h-16 bg-wj-dark rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Customer Focus</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Putting your needs first with personalized solutions and responsive support that adapts to your requirements.
              </p>
            </div>

            <div className="group relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-wj-light/20 rounded-bl-3xl opacity-50"></div>
              <div className="w-16 h-16 bg-wj-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Continuous Growth</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Embracing innovation and learning to deliver cutting-edge solutions that evolve with industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-wj-light/20 text-wj-dark rounded-full mb-6">
              <span className="text-sm font-semibold">Meet Our Team</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The People Behind
              <span className="block text-wj-dark">the Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our dedicated team of professionals brings years of experience and a passion for excellence to every project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-wj-dark rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">W</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">William</h3>
              <p className="text-wj-dark font-semibold mb-4">Co-Founder & Operations Director</p>
              <p className="text-gray-600 leading-relaxed">
                William oversees all operational aspects, ensuring every service meets our high standards of quality and
                efficiency.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-wj-accent rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">J</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Jennifer</h3>
              <p className="text-wj-accent-dark font-semibold mb-4">Co-Founder & Client Relations</p>
              <p className="text-gray-600 leading-relaxed">
                Jennifer manages client relationships and ensures every customer receives personalized attention and
                exceptional service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-wj-dark rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">T</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Team</h3>
              <p className="text-wj-dark font-semibold mb-4">50+ Trained Professionals</p>
              <p className="text-gray-600 leading-relaxed">
                Our skilled team of cleaning and staffing professionals are thoroughly vetted, trained, and committed to
                delivering excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-wj-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm font-medium">Ready to Work Together?</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              Let's Build Something
              <span className="block text-wj-light">Amazing Together</span>
            </h2>
            <p className="text-xl text-wj-light mb-12 max-w-2xl mx-auto leading-relaxed">
              Ready to experience the WJ Cleanforce difference? Contact us today for a free consultation and discover how
              we can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold">
                <Link href="/contact">Get Started Today</Link>
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
