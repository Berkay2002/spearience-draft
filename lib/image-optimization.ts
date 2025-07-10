/**
 * Image optimization utilities for Next.js applications
 * Provides responsive sizing, blur placeholders, and performance optimizations
 */

import { ImageProps } from 'next/image'

// Common responsive breakpoints for images
export const IMAGE_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultrawide: 1920,
} as const

// Image quality settings for different contexts
export const IMAGE_QUALITY = {
  low: 50,
  medium: 75,
  high: 85,
  ultra: 95,
} as const

// Common aspect ratios
export const ASPECT_RATIOS = {
  square: 1,
  portrait: 4/5,
  landscape: 16/9,
  wide: 21/9,
  ultrawide: 32/9,
} as const

// Image sizes for different component contexts
export const IMAGE_SIZES = {
  hero: {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '500px',
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px'
  },
  profile: {
    mobile: '300px',
    tablet: '400px', 
    desktop: '500px',
    sizes: '(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px'
  },
  gallery: {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
  },
  thumbnail: {
    mobile: '150px',
    tablet: '200px',
    desktop: '250px',
    sizes: '(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px'
  },
  fullWidth: {
    mobile: '100vw',
    tablet: '100vw',
    desktop: '100vw',
    sizes: '100vw'
  },
  card: {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '400px',
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px'
  }
} as const

/**
 * Generate a low-quality blur placeholder for Next.js Image
 * Uses a generic blur data URL that works well for most content
 */
export function generateBlurPlaceholder(width: number = 8, height: number = 6): string {
  // Generic blur placeholder that works well for most images
  return `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==`
}

/**
 * Get optimal image dimensions for different contexts
 */
export function getImageDimensions(context: keyof typeof IMAGE_SIZES, aspectRatio: number = ASPECT_RATIOS.landscape) {
  const baseWidths = {
    hero: 800,
    profile: 400,
    gallery: 600,
    thumbnail: 200,
    fullWidth: 1200,
    card: 400
  }

  const width = baseWidths[context]
  const height = Math.round(width / aspectRatio)

  return { width, height }
}

/**
 * Configuration for different image loading contexts
 */
export interface ImageConfig {
  priority?: boolean
  quality?: number
  sizes: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Get optimized image configuration for different contexts
 */
export function getImageConfig(
  context: keyof typeof IMAGE_SIZES,
  options: {
    priority?: boolean
    quality?: keyof typeof IMAGE_QUALITY
    customSizes?: string
    useBlur?: boolean
  } = {}
): ImageConfig {
  const {
    priority = false,
    quality = 'high',
    customSizes,
    useBlur = true
  } = options

  const config: ImageConfig = {
    priority,
    quality: IMAGE_QUALITY[quality],
    sizes: customSizes || IMAGE_SIZES[context].sizes,
    loading: priority ? 'eager' : 'lazy'
  }

  if (useBlur) {
    config.placeholder = 'blur'
    config.blurDataURL = generateBlurPlaceholder()
  }

  return config
}

/**
 * Create responsive image props for Next.js Image component
 */
export function createResponsiveImageProps(
  src: string,
  alt: string,
  context: keyof typeof IMAGE_SIZES,
  options: {
    priority?: boolean
    quality?: keyof typeof IMAGE_QUALITY
    aspectRatio?: number
    customSizes?: string
    useBlur?: boolean
    fill?: boolean
    width?: number
    height?: number
  } = {}
): Partial<ImageProps> {
  const {
    priority = false,
    quality = 'high',
    aspectRatio = ASPECT_RATIOS.landscape,
    customSizes,
    useBlur = true,
    fill = false,
    width: customWidth,
    height: customHeight
  } = options

  const config = getImageConfig(context, { priority, quality, customSizes, useBlur })
  
  const baseProps: Partial<ImageProps> = {
    src,
    alt,
    ...config
  }

  if (fill) {
    baseProps.fill = true
  } else {
    const dimensions = customWidth && customHeight 
      ? { width: customWidth, height: customHeight }
      : getImageDimensions(context, aspectRatio)
    
    baseProps.width = dimensions.width
    baseProps.height = dimensions.height
  }

  return baseProps
}

/**
 * Optimize external image URLs (like Unsplash) with query parameters
 */
export function optimizeExternalImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'jpg' | 'webp' | 'avif'
    fit?: 'crop' | 'contain' | 'cover'
  } = {}
): string {
  const {
    width = 800,
    height,
    quality = 85,
    format = 'jpg',
    fit = 'crop'
  } = options

  // Handle Unsplash URLs
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0]
    const params = new URLSearchParams()
    
    params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('q', quality.toString())
    params.set('fm', format)
    params.set('fit', fit)
    params.set('auto', 'format')
    
    return `${baseUrl}?${params.toString()}`
  }

  // Return original URL if not optimizable
  return url
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(
  baseSrc: string,
  widths: number[] = [400, 800, 1200, 1600]
): string {
  return widths
    .map(width => {
      const optimizedUrl = optimizeExternalImageUrl(baseSrc, { width })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
}

/**
 * Get optimized image props specifically for different component types
 */
export const imagePresets = {
  /**
   * Hero section images - above the fold, high priority
   */
  hero: (src: string, alt: string) => 
    createResponsiveImageProps(src, alt, 'hero', {
      priority: true,
      quality: 'high',
      aspectRatio: ASPECT_RATIOS.portrait
    }),

  /**
   * Profile/about images - important but below fold
   */
  profile: (src: string, alt: string) => 
    createResponsiveImageProps(src, alt, 'profile', {
      priority: false,
      quality: 'high',
      aspectRatio: ASPECT_RATIOS.portrait
    }),

  /**
   * Gallery/project images - lazy loaded
   */
  gallery: (src: string, alt: string) => 
    createResponsiveImageProps(src, alt, 'gallery', {
      priority: false,
      quality: 'medium',
      aspectRatio: ASPECT_RATIOS.landscape
    }),

  /**
   * Card images - smaller, optimized for performance
   */
  card: (src: string, alt: string) => 
    createResponsiveImageProps(src, alt, 'card', {
      priority: false,
      quality: 'medium',
      aspectRatio: ASPECT_RATIOS.landscape
    }),

  /**
   * Thumbnail images - small, fast loading
   */
  thumbnail: (src: string, alt: string) => 
    createResponsiveImageProps(src, alt, 'thumbnail', {
      priority: false,
      quality: 'medium',
      aspectRatio: ASPECT_RATIOS.square
    })
}

/**
 * Performance monitoring for images
 */
export function trackImagePerformance(imageElement: HTMLImageElement) {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === imageElement.src && entry.entryType === 'resource') {
        const resourceEntry = entry as PerformanceResourceTiming
        console.log(`Image loaded: ${entry.name}`, {
          loadTime: entry.duration,
          size: resourceEntry.transferSize,
          cached: resourceEntry.transferSize === 0
        })
      }
    }
  })

  observer.observe({ entryTypes: ['resource'] })
}

/**
 * Intersection Observer for lazy loading enhancements
 */
export function createImageIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px 0px', // Start loading 50px before image comes into view
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * WebP/AVIF support detection
 */
export function detectImageFormatSupport(): Promise<{
  webp: boolean
  avif: boolean
}> {
  return new Promise((resolve) => {
    const webpTest = new Image()
    const avifTest = new Image()
    
    let results = { webp: false, avif: false }
    let completed = 0

    const checkComplete = () => {
      completed++
      if (completed === 2) {
        resolve(results)
      }
    }

    webpTest.onload = () => {
      results.webp = true
      checkComplete()
    }
    webpTest.onerror = () => checkComplete()
    webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'

    avifTest.onload = () => {
      results.avif = true
      checkComplete()
    }
    avifTest.onerror = () => checkComplete()
    avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI='
  })
}

/**
 * Image optimization middleware for debugging
 */
export function logImageOptimization(
  src: string,
  config: ImageConfig,
  context: string
) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🖼️  Image Optimization: ${context}`)
    console.log('Source:', src)
    console.log('Config:', config)
    console.log('Estimated savings:', config.quality && config.quality < 90 ? 'High' : 'Medium')
    console.groupEnd()
  }
} 