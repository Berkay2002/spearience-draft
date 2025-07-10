'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useCallback, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { 
  createResponsiveImageProps, 
  IMAGE_SIZES, 
  trackImagePerformance, 
  logImageOptimization,
  type ImageConfig
} from '@/lib/image-optimization'

/**
 * Enhanced image component with performance optimizations
 */
interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt' | 'sizes'> {
  src: string
  alt: string
  context?: keyof typeof IMAGE_SIZES
  enablePerformanceTracking?: boolean
  enableErrorBoundary?: boolean
  fallbackSrc?: string
  aspectRatio?: number
  responsiveSizes?: string
  onLoadComplete?: () => void
  onImageError?: () => void
}

/**
 * Optimized Image component with automatic performance enhancements
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    context = 'gallery',
    enablePerformanceTracking = process.env.NODE_ENV === 'development',
    enableErrorBoundary = true,
    fallbackSrc = '/placeholder.jpg',
    aspectRatio,
    responsiveSizes,
    onLoadComplete,
    onImageError,
    className,
    ...props
  }, ref) => {
    const [imageError, setImageError] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Generate optimized props based on context
    const { src: _src, alt: _alt, ...optimizedProps } = createResponsiveImageProps(src, alt, context, {
      priority: props.priority,
      quality: 'high',
      aspectRatio,
      customSizes: responsiveSizes,
      useBlur: true,
      fill: props.fill,
      width: props.width as number,
      height: props.height as number,
    })

    // Log optimization in development
    if (process.env.NODE_ENV === 'development') {
      logImageOptimization(src, optimizedProps as ImageConfig, context)
    }

    // Handle image load completion
    const handleLoadingComplete = useCallback((result: any) => {
      setIsLoaded(true)
      
      // Track performance if enabled
      if (enablePerformanceTracking && ref && 'current' in ref && ref.current) {
        trackImagePerformance(ref.current)
      }
      
      onLoadComplete?.()
      props.onLoadingComplete?.(result)
    }, [enablePerformanceTracking, onLoadComplete, props, ref])

    // Handle image errors via onError event
    const handleImageError = useCallback(() => {
      if (enableErrorBoundary) {
        setImageError(true)
      }
      
      onImageError?.()
    }, [enableErrorBoundary, onImageError])

    // If image failed and we have a fallback
    if (imageError && fallbackSrc && enableErrorBoundary) {
      return (
        <Image
          ref={ref}
          src={fallbackSrc}
          alt={`${alt} (fallback)`}
          className={cn('opacity-75', className)}
          onLoadingComplete={handleLoadingComplete}
          {...optimizedProps}
          {...props}
        />
      )
    }

    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        {...optimizedProps}
        className={cn(
          'transition-opacity duration-300',
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100',
          className
        )}
        onLoadingComplete={handleLoadingComplete}
        onError={handleImageError}
        {...props}
      />
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

/**
 * Specific image components for common use cases
 */

export const HeroImage = forwardRef<HTMLImageElement, Omit<OptimizedImageProps, 'context'>>(
  (props, ref) => (
    <OptimizedImage
      ref={ref}
      context="hero"
      priority
      {...props}
    />
  )
)
HeroImage.displayName = 'HeroImage'

export const ProfileImage = forwardRef<HTMLImageElement, Omit<OptimizedImageProps, 'context'>>(
  (props, ref) => (
    <OptimizedImage
      ref={ref}
      context="profile"
      aspectRatio={4/5}
      {...props}
    />
  )
)
ProfileImage.displayName = 'ProfileImage'

export const GalleryImage = forwardRef<HTMLImageElement, Omit<OptimizedImageProps, 'context'>>(
  (props, ref) => (
    <OptimizedImage
      ref={ref}
      context="gallery"
      {...props}
    />
  )
)
GalleryImage.displayName = 'GalleryImage'

export const CardImage = forwardRef<HTMLImageElement, Omit<OptimizedImageProps, 'context'>>(
  (props, ref) => (
    <OptimizedImage
      ref={ref}
      context="card"
      {...props}
    />
  )
)
CardImage.displayName = 'CardImage'

export const ThumbnailImage = forwardRef<HTMLImageElement, Omit<OptimizedImageProps, 'context'>>(
  (props, ref) => (
    <OptimizedImage
      ref={ref}
      context="thumbnail"
      aspectRatio={1}
      {...props}
    />
  )
)
ThumbnailImage.displayName = 'ThumbnailImage'

/**
 * Lazy loading image component with intersection observer
 */
interface LazyImageProps extends OptimizedImageProps {
  rootMargin?: string
  threshold?: number
}

export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  ({ rootMargin = '50px', threshold = 0.1, ...props }, ref) => {
    const [isInView, setIsInView] = useState(false)

    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setIsInView(true)
      }
    }, [])

    // Set up intersection observer
    const imageRef = useCallback((node: HTMLImageElement) => {
      if (node && !isInView) {
        const observer = new IntersectionObserver(handleIntersection, {
          rootMargin,
          threshold,
        })
        observer.observe(node)
        return () => observer.disconnect()
      }
    }, [handleIntersection, isInView, rootMargin, threshold])

    // Combine refs
    const combinedRef = useCallback((node: HTMLImageElement) => {
      imageRef(node)
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [imageRef, ref])

    if (!isInView) {
      return (
        <div
          ref={combinedRef}
          className={cn(
            'bg-muted animate-pulse',
            props.className
          )}
          style={{
            width: props.width,
            height: props.height,
            aspectRatio: props.aspectRatio,
          }}
        />
      )
    }

    return <OptimizedImage ref={combinedRef} {...props} />
  }
)
LazyImage.displayName = 'LazyImage'

/**
 * Progressive image component with multiple quality levels
 */
interface ProgressiveImageProps extends OptimizedImageProps {
  lowQualitySrc?: string
  mediumQualitySrc?: string
}

export const ProgressiveImage = forwardRef<HTMLImageElement, ProgressiveImageProps>(
  ({ lowQualitySrc, mediumQualitySrc, ...props }, ref) => {
    const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || props.src)
    const [loadedSources, setLoadedSources] = useState<string[]>([])

    // Preload higher quality images
    const preloadNextQuality = useCallback((src: string) => {
      const img = new window.Image()
      img.onload = () => {
        setLoadedSources(prev => [...prev, src])
        setCurrentSrc(src)
      }
      img.src = src
    }, [])

    // Start progressive loading
    const handleLoadComplete = useCallback(() => {
      if (mediumQualitySrc && !loadedSources.includes(mediumQualitySrc)) {
        preloadNextQuality(mediumQualitySrc)
      } else if (!loadedSources.includes(props.src)) {
        preloadNextQuality(props.src)
      }
      props.onLoadComplete?.()
    }, [mediumQualitySrc, loadedSources, props, preloadNextQuality])

    return (
      <OptimizedImage
        ref={ref}
        {...props}
        src={currentSrc}
        onLoadComplete={handleLoadComplete}
        className={cn(
          'transition-all duration-500',
          currentSrc === lowQualitySrc && 'blur-sm scale-105',
          currentSrc === mediumQualitySrc && 'blur-[1px] scale-102',
          currentSrc === props.src && 'blur-0 scale-100',
          props.className
        )}
      />
    )
  }
)
ProgressiveImage.displayName = 'ProgressiveImage' 