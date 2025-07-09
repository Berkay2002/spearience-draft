/**
 * Performance monitoring and Core Web Vitals optimization utilities
 * Provides tools for measuring and optimizing website performance on mobile and desktop
 */

// Core Web Vitals threshold values (in milliseconds)
export const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP) - should be <= 2.5s
  LCP: {
    GOOD: 2500,
    NEEDS_IMPROVEMENT: 4000,
  },
  // First Input Delay (FID) - should be <= 100ms
  FID: {
    GOOD: 100,
    NEEDS_IMPROVEMENT: 300,
  },
  // Cumulative Layout Shift (CLS) - should be <= 0.1
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25,
  },
  // First Contentful Paint (FCP) - should be <= 1.8s
  FCP: {
    GOOD: 1800,
    NEEDS_IMPROVEMENT: 3000,
  },
  // Time to First Byte (TTFB) - should be <= 800ms
  TTFB: {
    GOOD: 800,
    NEEDS_IMPROVEMENT: 1800,
  },
}

export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

/**
 * Get performance rating based on thresholds
 */
export function getPerformanceRating(
  metricName: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName]
  
  if (value <= thresholds.GOOD) {
    return 'good'
  } else if (value <= thresholds.NEEDS_IMPROVEMENT) {
    return 'needs-improvement'
  } else {
    return 'poor'
  }
}

/**
 * Report Core Web Vitals to analytics
 */
export function reportWebVitals(metric: PerformanceMetric) {
  // Report to Google Analytics 4 if available
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.rating,
      non_interaction: true,
    })
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      timestamp: metric.timestamp,
    })
  }
}

/**
 * Performance observer for monitoring loading performance
 */
export function observePerformance() {
  if (typeof window === 'undefined') return

  // Observe Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number
          loadTime?: number
        }
        
        if (lastEntry) {
          const value = lastEntry.renderTime || lastEntry.loadTime || 0
          reportWebVitals({
            name: 'LCP',
            value,
            rating: getPerformanceRating('LCP', value),
            timestamp: Date.now(),
          })
        }
      })
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch (error) {
      console.warn('LCP observer not supported:', error)
    }

    // Observe First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number }
          if (fidEntry.processingStart) {
            const value = fidEntry.processingStart - entry.startTime
            reportWebVitals({
              name: 'FID',
              value,
              rating: getPerformanceRating('FID', value),
              timestamp: Date.now(),
            })
          }
        })
      })
      
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch (error) {
      console.warn('FID observer not supported:', error)
    }

    // Observe Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      let clsEntries: PerformanceEntry[] = []
      
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }
          
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value
            clsEntries.push(entry)
          }
        })
      })
      
      clsObserver.observe({ type: 'layout-shift', buffered: true })

      // Report CLS when page is about to be unloaded
      window.addEventListener('beforeunload', () => {
        reportWebVitals({
          name: 'CLS',
          value: clsValue,
          rating: getPerformanceRating('CLS', clsValue),
          timestamp: Date.now(),
        })
      })
    } catch (error) {
      console.warn('CLS observer not supported:', error)
    }
  }

  // Measure First Contentful Paint (FCP) and TTFB using Navigation Timing API
  window.addEventListener('load', () => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0]
        
        // Time to First Byte (TTFB)
        const ttfb = navigation.responseStart - navigation.requestStart
        reportWebVitals({
          name: 'TTFB',
          value: ttfb,
          rating: getPerformanceRating('TTFB', ttfb),
          timestamp: Date.now(),
        })
      }

      // First Contentful Paint (FCP)
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      
      if (fcpEntry) {
        reportWebVitals({
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: getPerformanceRating('FCP', fcpEntry.startTime),
          timestamp: Date.now(),
        })
      }
    }
  })
}

/**
 * Preload critical resources for better performance
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  const fontPreloads = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
    'https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap',
  ]

  fontPreloads.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

/**
 * Optimize images for better loading performance
 */
export function optimizeImageLoading() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

  // Lazy load images that are not in viewport
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
          }
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset
            img.removeAttribute('data-srcset')
          }
          
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  )

  // Observe all lazy images
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img)
  })
}

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Start performance observation
  observePerformance()
  
  // Preload critical resources
  preloadCriticalResources()
  
  // Initialize image optimization
  window.addEventListener('DOMContentLoaded', optimizeImageLoading)
  
  // Monitor resource loading
  if ('performance' in window) {
    window.addEventListener('load', () => {
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          console.log('[Performance Summary]', {
            'DOM Content Loaded': `${navigation.domContentLoadedEventEnd - navigation.navigationStart}ms`,
            'Load Complete': `${navigation.loadEventEnd - navigation.navigationStart}ms`,
            'DNS Lookup': `${navigation.domainLookupEnd - navigation.domainLookupStart}ms`,
            'TCP Connection': `${navigation.connectEnd - navigation.connectStart}ms`,
            'Server Response': `${navigation.responseEnd - navigation.requestStart}ms`,
          })
        }, 1000)
      }
    })
  }
}

/**
 * Optimize for mobile performance
 */
export function optimizeMobilePerformance() {
  if (typeof window === 'undefined') return

  // Reduce animations on low-end devices
  if ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s')
  }

  // Disable hover effects on touch devices
  if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device')
  }

  // Optimize scroll performance
  let ticking = false
  
  function updateScrollPosition() {
    // Perform scroll-related updates here
    ticking = false
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition)
      ticking = true
    }
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true })
} 