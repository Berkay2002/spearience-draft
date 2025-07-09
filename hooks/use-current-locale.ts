'use client'

import { usePathname } from 'next/navigation'
import { type Locale } from '@/middleware'

// Import centralized i18n configuration
const i18nConfig = require('../i18nConfig')

/**
 * Hook to get the current locale in client components
 * Similar to next-i18n-router's useCurrentLocale hook
 */
export function useCurrentLocale(): Locale {
  const pathname = usePathname()
  
  // Extract locale from pathname
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (i18nConfig.locales.includes(potentialLocale)) {
    return potentialLocale as Locale
  }
  
  // Fallback to default locale
  return i18nConfig.defaultLocale as Locale
}

/**
 * Hook to get locale information and utilities
 */
export function useLocaleInfo() {
  const currentLocale = useCurrentLocale()
  
  return {
    locale: currentLocale,
    locales: i18nConfig.locales as Locale[],
    defaultLocale: i18nConfig.defaultLocale as Locale,
    isDefault: currentLocale === i18nConfig.defaultLocale,
  }
} 