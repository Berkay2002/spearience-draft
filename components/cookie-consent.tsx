'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnalytics } from '@/lib/analytics'
import { useLocale } from '@/hooks/use-content'
import { X, Cookie, Settings } from 'lucide-react'

interface CookieConsentProps {
  className?: string
}

// Cookie consent status
type ConsentStatus = 'pending' | 'accepted' | 'rejected'

// Cookie categories
interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const CONSENT_COOKIE_NAME = 'cookie-consent'
const PREFERENCES_COOKIE_NAME = 'cookie-preferences'

export function CookieConsent({ className }: CookieConsentProps) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending')
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true - required for basic functionality
    analytics: false,
    marketing: false,
  })
  
  const { grantConsent, revokeConsent } = useAnalytics()
  const locale = useLocale()

  // Content based on locale
  const content = {
    en: {
      title: 'Cookie Preferences',
      description: 'We use cookies to enhance your browsing experience and analyze our traffic. You can choose which cookies to accept.',
      necessary: 'Necessary',
      necessaryDesc: 'Required for basic website functionality',
      analytics: 'Analytics',
      analyticsDesc: 'Help us understand how visitors interact with our website',
      marketing: 'Marketing',
      marketingDesc: 'Used to deliver targeted advertising',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      savePreferences: 'Save Preferences',
      customizeSettings: 'Customize Settings',
      close: 'Close',
    },
    sv: {
      title: 'Cookie-inställningar',
      description: 'Vi använder cookies för att förbättra din upplevelse och analysera vår trafik. Du kan välja vilka cookies du vill acceptera.',
      necessary: 'Nödvändiga',
      necessaryDesc: 'Krävs för grundläggande webbplatsfunktionalitet',
      analytics: 'Analys',
      analyticsDesc: 'Hjälper oss förstå hur besökare interagerar med vår webbplats',
      marketing: 'Marknadsföring',
      marketingDesc: 'Används för att leverera riktad reklam',
      acceptAll: 'Acceptera alla',
      rejectAll: 'Avvisa alla',
      savePreferences: 'Spara inställningar',
      customizeSettings: 'Anpassa inställningar',
      close: 'Stäng',
    }
  }

  const t = content[locale as keyof typeof content] || content.en

  // Check existing consent on mount
  useEffect(() => {
    const consent = getCookie(CONSENT_COOKIE_NAME)
    const savedPreferences = getCookie(PREFERENCES_COOKIE_NAME)
    
    if (consent) {
      setConsentStatus(consent as ConsentStatus)
      if (savedPreferences) {
        const prefs = JSON.parse(savedPreferences)
        setPreferences(prefs)
        // Apply analytics consent based on saved preferences
        if (prefs.analytics) {
          grantConsent()
        } else {
          revokeConsent()
        }
      }
    } else {
      // Show banner if no consent has been given
      setShowBanner(true)
    }
  }, [grantConsent, revokeConsent])

  // Cookie utility functions
  function setCookie(name: string, value: string, days: number = 365) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
  }

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  // Handle consent actions
  function handleAcceptAll() {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    saveConsent('accepted', newPreferences)
    grantConsent()
    setShowBanner(false)
  }

  function handleRejectAll() {
    const newPreferences = {
      necessary: true, // Always required
      analytics: false,
      marketing: false,
    }
    saveConsent('rejected', newPreferences)
    revokeConsent()
    setShowBanner(false)
  }

  function handleSavePreferences() {
    const status = preferences.analytics || preferences.marketing ? 'accepted' : 'rejected'
    saveConsent(status, preferences)
    
    if (preferences.analytics) {
      grantConsent()
    } else {
      revokeConsent()
    }
    
    setShowBanner(false)
    setShowPreferences(false)
  }

  function saveConsent(status: ConsentStatus, prefs: CookiePreferences) {
    setConsentStatus(status)
    setPreferences(prefs)
    setCookie(CONSENT_COOKIE_NAME, status)
    setCookie(PREFERENCES_COOKIE_NAME, JSON.stringify(prefs))
  }

  function togglePreference(category: keyof CookiePreferences) {
    if (category === 'necessary') return // Cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // Don't render if consent has been given and banner is hidden
  if (!showBanner && !showPreferences) {
    return null
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground">
                    {t.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPreferences(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t.customizeSettings}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRejectAll}
                >
                  {t.rejectAll}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                >
                  {t.acceptAll}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {t.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t.necessary}</h4>
                  <p className="text-sm text-muted-foreground">{t.necessaryDesc}</p>
                </div>
                <div className="text-sm text-muted-foreground">Always On</div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t.analytics}</h4>
                  <p className="text-sm text-muted-foreground">{t.analyticsDesc}</p>
                </div>
                <Button
                  variant={preferences.analytics ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('analytics')}
                >
                  {preferences.analytics ? 'On' : 'Off'}
                </Button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t.marketing}</h4>
                  <p className="text-sm text-muted-foreground">{t.marketingDesc}</p>
                </div>
                <Button
                  variant={preferences.marketing ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('marketing')}
                >
                  {preferences.marketing ? 'On' : 'Off'}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="flex-1"
              >
                {t.rejectAll}
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="flex-1"
              >
                {t.savePreferences}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

// Hook to manage cookie consent from other components
export function useCookieConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending')

  useEffect(() => {
    const consent = getCookie(CONSENT_COOKIE_NAME)
    if (consent) {
      setConsentStatus(consent as ConsentStatus)
    }
  }, [])

  function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  return {
    consentStatus,
    hasConsented: consentStatus !== 'pending',
    hasAcceptedAnalytics: consentStatus === 'accepted',
  }
} 