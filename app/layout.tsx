import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import MobileBottomBar from "@/components/mobile-bottom-bar"
import { LanguageProvider } from "@/contexts/LanguageContext"
import Script from "next/script"
import { CONTACT_DETAILS } from "@/components/constant"

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wjcleaningservices.nl'),
  title: {
    default: "WJ Cleaning Services - Professional Cleaning & Staffing Services",
    template: "%s | WJ Cleaning Services"
  },
  description: "Professional cleaning and staffing services built on trust, reliability, and excellence. Residential cleaning, office cleaning, warehouse staffing, and event staffing solutions in Lelystad, Netherlands.",
  generator: 'Next.js',
  keywords: [
    'cleaning services', 'professional cleaning', 'staffing services', 'residential cleaning', 
    'office cleaning', 'warehouse staffing', 'event staffing', 'WJ Cleaning Services', 
    'cleaning company', 'Lelystad', 'Netherlands', 'commercial cleaning', 'industrial cleaning',
    'hotel cleaning', 'restaurant cleaning', 'school cleaning', 'warehouse cleaning'
  ],
  authors: [{ name: 'WJ Cleaning Services' }],
  creator: 'WJ Cleaning Services',
  publisher: 'WJ Cleaning Services',
  category: 'Cleaning Services',
  classification: 'Business',
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
    url: 'https://wjcleaningservices.nl',
    siteName: 'WJ Cleaning Services',
    title: 'WJ Cleaning Services - Professional Cleaning & Staffing Services',
    description: 'Professional cleaning and staffing services built on trust, reliability, and excellence. Serving Lelystad and surrounding areas with residential cleaning, office cleaning, warehouse staffing, and event staffing solutions.',
    images: [
      {
        url: '/images/logo1.png',
        width: 1200,
        height: 630,
        alt: 'WJ Cleaning Services - Professional Cleaning & Staffing Services',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WJ Cleaning Services - Professional Cleaning & Staffing Services',
    description: 'Professional cleaning and staffing services built on trust, reliability, and excellence.',
    images: ['/images/logo1.png'],
    creator: '@wjcleaningservices',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://wjcleaningservices.nl',
  },
  icons: {
    icon: [
      { url: '/images/logo1.png', sizes: 'any', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo1.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1f2937',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="canonical" href="https://wjcleaningservices.nl" />
        <link rel="icon" type="image/png" href="/images/logo1.png" />
        <link rel="apple-touch-icon" href="/images/logo1.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "WJ Cleaning Services",
              "description": "Professional cleaning and staffing services built on trust, reliability, and excellence.",
              "url": "https://wjcleaningservices.nl",
              "telephone": CONTACT_DETAILS.phone,
              "email": CONTACT_DETAILS.email,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": CONTACT_DETAILS.address,
                "addressLocality": CONTACT_DETAILS.city,
                "addressCountry": CONTACT_DETAILS.country
              },
              "foundingDate": "2020",
              "serviceType": [
                "Residential Cleaning",
                "Office Cleaning", 
                "Warehouse Cleaning",
                "Restaurant/Cafe Cleaning",
                "Hotel Cleaning",
                "School Cleaning",
                "Warehouse Staffing",
                "Event Staffing",
                "Office Support Staff",
                "Restaurant/Cafe Personnel",
                "Hotel Staff",
                "School Support Staff"
              ],
              "areaServed": "Lelystad, Netherlands",
              "priceRange": "$$",
              "sameAs": [
                "https://wjcleaningservices.nl"
              ]
            })
          }}
        />
      </head>
      <body className={poppins.className}>
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
          <MobileBottomBar />
        <Script
          id="scroll-animations"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Optimized scroll animation system with better performance
              (function() {
                let observer = null;
                let isInitialized = false;
                let animationFrameId = null;

                function cleanup() {
                  if (observer) {
                    observer.disconnect();
                    observer = null;
                  }
                  if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                  }
                  isInitialized = false;
                }

                function initScrollAnimations() {
                  // Prevent multiple initializations
                  if (isInitialized) {
                    return;
                  }

                  // Clean up any existing observer
                  cleanup();

                  // Check for reduced motion preference
                  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                  }

                  try {
                    // Use more efficient observer options
                    observer = new IntersectionObserver((entries) => {
                      // Use requestAnimationFrame for better performance
                      if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                      }
                      
                      animationFrameId = requestAnimationFrame(() => {
                        entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                            entry.target.classList.add('scroll-animate-in');
                          }
                        });
                      });
                    }, {
                      threshold: 0.1,
                      rootMargin: '0px 0px -50px 0px'
                    });

                    // Find and observe elements with debouncing
                    const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-right');
                    elements.forEach(el => {
                      // Reset animation state
                      el.classList.remove('scroll-animate-in');
                      observer.observe(el);
                    });

                    isInitialized = true;
                  } catch (error) {
                    console.warn('Scroll animations initialization failed:', error);
                  }
                }

                // Initialize on DOM ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initScrollAnimations);
                } else {
                  initScrollAnimations();
                }

                // Handle Next.js navigation with debouncing
                if (typeof window !== 'undefined') {
                  let navigationTimeout;

                  function handleNavigation() {
                    cleanup();
                    clearTimeout(navigationTimeout);
                    navigationTimeout = setTimeout(initScrollAnimations, 100);
                  }

                  // Listen for route changes
                  window.addEventListener('popstate', handleNavigation);
                  
                  // Override pushState and replaceState
                  const originalPushState = history.pushState;
                  const originalReplaceState = history.replaceState;

                  history.pushState = function(...args) {
                    originalPushState.apply(history, args);
                    handleNavigation();
                  };

                  history.replaceState = function(...args) {
                    originalReplaceState.apply(history, args);
                    handleNavigation();
                  };

                  // Cleanup on page unload
                  window.addEventListener('beforeunload', cleanup);
                }
              })();
            `
          }}
        />
        </LanguageProvider>
      </body>
    </html>
  )
}