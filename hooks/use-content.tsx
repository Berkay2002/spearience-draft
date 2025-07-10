'use client'

import { useParams } from 'next/navigation'
import { type Locale } from '@/lib/i18n'
import { getContentSync, getContentSectionSync, type SiteContent } from '@/lib/content'
import { useMemo } from 'react'

// Hook to get the current locale from URL params
export function useLocale(): Locale {
  const params = useParams()
  return (params?.locale as Locale) || 'en'
}

// Hook to get all content for the current locale
export function useContent(): SiteContent {
  const locale = useLocale()
  
  return useMemo(() => {
    try {
      return getContentSync(locale)
    } catch (error) {
      console.error(`Failed to load content for locale ${locale}:`, error)
      // Fallback to English content
      return getContentSync('en')
    }
  }, [locale])
}

// Hook to get a specific section of content
export function useContentSection<T extends keyof SiteContent>(
  section: T
): SiteContent[T] {
  const locale = useLocale()
  
  return useMemo(() => {
    try {
      return getContentSectionSync(locale, section)
    } catch (error) {
      console.error(`Failed to load ${section} content for locale ${locale}:`, error)
      // Fallback to English content
      return getContentSectionSync('en', section)
    }
  }, [locale, section])
}

// Specific hooks for common content sections
export function useHeroContent() {
  return useContentSection('hero')
}

export function useExpertiseContent() {
  return useContentSection('expertise')
}

export function useProcessContent() {
  return useContentSection('process')
}

export function useTestimonialsContent() {
  return useContentSection('testimonials')
}

export function useFeaturedWorkContent() {
  return useContentSection('featuredWork')
}

export function useBioContent() {
  return useContentSection('bio')
}

export function useCredentialsContent() {
  return useContentSection('credentials')
}

export function useContactContent() {
  return useContentSection('contact')
}

export function useNavigationContent() {
  return useContentSection('navigation')
}

export function useFooterContent() {
  return useContentSection('footer')
}

export function useImpactContent() {
  return useContentSection('impact')
}

export function useProjectCaseStudyContent() {
  return useContentSection('projectCaseStudy')
}

export function useAccessibilityContent() {
  return useContentSection('accessibility')
} 