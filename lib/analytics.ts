import { analyticsConfig, siteConfig } from './env'

// Google Analytics types
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: Record<string, any>[]
  }
}

// Analytics event types
export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

// Common event categories
export const EventCategories = {
  ENGAGEMENT: 'engagement',
  CONTACT: 'contact',
  NAVIGATION: 'navigation',
  PROJECT: 'project',
  LANGUAGE: 'language',
} as const

// Common event actions
export const EventActions = {
  // Contact events
  FORM_SUBMIT: 'form_submit',
  FORM_SUCCESS: 'form_success',
  FORM_ERROR: 'form_error',
  EMAIL_CLICK: 'email_click',
  
  // Navigation events
  PAGE_VIEW: 'page_view',
  LINK_CLICK: 'link_click',
  CTA_CLICK: 'cta_click',
  
  // Project events
  PROJECT_VIEW: 'project_view',
  PROJECT_CLICK: 'project_click',
  
  // Language events
  LANGUAGE_SWITCH: 'language_switch',
  
  // Engagement events
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  VIDEO_PLAY: 'video_play',
} as const

// Initialize Google Analytics
export function initializeAnalytics() {
  if (!analyticsConfig.ga.isConfigured || !analyticsConfig.ga.measurementId) {
    if (siteConfig.debug) {
      console.log('Google Analytics not configured, skipping initialization')
    }
    return false
  }

  try {
    // Load gtag script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga.measurementId}`
    document.head.appendChild(script)

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }

    // Configure Google Analytics
    window.gtag('js', new Date())
    window.gtag('config', analyticsConfig.ga.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      // GDPR compliance - wait for consent
      send_page_view: false,
    })

    if (siteConfig.debug) {
      console.log('Google Analytics initialized:', analyticsConfig.ga.measurementId)
    }

    return true
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error)
    return false
  }
}

// Grant analytics consent (GDPR compliance)
export function grantAnalyticsConsent() {
  if (!window.gtag || !analyticsConfig.ga.measurementId) {
    return
  }

  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
  })

  // Send initial page view after consent
  trackPageView()

  if (siteConfig.debug) {
    console.log('Analytics consent granted')
  }
}

// Revoke analytics consent
export function revokeAnalyticsConsent() {
  if (!window.gtag) {
    return
  }

  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
  })

  if (siteConfig.debug) {
    console.log('Analytics consent revoked')
  }
}

// Track page views
export function trackPageView(url?: string) {
  if (!window.gtag || !analyticsConfig.ga.measurementId) {
    return
  }

  const pageUrl = url || window.location.pathname + window.location.search

  window.gtag('config', analyticsConfig.ga.measurementId, {
    page_path: pageUrl,
    page_title: document.title,
    page_location: window.location.href,
  })

  if (siteConfig.debug) {
    console.log('Page view tracked:', pageUrl)
  }
}

// Track custom events
export function trackEvent(event: AnalyticsEvent) {
  if (!window.gtag || !analyticsConfig.ga.measurementId) {
    if (siteConfig.debug) {
      console.log('Event would be tracked:', event)
    }
    return
  }

  window.gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  })

  if (siteConfig.debug) {
    console.log('Event tracked:', event)
  }
}

// Predefined tracking functions for common events
export const analytics = {
  // Contact form events
  contactFormSubmit: (locale: string) =>
    trackEvent({
      action: EventActions.FORM_SUBMIT,
      category: EventCategories.CONTACT,
      label: locale,
    }),

  contactFormSuccess: (locale: string) =>
    trackEvent({
      action: EventActions.FORM_SUCCESS,
      category: EventCategories.CONTACT,
      label: locale,
    }),

  contactFormError: (error: string, locale: string) =>
    trackEvent({
      action: EventActions.FORM_ERROR,
      category: EventCategories.CONTACT,
      label: `${locale}:${error}`,
    }),

  emailClick: (locale: string) =>
    trackEvent({
      action: EventActions.EMAIL_CLICK,
      category: EventCategories.CONTACT,
      label: locale,
    }),

  // Navigation events
  ctaClick: (ctaName: string, locale: string) =>
    trackEvent({
      action: EventActions.CTA_CLICK,
      category: EventCategories.NAVIGATION,
      label: `${ctaName}:${locale}`,
    }),

  linkClick: (linkName: string, locale: string) =>
    trackEvent({
      action: EventActions.LINK_CLICK,
      category: EventCategories.NAVIGATION,
      label: `${linkName}:${locale}`,
    }),

  // Project events
  projectView: (projectId: string, locale: string) =>
    trackEvent({
      action: EventActions.PROJECT_VIEW,
      category: EventCategories.PROJECT,
      label: `${projectId}:${locale}`,
    }),

  projectClick: (projectId: string, locale: string) =>
    trackEvent({
      action: EventActions.PROJECT_CLICK,
      category: EventCategories.PROJECT,
      label: `${projectId}:${locale}`,
    }),

  // Language events
  languageSwitch: (fromLocale: string, toLocale: string) =>
    trackEvent({
      action: EventActions.LANGUAGE_SWITCH,
      category: EventCategories.LANGUAGE,
      label: `${fromLocale}->${toLocale}`,
    }),

  // Engagement events
  scrollDepth: (percentage: number, locale: string) =>
    trackEvent({
      action: EventActions.SCROLL_DEPTH,
      category: EventCategories.ENGAGEMENT,
      label: locale,
      value: percentage,
    }),
}

// Hook for Next.js App Router
export function useAnalytics() {
  return {
    trackEvent,
    trackPageView,
    grantConsent: grantAnalyticsConsent,
    revokeConsent: revokeAnalyticsConsent,
    analytics,
  }
} 