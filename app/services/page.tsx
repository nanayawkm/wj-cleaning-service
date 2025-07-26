"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Home, Building, Warehouse, Users, Star, Shield, Clock, Award } from 'lucide-react'
import { CleaningBackground } from '@/components/cleaning-background'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wj-light/10 via-white to-wj-accent-light/10">
      <CleaningBackground />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-wj-dark to-wj-accent text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Badge className="bg-white/20 text-white mb-6">Our Services</Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Complete Cleaning &
              <span className="block text-wj-light">Staffing Solutions</span>
            </h1>
            <p className="text-xl text-wj-light leading-relaxed">
              From sparkling clean spaces to reliable workforce solutions, we deliver excellence in every service with
              unmatched quality and professionalism.
            </p>
          </div>
        </div>
      </section>

      {/* Cleaning Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-wj-light/20 text-wj-dark mb-4">Cleaning Services</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Professional Cleaning
              <span className="block text-wj-dark">for Every Space</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive cleaning services ensure your spaces are not just clean, but truly spotless. We use
              eco-friendly products and proven techniques for exceptional results.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-wj-dark rounded-xl flex items-center justify-center flex-shrink-0">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Residential Cleaning</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Transform your home into a pristine sanctuary with our comprehensive residential cleaning services.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Deep cleaning and sanitization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Eco-friendly cleaning products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Flexible scheduling options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Satisfaction guaranteed</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark">
                Get Residential Quote
              </Button>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-wj-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Commercial Cleaning</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Maintain a pristine work environment with our comprehensive commercial cleaning solutions.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Office and workspace cleaning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Industrial facility maintenance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Specialized equipment cleaning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">24/7 emergency services</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-wj-accent to-wj-dark hover:from-wj-accent-dark hover:to-wj-darker">
                Get Commercial Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Staffing Services Section */}
      <section className="py-20 bg-gradient-to-r from-wj-light/10 to-wj-accent-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-wj-accent-light/20 text-wj-accent-dark mb-4">Staffing Services</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Reliable Workforce
              <span className="block text-wj-accent-dark">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide skilled, reliable personnel for various industries. Our staff is thoroughly vetted, trained, and
              ready to meet your operational needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-wj-dark rounded-xl flex items-center justify-center flex-shrink-0">
                  <Warehouse className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Warehouse Staffing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Reliable warehouse personnel to keep your operations running smoothly and efficiently.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Order picking and packing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Inventory management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Loading and unloading</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Quality control support</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark">
                Hire Warehouse Staff
              </Button>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-wj-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Event Staffing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Professional event staff to ensure your special occasions run flawlessly from start to finish.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Event setup and teardown</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Guest services and hospitality</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Security and crowd management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">Post-event cleanup</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-wj-accent to-wj-dark hover:from-wj-accent-dark hover:to-wj-darker">
                Hire Event Staff
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Excellence Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-wj-light/20 text-wj-dark mb-4">Service Excellence</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose WJ
              <span className="block text-wj-dark">Cleanforce</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-wj-dark to-wj-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assured</h3>
              <p className="text-gray-600">
                Every service is backed by our quality guarantee and attention to detail.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-wj-accent to-wj-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fully Insured</h3>
              <p className="text-gray-600">
                Complete coverage for your peace of mind and protection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-wj-dark to-wj-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock availability for emergencies and urgent needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-wj-accent to-wj-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Award Winning</h3>
              <p className="text-gray-600">
                Recognized for excellence in service and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-wj-dark to-wj-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              Ready to Experience
              <span className="block text-wj-light">the Difference?</span>
            </h2>
            <p className="text-xl text-wj-light mb-8 max-w-2xl mx-auto">
              Get your free quote today and discover why hundreds of customers trust WJ Cleanforce for their cleaning and
              staffing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold">
                <a href="/contact">Get Free Quote</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-wj-dark bg-transparent"
              >
                <a href="tel:+15551234567">Call Now</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
