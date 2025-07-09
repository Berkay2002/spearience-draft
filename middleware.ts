import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

// Import centralized i18n configuration
const i18nConfig = require('./i18nConfig')

// Type-safe exports
export const locales = i18nConfig.locales as readonly string[]
export const defaultLocale = i18nConfig.defaultLocale as string
export const localeCookie = i18nConfig.localeCookie as string

export type Locale = typeof locales[number]

// Get the preferred locale using proper locale matching
function getLocale(request: NextRequest): Locale {
  // 1. Check for locale in cookie first (user preference)
  const cookieLocale = request.cookies.get(localeCookie)?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale as Locale
  }

  // 2. Use Accept-Language header with proper locale matching
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    try {
      const headers = { 'accept-language': acceptLanguage }
      const languages = new Negotiator({ headers }).languages()
      const bestMatch = match(languages, locales, defaultLocale)
      return bestMatch as Locale
    } catch (error) {
      console.warn('Locale matching failed:', error)
    }
  }

  // 3. Fallback to default locale
  return defaultLocale as Locale
}

// Check if pathname has a locale
function pathnameIsMissingLocale(pathname: string): boolean {
  return locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
}

// Extract locale from pathname
function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (locales.includes(potentialLocale)) {
    return potentialLocale as Locale
  }
  
  return null
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()

  // Skip middleware for API routes, static files, etc.
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return response
  }

  // Check if the pathname is missing a locale
  if (pathnameIsMissingLocale(pathname)) {
    const locale = getLocale(request)
    
    // Redirect to the same URL with locale prefix
    const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    
    // Set locale cookie on redirect using config options
    redirectResponse.cookies.set(localeCookie, locale, {
      ...i18nConfig.cookieOptions,
      secure: process.env.NODE_ENV === 'production'
    })
    
    return redirectResponse
  }

  // Extract locale from current pathname
  const currentLocale = getLocaleFromPathname(pathname)
  if (currentLocale) {
    // Update locale cookie if different (user navigated to different locale)
    const cookieLocale = request.cookies.get(localeCookie)?.value
    
    if (i18nConfig.serverSetCookie === 'always' || 
        (i18nConfig.serverSetCookie === 'if-empty' && !cookieLocale)) {
      if (cookieLocale !== currentLocale) {
        response.cookies.set(localeCookie, currentLocale, {
          ...i18nConfig.cookieOptions,
          secure: process.env.NODE_ENV === 'production'
        })
      }
    }
    
    // Add locale to response headers for use in components
    response.headers.set('x-locale', currentLocale)
  }

  return response
}

export const config = {
  // Improved matcher that handles all routes properly
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
} 