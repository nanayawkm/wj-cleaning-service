"use client"

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Check for reduced motion preference
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          
          if (prefersReducedMotion) {
            setIsVisible(true)
          } else {
            // Add delay for staggered animations
            setTimeout(() => {
              setIsVisible(true)
            }, delay)
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [delay])

  return { elementRef, isVisible }
} 