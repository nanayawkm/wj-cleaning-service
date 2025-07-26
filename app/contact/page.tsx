"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">Contact Us</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Let's Start Your Clean Journey</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Ready to experience the WJ Cleanforce difference? Get in touch with us today for a free consultation and
              personalized quote.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <Badge className="bg-blue-100 text-blue-600 mb-4">Get In Touch</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Your Free Quote</h2>
                <p className="text-gray-600 text-lg">
                  Fill out the form below and we'll get back to you within 24 hours with a personalized quote.
                </p>
              </div>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  {formSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                      <p className="text-gray-600">
                        We've received your message and will get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="service">Service Needed</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential-cleaning">Residential Cleaning</SelectItem>
                            <SelectItem value="office-cleaning">Office Cleaning</SelectItem>
                            <SelectItem value="warehouse-staffing">Warehouse Staffing</SelectItem>
                            <SelectItem value="event-staffing">Event Staffing</SelectItem>
                            <SelectItem value="multiple">Multiple Services</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your cleaning or staffing needs..."
                          rows={4}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <div className="mb-8">
                <Badge className="bg-purple-100 text-purple-600 mb-4">Contact Information</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Multiple Ways to Reach Us</h2>
                <p className="text-gray-600 text-lg">
                  Choose the method that works best for you. We're here to help and respond quickly.
                </p>
              </div>

              <div className="space-y-6">
                {/* Phone */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
                        <p className="text-gray-600 mb-3">Call us directly for immediate assistance</p>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Phone className="mr-2 h-4 w-4" />
                          (555) 123-4567
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-600 mb-3">Send us a detailed message</p>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Mail className="mr-2 h-4 w-4" />
                          info@wjcleanforce.com
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp Business</h3>
                        <p className="text-gray-600 mb-3">Quick responses via WhatsApp</p>
                        <Button className="w-full bg-green-500 hover:bg-green-600 justify-start">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat on WhatsApp
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Hours */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex justify-between">
                            <span>Monday - Friday:</span>
                            <span className="font-medium">7:00 AM - 7:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday:</span>
                            <span className="font-medium">8:00 AM - 5:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday:</span>
                            <span className="font-medium">Emergency Only</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Area */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Area</h3>
                        <p className="text-gray-600">
                          We proudly serve the greater metropolitan area and surrounding communities. Contact us to
                          confirm service availability in your location.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-600 mb-4">Frequently Asked Questions</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Quick Answers to Common Questions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How quickly can you start service?</h3>
                <p className="text-gray-600">
                  We can typically start service within 24-48 hours for cleaning services and 1-3 days for staffing
                  needs, depending on availability and requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you provide cleaning supplies?</h3>
                <p className="text-gray-600">
                  Yes! We bring all necessary cleaning supplies and equipment. We also offer eco-friendly options upon
                  request at no additional charge.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Are your staff insured and bonded?</h3>
                <p className="text-gray-600">
                  Absolutely. All our staff are fully insured, bonded, and undergo thorough background checks for your
                  peace of mind and security.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What are your payment options?</h3>
                <p className="text-gray-600">
                  We accept cash, check, and all major credit cards. For regular services, we offer convenient monthly
                  billing and automatic payment options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Need Emergency Service?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We understand that cleaning emergencies and urgent staffing needs can happen anytime. We're here to help
            when you need us most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 font-semibold">
              <Phone className="mr-2 h-5 w-5" />
              Emergency Hotline: (555) 911-CLEAN
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              24/7 WhatsApp Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
