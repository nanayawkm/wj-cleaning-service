import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import MobileBottomBar from "@/components/mobile-bottom-bar"
import { LanguageProvider } from "@/contexts/LanguageContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://wjcleanforce.com'),
  title: "WJ Cleanforce - Professional Cleaning & Staffing Services",
  description:
    "Professional cleaning and staffing services built on trust, reliability, and excellence. Residential cleaning, office cleaning, warehouse staffing, and event staffing solutions.",
  generator: 'Next.js',
  keywords: ['cleaning services', 'professional cleaning', 'staffing services', 'residential cleaning', 'office cleaning', 'warehouse staffing', 'event staffing', 'WJ Cleanforce', 'William', 'Jennifer', 'cleaning company'],
  authors: [{ name: 'WJ Cleanforce' }, { name: 'William & Jennifer' }],
  creator: 'WJ Cleanforce',
  publisher: 'WJ Cleanforce',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wjcleanforce.com',
    siteName: 'WJ Cleanforce',
    title: 'WJ Cleanforce - Professional Cleaning & Staffing Services',
    description: 'Professional cleaning and staffing services built on trust, reliability, and excellence. Serving the greater metro area with residential cleaning, office cleaning, warehouse staffing, and event staffing solutions.',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'WJ Cleanforce - Professional Cleaning & Staffing Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WJ Cleanforce - Professional Cleaning & Staffing Services',
    description: 'Professional cleaning and staffing services built on trust, reliability, and excellence.',
    images: ['/placeholder-logo.png'],
    creator: '@wjcleanforce',
  },
  icons: {
    icon: '/placeholder-logo.svg',
    shortcut: '/placeholder-logo.svg',
    apple: '/placeholder-logo.png',
  },
  manifest: '/site.webmanifest',

  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: 'business',
  classification: 'Cleaning Services, Staffing Services',
  other: {
    'contact:phone_number': '+1-555-123-4567',
    'contact:email': 'info@wjcleanforce.com',
    'business:contact_data:locality': 'Greater Metro Area',
    'business:contact_data:region': 'Metro Area',
    'business:contact_data:country_name': 'United States',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="canonical" href="https://wjcleanforce.com" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "WJ Cleanforce",
              "description": "Professional cleaning and staffing services built on trust, reliability, and excellence.",
              "url": "https://wjcleanforce.com",
              "telephone": "+1-555-123-4567",
              "email": "info@wjcleanforce.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Greater Metro Area",
                "addressCountry": "US"
              },
              "founder": [
                {
                  "@type": "Person",
                  "name": "William"
                },
                {
                  "@type": "Person", 
                  "name": "Jennifer"
                }
              ],
              "serviceType": [
                "Residential Cleaning",
                "Office Cleaning", 
                "Warehouse Staffing",
                "Event Staffing"
              ],
              "areaServed": "Greater Metro Area",
              "priceRange": "$$"
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
          <MobileBottomBar />
        </LanguageProvider>
      </body>
    </html>
  )
}
