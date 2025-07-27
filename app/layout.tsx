import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import MobileBottomBar from "@/components/mobile-bottom-bar"
import { LanguageProvider as ContextLanguageProvider } from "@/contexts/LanguageContext"
import { LanguageProvider } from "@/components/language-provider"
import Script from "next/script"
import { CONTACT_DETAILS } from "@/components/constant"

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wjcleanforce.com'),
  title: "WJ Cleanforce - Professional Cleaning & Staffing Services",
  description:
    "Professional cleaning and staffing services built on trust, reliability, and excellence. Residential cleaning, office cleaning, warehouse staffing, and event staffing solutions.",
  generator: 'Next.js',
  keywords: ['cleaning services', 'professional cleaning', 'staffing services', 'residential cleaning', 'office cleaning', 'warehouse staffing', 'event staffing', 'WJ Cleanforce', 'Winfred', 'Jackie', 'cleaning company'],
  authors: [{ name: 'WJ Cleanforce' }, { name: 'Winfred & Jackie' }],
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
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://wjcleanforce.com',
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
    <html lang="en" suppressHydrationWarning>
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
              "telephone": CONTACT_DETAILS.phone,
              "email": "info@wjcleanforce.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Greater Metro Area",
                "addressCountry": "US"
              },
              "founder": [
                {
                  "@type": "Person",
                  "name": "Winfred"
                },
                {
                  "@type": "Person", 
                  "name": "Jackie"
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
      <body className={poppins.className}>
        <ContextLanguageProvider>
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
                // Improved scroll animation system with proper cleanup
                (function() {
                  let observer = null;
                  let isInitialized = false;

                  function cleanup() {
                    if (observer) {
                      observer.disconnect();
                      observer = null;
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
                      observer = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                            entry.target.classList.add('scroll-animate-in');
                          }
                        });
                      }, {
                        threshold: 0.1,
                        rootMargin: '0px 0px -50px 0px'
                      });

                      // Find and observe elements
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

                  // Handle Next.js navigation
                  if (typeof window !== 'undefined') {
                    let navigationTimeout;

                    function handleNavigation() {
                      cleanup();
                      clearTimeout(navigationTimeout);
                      navigationTimeout = setTimeout(initScrollAnimations, 150);
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
        </ContextLanguageProvider>
      </body>
    </html>
  )
}
