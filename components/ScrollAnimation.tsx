"use client"

import { ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface ScrollAnimationProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function ScrollAnimation({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up' 
}: ScrollAnimationProps) {
  const { elementRef, isVisible } = useScrollAnimation(delay)

  const getTransformClass = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-4'
      case 'down':
        return '-translate-y-4'
      case 'left':
        return 'translate-x-4'
      case 'right':
        return '-translate-x-4'
      default:
        return 'translate-y-4'
    }
  }

  return (
    <div
      ref={elementRef}
      className={`
        transition-all duration-700 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : `opacity-0 ${getTransformClass()}`
        }
        ${className}
      `}
    >
      {children}
    </div>
  )
} 