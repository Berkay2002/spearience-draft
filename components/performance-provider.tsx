'use client'

import { useEffect } from 'react'
import { initializePerformanceMonitoring, optimizeMobilePerformance } from '@/lib/performance'

interface PerformanceProviderProps {
  children: React.ReactNode
}

/**
 * Performance Provider component that initializes performance monitoring
 * and mobile optimizations for the entire application
 */
export function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Initialize performance monitoring on client side
    initializePerformanceMonitoring()
    
    // Apply mobile-specific optimizations
    optimizeMobilePerformance()
    
    // Report initial page load performance
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        // Wait a bit for all resources to finish loading
        setTimeout(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Performance] Page load complete')
          }
        }, 1000)
      })
    }
  }, [])

  return <>{children}</>
} 