import { NextRequest, NextResponse } from 'next/server'

// Supported locales
export const locales = ['en', 'sv'] as const
export const defaultLocale = 'en' as const

export type Locale = typeof locales[number]

// Get the preferred locale from the Accept-Language header
function getLocale(request: NextRequest): Locale {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Try to get locale from Accept-Language header
    const acceptLanguage = request.headers.get('Accept-Language')
    let locale: Locale = defaultLocale

    if (acceptLanguage) {
      // Simple locale detection - check for 'sv' in Accept-Language
      if (acceptLanguage.includes('sv')) {
        locale = 'sv'
      }
    }

    return locale
  }

  // Extract locale from pathname
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    // Handle root path
    if (pathname === '/') {
      return NextResponse.redirect(
        new URL(`/${locale}`, request.url)
      )
    }
    
    // Handle other paths
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }

  // Add locale to request headers for use in components
  const response = NextResponse.next()
  const locale = getLocale(request)
  response.headers.set('x-locale', locale)

  return response
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
} 