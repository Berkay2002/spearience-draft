import { type Locale, locales, defaultLocale } from '../middleware'

export { type Locale, locales, defaultLocale }

// Dictionary type for translations
export type Dictionary = {
  [key: string]: string | Dictionary
}

// Get locale from URL pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale
  }
  
  return defaultLocale
}

// Remove locale from pathname
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (locales.includes(potentialLocale as Locale)) {
    return '/' + segments.slice(2).join('/')
  }
  
  return pathname
}

// Add locale to pathname
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPathname(pathname)
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}

// Check if locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Get alternate language URL
export function getAlternateLocaleUrl(currentPath: string, targetLocale: Locale): string {
  const pathWithoutLocale = removeLocaleFromPathname(currentPath)
  return addLocaleToPathname(pathWithoutLocale, targetLocale)
}

// Get language display names
export const languageNames: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  sv: { native: 'Svenska', english: 'Swedish' }
} 