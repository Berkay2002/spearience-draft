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
  // Interaction to Next Paint (INP) - should be <= 200ms
  INP: {
    GOOD: 200,
    NEEDS_IMPROVEMENT: 500,
  },
} as const

export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
  userAgent: string
  connectionType?: string
  deviceMemory?: number
}

export interface PerformanceSession {
  sessionId: string
  startTime: number
  endTime?: number
  pageViews: number
  metrics: PerformanceMetric[]
  deviceInfo: {
    isMobile: boolean
    isTouch: boolean
    screenWidth: number
    screenHeight: number
    devicePixelRatio: number
  }
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
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get device information
 */
function getDeviceInfo() {
  if (typeof window === 'undefined') return null
  
  return {
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch: 'ontouchstart' in window,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio || 1,
  }
}

/**
 * Store performance metrics locally for analysis
 */
function storePerformanceMetric(metric: PerformanceMetric) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  
  try {
    const sessionId = sessionStorage.getItem('perf_session_id') || generateSessionId()
    sessionStorage.setItem('perf_session_id', sessionId)
    
    const storageKey = `performance_metrics_${sessionId}`
    const existingMetrics = JSON.parse(localStorage.getItem(storageKey) || '[]')
    
    existingMetrics.push(metric)
    
    // Keep only last 100 metrics per session to avoid storage bloat
    if (existingMetrics.length > 100) {
      existingMetrics.splice(0, existingMetrics.length - 100)
    }
    
    localStorage.setItem(storageKey, JSON.stringify(existingMetrics))
    
    // Clean up old sessions (keep only last 7 days)
    cleanupOldMetrics()
  } catch (error) {
    console.warn('Failed to store performance metric:', error)
  }
}

/**
 * Clean up old performance metrics
 */
function cleanupOldMetrics() {
  if (typeof localStorage === 'undefined') return
  
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
  
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (key?.startsWith('performance_metrics_')) {
      try {
        const metrics = JSON.parse(localStorage.getItem(key) || '[]')
        if (metrics.length > 0 && metrics[0].timestamp < sevenDaysAgo) {
          localStorage.removeItem(key)
        }
      } catch (error) {
        // Remove corrupted data
        if (key) localStorage.removeItem(key)
      }
    }
  }
}

/**
 * Report Core Web Vitals with enhanced local tracking
 */
export function reportWebVitals(metric: PerformanceMetric) {
  // Store metric locally
  storePerformanceMetric(metric)
  
  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
    console.log(`[Performance] ${emoji} ${metric.name}:`, {
      value: `${metric.value}${metric.name === 'CLS' ? '' : 'ms'}`,
      rating: metric.rating,
      timestamp: new Date(metric.timestamp).toLocaleTimeString(),
    })
  }
  
  // Dispatch custom event for potential integrations
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('performance-metric', {
      detail: metric
    }))
  }
}

/**
 * Get stored performance metrics for analysis
 */
export function getStoredMetrics(): PerformanceMetric[] {
  if (typeof localStorage === 'undefined') return []
  
  const sessionId = sessionStorage.getItem('perf_session_id')
  if (!sessionId) return []
  
  try {
    const storageKey = `performance_metrics_${sessionId}`
    return JSON.parse(localStorage.getItem(storageKey) || '[]')
  } catch (error) {
    console.warn('Failed to retrieve performance metrics:', error)
    return []
  }
}

/**
 * Get performance summary for current session
 */
export function getPerformanceSummary() {
  const metrics = getStoredMetrics()
  
  const summary = {
    totalMetrics: metrics.length,
    good: metrics.filter(m => m.rating === 'good').length,
    needsImprovement: metrics.filter(m => m.rating === 'needs-improvement').length,
    poor: metrics.filter(m => m.rating === 'poor').length,
    averages: {} as Record<string, number>,
    latest: {} as Record<string, PerformanceMetric>,
  }
  
  // Calculate averages and latest values for each metric type
  const metricTypes = [...new Set(metrics.map(m => m.name))]
  
  metricTypes.forEach(type => {
    const typeMetrics = metrics.filter(m => m.name === type)
    if (typeMetrics.length > 0) {
      summary.averages[type] = typeMetrics.reduce((sum, m) => sum + m.value, 0) / typeMetrics.length
      summary.latest[type] = typeMetrics[typeMetrics.length - 1]
    }
  })
  
  return summary
}

/**
 * Performance observer for monitoring loading performance
 */
export function observePerformance() {
  if (typeof window === 'undefined') return

  const createMetric = (name: string, value: number): PerformanceMetric => ({
    name,
    value,
    rating: getPerformanceRating(name as keyof typeof PERFORMANCE_THRESHOLDS, value),
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    connectionType: (navigator as any).connection?.effectiveType,
    deviceMemory: (navigator as any).deviceMemory,
  })

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
          reportWebVitals(createMetric('LCP', value))
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
            reportWebVitals(createMetric('FID', value))
          }
        })
      })
      
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch (error) {
      console.warn('FID observer not supported:', error)
    }

    // Observe Interaction to Next Paint (INP) - modern replacement for FID
    try {
      const inpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const inpEntry = entry as PerformanceEntry & { processingStart?: number; processingEnd?: number }
          if (inpEntry.processingStart && inpEntry.processingEnd) {
            const value = inpEntry.processingEnd - entry.startTime
            reportWebVitals(createMetric('INP', value))
          }
        })
      })
      
      inpObserver.observe({ type: 'event', buffered: true })
    } catch (error) {
      console.warn('INP observer not supported:', error)
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
      const reportCLS = () => {
        if (clsValue > 0) {
          reportWebVitals(createMetric('CLS', clsValue))
        }
      }

      window.addEventListener('beforeunload', reportCLS)
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportCLS()
        }
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
        reportWebVitals(createMetric('TTFB', ttfb))
      }

      // First Contentful Paint (FCP)
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      
      if (fcpEntry) {
        reportWebVitals(createMetric('FCP', fcpEntry.startTime))
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
  ]

  fontPreloads.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })

  // Preload critical images
  const criticalImages = [
    '/images/chrish/profile-hero.jpg', // Hero image
  ]

  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
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
 * Monitor long tasks that can block the main thread
 */
export function observeLongTasks() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const longTaskEntry = entry as PerformanceEntry & { attribution?: any[] }
        
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn('[Performance] Long task detected:', {
            duration: `${entry.duration.toFixed(2)}ms`,
            startTime: `${entry.startTime.toFixed(2)}ms`,
            attribution: longTaskEntry.attribution,
          })
          
          // Report as a custom metric
          reportWebVitals({
            name: 'LONG_TASK',
            value: entry.duration,
            rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          })
        }
      })
    })
    
    longTaskObserver.observe({ type: 'longtask', buffered: true })
  } catch (error) {
    console.warn('Long task observer not supported:', error)
  }
}

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Start performance observation
  observePerformance()
  
  // Monitor long tasks
  observeLongTasks()
  
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
            'DOM Content Loaded': `${navigation.domContentLoadedEventEnd - navigation.startTime}ms`,
            'Load Complete': `${navigation.loadEventEnd - navigation.startTime}ms`,
            'DNS Lookup': `${navigation.domainLookupEnd - navigation.domainLookupStart}ms`,
            'TCP Connection': `${navigation.connectEnd - navigation.connectStart}ms`,
            'Server Response': `${navigation.responseEnd - navigation.requestStart}ms`,
          })
          
          // Log current session summary
          const summary = getPerformanceSummary()
          console.log('[Performance Session Summary]', summary)
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
    document.documentElement.classList.add('reduced-motion')
  }

  // Disable hover effects on touch devices
  if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device')
  }

  // Optimize scroll performance with throttled updates
  let ticking = false
  let lastScrollTime = 0
  
  function updateScrollPosition() {
    const now = performance.now()
    const timeSinceLastScroll = now - lastScrollTime
    
    // Track scroll performance
    if (timeSinceLastScroll > 0) {
      const fps = 1000 / timeSinceLastScroll
      if (fps < 30 && process.env.NODE_ENV === 'development') {
        console.warn('[Performance] Low scroll FPS detected:', fps.toFixed(1))
      }
    }
    
    lastScrollTime = now
    ticking = false
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition)
      ticking = true
    }
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true })

  // Monitor memory usage on mobile devices
  if ('memory' in performance && (performance as any).memory) {
    const checkMemoryUsage = () => {
      const memory = (performance as any).memory
      const usedMB = memory.usedJSHeapSize / 1024 / 1024
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024
      const usagePercent = (usedMB / limitMB) * 100
      
      if (usagePercent > 80 && process.env.NODE_ENV === 'development') {
        console.warn('[Performance] High memory usage detected:', {
          used: `${usedMB.toFixed(2)}MB`,
          limit: `${limitMB.toFixed(2)}MB`,
          usage: `${usagePercent.toFixed(1)}%`,
        })
      }
    }
    
    // Check memory usage every 30 seconds
    setInterval(checkMemoryUsage, 30000)
  }
}

/**
 * Performance debugging utilities for development
 */
export const performanceDebug = {
  /**
   * Get all stored metrics
   */
  getAllMetrics: getStoredMetrics,
  
  /**
   * Get performance summary
   */
  getSummary: getPerformanceSummary,
  
  /**
   * Clear all stored metrics
   */
  clearMetrics: () => {
    if (typeof localStorage === 'undefined') return
    
    const sessionId = sessionStorage.getItem('perf_session_id')
    if (sessionId) {
      localStorage.removeItem(`performance_metrics_${sessionId}`)
    }
    console.log('[Performance] Metrics cleared')
  },
  
  /**
   * Export metrics as JSON
   */
  exportMetrics: () => {
    const metrics = getStoredMetrics()
    const summary = getPerformanceSummary()
    
    const data = {
      summary,
      metrics,
      exportTime: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-metrics-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  },
}

// Make debug utilities available in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).performanceDebug = performanceDebug
} 