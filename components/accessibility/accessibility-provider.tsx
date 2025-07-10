'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { a11yTesting, announceToScreenReader } from '@/lib/accessibility'

interface AccessibilityContextType {
  isHighContrast: boolean
  isReducedMotion: boolean
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void
  checkAccessibility: (component: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

interface AccessibilityProviderProps {
  children: ReactNode
}

/**
 * Accessibility Provider component that manages accessibility features
 * and provides WCAG 2.1 AA compliance utilities throughout the app
 */
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Detect user preferences on mount
  useEffect(() => {
    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(highContrastQuery.matches)
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
      announceToScreenReader(
        e.matches ? 'High contrast mode enabled' : 'High contrast mode disabled',
        'polite'
      )
    }
    
    highContrastQuery.addEventListener('change', handleHighContrastChange)

    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(reducedMotionQuery.matches)
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
      announceToScreenReader(
        e.matches ? 'Reduced motion enabled' : 'Reduced motion disabled',
        'polite'
      )
    }
    
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    // Cleanup listeners
    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
    }
  }, [])

  // Run accessibility checks in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Check for accessibility issues periodically
      const checkInterval = setInterval(() => {
        a11yTesting.checkImages()
        a11yTesting.checkHeadings()
      }, 10000) // Check every 10 seconds

      return () => clearInterval(checkInterval)
    }
  }, [])

  // Keyboard navigation setup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle escape key globally
      if (event.key === 'Escape') {
        // Check if any modal or overlay is open and close it
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]')
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="close"], [aria-label*="Close"]')
          if (closeButton instanceof HTMLElement) {
            closeButton.click()
          }
        }

        // Remove focus from any dropdown menus
        const activeDropdown = document.querySelector('[role="menu"][data-state="open"]')
        if (activeDropdown) {
          const trigger = document.querySelector('[aria-expanded="true"]')
          if (trigger instanceof HTMLElement) {
            trigger.focus()
          }
        }
      }

      // Handle Alt + M for main navigation skip
      if (event.altKey && event.key === 'm') {
        event.preventDefault()
        const mainNav = document.getElementById('main-navigation')
        if (mainNav) {
          const firstLink = mainNav.querySelector('a, button')
          if (firstLink instanceof HTMLElement) {
            firstLink.focus()
            announceToScreenReader('Navigated to main menu', 'assertive')
          }
        }
      }

      // Handle Alt + C for main content skip
      if (event.altKey && event.key === 'c') {
        event.preventDefault()
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.focus()
          announceToScreenReader('Navigated to main content', 'assertive')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Apply accessibility classes to body
  useEffect(() => {
    const body = document.body
    
    if (isHighContrast) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }

    if (isReducedMotion) {
      body.classList.add('reduced-motion')
    } else {
      body.classList.remove('reduced-motion')
    }
  }, [isHighContrast, isReducedMotion])

  const checkAccessibility = (component: string) => {
    if (process.env.NODE_ENV === 'development') {
      a11yTesting.logViolations(component)
    }
  }

  const contextValue: AccessibilityContextType = {
    isHighContrast,
    isReducedMotion,
    announceMessage: announceToScreenReader,
    checkAccessibility,
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      {/* Live region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="accessibility-announcements"
      />
    </AccessibilityContext.Provider>
  )
}

/**
 * Hook to access accessibility context
 */
export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
} 