import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Zap, Users, Award, Clock, Sparkles } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Blue Background */}
      <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Heart className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">About WJ Cleanforce</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Built on Love,
              <span className="block text-blue-200">Driven by Excellence</span>
            </h1>

            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed font-light max-w-3xl mx-auto">
              Founded by William and Jennifer, a passionate couple who believed that exceptional service comes from the
              heart. WJ Cleanforce represents the perfect blend of personal care and professional expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section - White Background */}
      <section className="py-24 bg-white relative">
        {/* Purple decorative blob */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full">
                <span className="text-sm font-semibold">Our Story</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                From Humble Beginnings to
                <span className="block text-blue-600">Trusted Partners</span>
              </h2>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p className="text-xl">
                  WJ Cleanforce was born from a simple yet powerful vision: to create a cleaning and staffing company
                  that treats every client like family.
                </p>
                <p>
                  William and Jennifer started this journey in their own home, understanding firsthand the importance of
                  trust, reliability, and attention to detail. What began as helping neighbors and friends has grown
                  into a comprehensive service provider that serves hundreds of satisfied customers.
                </p>
                <p>
                  Today, we maintain the same personal touch and commitment to excellence that defined our very first
                  day in business. Every service we provide is delivered with the care and dedication you'd expect from
                  family.
                </p>
              </div>

              {/* Founders highlight */}
              <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex -space-x-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                    W
                  </div>
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                    J
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">William & Jennifer</p>
                  <p className="text-sm text-gray-600">Co-Founders & Your Trusted Partners</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-50 rounded-2xl p-6">
                <Image
                  src="/placeholder.svg?height=500&width=600&text=William+and+Jennifer+Founders"
                  alt="WJ Cleanforce founders William and Jennifer"
                  width={600}
                  height={500}
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section - Purple Background */}
      <section className="py-24 bg-purple-50 relative overflow-hidden">
        {/* Blue decorative blob */}
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-full mb-6">
              <span className="text-sm font-semibold">Our Values</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Principles That
              <span className="block text-purple-600">Guide Us Daily</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our core values aren't just words on a wall—they're the foundation of every interaction, every service,
              and every relationship we build with our clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value Cards with modern styling */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Reliability</h3>
                <p className="text-gray-600 leading-relaxed">
                  We show up when we say we will, deliver what we promise, and maintain consistent quality in every
                  service we provide.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cleanliness</h3>
                <p className="text-gray-600 leading-relaxed">
                  Spotless results aren't just our goal—they're our standard. We take pride in transforming spaces and
                  exceeding expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Efficiency</h3>
                <p className="text-gray-600 leading-relaxed">
                  Time is valuable. We work smart, move fast, and deliver exceptional results without compromising on
                  quality.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Integrity</h3>
                <p className="text-gray-600 leading-relaxed">
                  Honest communication, fair pricing, and ethical practices guide every decision we make and every
                  service we deliver.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Good enough isn't good enough. We continuously improve, innovate, and strive for perfection in
                  everything we do.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl opacity-50"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Commitment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your success is our success. We're committed to building long-term partnerships based on trust and
                  mutual respect.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section - White Background */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full mb-6">
              <span className="text-sm font-semibold">Our Team</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Meet the People Behind
              <span className="block text-blue-600">the Excellence</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our success is built on the dedication and expertise of our amazing team members who share our commitment
              to excellence and family values.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-0 shadow-xl rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">W</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">William</h3>
                <p className="text-blue-600 font-semibold mb-4">Co-Founder & Operations Director</p>
                <p className="text-gray-600 leading-relaxed">
                  Passionate about operational excellence and ensuring every client receives the highest quality service
                  experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">J</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Jennifer</h3>
                <p className="text-purple-600 font-semibold mb-4">Co-Founder & Client Relations</p>
                <p className="text-gray-600 leading-relaxed">
                  Dedicated to building lasting relationships and ensuring every client feels valued and completely
                  satisfied.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Team</h3>
                <p className="text-green-600 font-semibold mb-4">50+ Trained Professionals</p>
                <p className="text-gray-600 leading-relaxed">
                  Carefully selected, thoroughly trained, and passionately committed professionals ready to exceed your
                  expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
