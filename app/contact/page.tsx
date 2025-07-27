"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { IconPhone, IconMail, IconMapPin, IconClock, IconShieldCheck, IconUsers, IconStar, IconAward, IconHeart, IconDroplet, IconSparkles, IconCheck, IconBuilding, IconHome, IconBriefcase, IconBuildingWarehouse, IconSend } from '@tabler/icons-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CleaningBackground } from '@/components/cleaning-background'

export default function ContactPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-wj-light/10 via-white to-wj-accent-light/10">
      <CleaningBackground />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-wj-dark to-wj-accent text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-6">{t('contactUs')}</Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              {t('contactHeroTitle')}
            </h1>
            <p className="text-xl text-wj-light leading-relaxed">
              {t('contactHeroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <Badge className="bg-wj-light/20 text-wj-dark mb-4">{t('getInTouch')}</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t('sendMessage')}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('sendMessageDesc')}
                </p>
              </div>

              <div className="flex items-center space-x-4 p-6 bg-wj-light/10 rounded-2xl">
                <IconShieldCheck className="h-16 w-16 text-wj-accent mx-auto mb-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Response Guaranteed</h3>
                  <p className="text-gray-600">We typically respond within 2-4 hours during business hours.</p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">
                      {t('name')} *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder={t('name')}
                      className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">
                      {t('name')} *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder={t('name')}
                      className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      {t('email')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('email')}
                      className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      {t('phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('phoneNumber')}
                      className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service" className="text-gray-700 font-medium">
                    Service Type *
                  </Label>
                  <select
                    id="service"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-wj-dark focus:ring-wj-dark/20 bg-white"
                  >
                    <option value="">Select a service</option>
                    <option value="residential">Residential Cleaning</option>
                    <option value="commercial">Commercial Cleaning</option>
                    <option value="warehouse">Warehouse Staffing</option>
                    <option value="event">Event Staffing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    {t('message')} *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={t('message')}
                    rows={6}
                    className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark text-lg py-6"
                >
                  <IconSend className="mr-2 h-5 w-5" />
                  {t('submit')}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="mb-8">
                <div className="w-full h-32 rounded-2xl shadow-2xl overflow-hidden bg-white border-2 border-gray-100">
                  <img
                    src="/images/contact us.jpg"
                    alt="Contact us - professional cleaning service"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <Badge className="bg-wj-accent-light/20 text-wj-accent-dark mb-4">Contact Information</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Get In Touch
                  <span className="block text-wj-accent-dark">With Us</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Prefer to call or email directly? We're here to help and answer any questions you might have about our
                  services.
                </p>
              </div>

              <div className="space-y-6">
                                  <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                      <IconPhone className="h-6 w-6 text-wj-dark" />
                    </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+31 (0) 685063641</p>
                    <p className="text-sm text-gray-500">Available 24/7 for emergencies</p>
                  </div>
                </div>

                                  <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-accent">
                      <IconMail className="h-6 w-6 text-wj-accent" />
                    </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@wjcleaningservices.nl</p>
                    <p className="text-sm text-gray-500">We respond within 2-4 hours</p>
                  </div>
                </div>

                                  <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-accent">
                      <IconMapPin className="h-6 w-6 text-wj-accent" />
                    </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Service Area</h3>
                    <p className="text-gray-600">Flevoland Region</p>
                    <p className="text-sm text-gray-500">Serving the greater metropolitan area</p>
                  </div>
                </div>

                                  <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                      <IconClock className="h-6 w-6 text-wj-dark" />
                    </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-sm text-gray-500">Weekend appointments available</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-r from-wj-dark to-wj-accent rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
                <p className="text-wj-light mb-6">
                  For urgent cleaning or staffing needs, call us directly. We offer emergency services and can often
                  accommodate same-day requests.
                </p>
                <Button className="w-full bg-white text-wj-dark hover:bg-wj-light/10 justify-start">
                  <IconPhone className="mr-2 h-5 w-5" />
                  Call Now: +31 (0) 685063641
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-r from-wj-light/10 to-wj-accent-light/10 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-wj-light/20 text-wj-dark mb-4">Frequently Asked Questions</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Common Questions
              <span className="block text-wj-dark">Answered</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to the most frequently asked questions about our services, pricing, and policies.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">What areas do you serve?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  We primarily serve the Flevoland region and surrounding areas. Contact us to confirm if we cover your
                  specific location.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">How quickly can you start?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  We can often accommodate same-day or next-day requests for urgent needs. Regular scheduling typically
                  requires 24-48 hours notice.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Are your staff insured and bonded?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Yes, all our staff are fully insured and bonded. We carry comprehensive liability coverage for your
                  peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">What cleaning products do you use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  We use eco-friendly, professional-grade cleaning products that are safe for families, pets, and the
                  environment while delivering exceptional results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Do you provide supplies and equipment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Yes, we bring all necessary cleaning supplies and equipment. You don't need to provide anything - we
                  come fully prepared.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">What is your satisfaction guarantee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  We offer a 100% satisfaction guarantee. If you're not completely satisfied with our service, we'll
                  return to fix it at no additional cost.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-wj-dark to-wj-accent text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              Ready to Get
              <span className="block text-wj-light">Started?</span>
            </h2>
            <p className="text-xl text-wj-light mb-8 max-w-2xl mx-auto">
              Don't wait to experience the WJ Cleanforce difference. Contact us today for your free consultation and
              personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold"
              >
                <a href="tel:+31685063641">Call Now</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-wj-dark bg-transparent"
              >
                <a href="mailto:info@wjcleaningservices.nl">Email Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
