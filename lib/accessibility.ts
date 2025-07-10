/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 * Provides ARIA helpers, focus management, and screen reader support
 */

import { useEffect, useRef, RefObject } from 'react'

// WCAG 2.1 AA Color Contrast Ratios
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,    // Normal text
  AA_LARGE: 3,       // Large text (18pt+ or 14pt+ bold)
  AAA_NORMAL: 7,     // Enhanced contrast normal text
  AAA_LARGE: 4.5,    // Enhanced contrast large text
}

/**
 * Generate unique IDs for ARIA relationships
 */
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * ARIA label helpers for common patterns
 */
export const ariaLabels = {
  // Navigation
  mainNavigation: 'Main navigation',
  breadcrumb: 'Breadcrumb navigation',
  pagination: 'Pagination navigation',
  skipToContent: 'Skip to main content',
  
  // Actions
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  openModal: 'Open modal',
  closeModal: 'Close modal',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  
  // Forms
  required: 'Required field',
  optional: 'Optional field',
  errorMessage: 'Error message',
  helpText: 'Help text',
  
  // Content
  readMore: 'Read more about',
  viewProject: 'View project details',
  downloadFile: 'Download file',
  externalLink: 'Opens in new window',
  
  // Status
  loading: 'Loading content',
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
} as const

/**
 * ARIA roles for semantic markup
 */
export const ariaRoles = {
  // Landmark roles
  banner: 'banner',
  navigation: 'navigation',
  main: 'main',
  complementary: 'complementary',
  contentinfo: 'contentinfo',
  search: 'search',
  
  // Widget roles
  button: 'button',
  tab: 'tab',
  tabpanel: 'tabpanel',
  tablist: 'tablist',
  dialog: 'dialog',
  alert: 'alert',
  alertdialog: 'alertdialog',
  
  // Document structure
  article: 'article',
  heading: 'heading',
  img: 'img',
  list: 'list',
  listitem: 'listitem',
} as const

/**
 * Live region announcements for screen readers
 */
export function announceToScreenReader(
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof window === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.setAttribute('class', 'sr-only')
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusStack: HTMLElement[] = []

  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement) {
      this.focusStack.push(activeElement)
    }
  }

  static restoreFocus(): void {
    const previousElement = this.focusStack.pop()
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  }

  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    // Focus first element
    firstElement?.focus()

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }
}

/**
 * Hook for managing focus trap in modals/dialogs
 */
export function useFocusTrap(isActive: boolean): RefObject<HTMLDivElement> {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Save current focus
    FocusManager.saveFocus()

    // Set up focus trap
    const cleanup = FocusManager.trapFocus(containerRef.current)

    return () => {
      cleanup()
      // Restore focus when modal closes
      FocusManager.restoreFocus()
    }
  }, [isActive])

  return containerRef
}

/**
 * Hook for managing keyboard navigation
 */
export function useKeyboardNavigation(
  onEscape?: () => void,
  onEnter?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.()
          break
        case 'Enter':
          onEnter?.()
          break
        case 'ArrowUp':
          event.preventDefault()
          onArrowKeys?.('up')
          break
        case 'ArrowDown':
          event.preventDefault()
          onArrowKeys?.('down')
          break
        case 'ArrowLeft':
          event.preventDefault()
          onArrowKeys?.('left')
          break
        case 'ArrowRight':
          event.preventDefault()
          onArrowKeys?.('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, onEnter, onArrowKeys])
}

/**
 * Color contrast checker for WCAG compliance
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Convert colors to RGB values
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0

  // Calculate relative luminance
  const l1 = getRelativeLuminance(rgb1)
  const l2 = getRelativeLuminance(rgb2)

  // Calculate contrast ratio
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function getRelativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function meetsWCAGAA(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background)
  const requiredRatio = isLargeText ? CONTRAST_RATIOS.AA_LARGE : CONTRAST_RATIOS.AA_NORMAL
  return ratio >= requiredRatio
}

/**
 * Screen reader optimized text formatting
 */
export function formatForScreenReader(text: string, options?: {
  removeSpecialChars?: boolean
  expandAbbreviations?: boolean
}): string {
  let formatted = text

  if (options?.removeSpecialChars) {
    // Remove special characters that don't add meaning
    formatted = formatted.replace(/[^\w\s]/gi, ' ')
  }

  if (options?.expandAbbreviations) {
    // Expand common abbreviations
    const abbreviations: Record<string, string> = {
      'CEO': 'Chief Executive Officer',
      'CTO': 'Chief Technology Officer',
      'PM': 'Project Manager',
      'QA': 'Quality Assurance',
      'UI': 'User Interface',
      'UX': 'User Experience',
    }

    Object.entries(abbreviations).forEach(([abbr, expansion]) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi')
      formatted = formatted.replace(regex, expansion)
    })
  }

  return formatted.trim()
}

/**
 * Generate accessible heading hierarchy
 */
export function getHeadingLevel(currentLevel: number, maxLevel: number = 6): number {
  return Math.min(Math.max(currentLevel, 1), maxLevel)
}

/**
 * Validate ARIA attributes
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const errors: string[] = []
  
  // Check for common ARIA errors
  const describedBy = element.getAttribute('aria-describedby')
  if (describedBy) {
    const referencedElements = describedBy.split(' ')
    referencedElements.forEach(id => {
      if (!document.getElementById(id)) {
        errors.push(`aria-describedby references non-existent element: ${id}`)
      }
    })
  }

  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy) {
    const referencedElements = labelledBy.split(' ')
    referencedElements.forEach(id => {
      if (!document.getElementById(id)) {
        errors.push(`aria-labelledby references non-existent element: ${id}`)
      }
    })
  }

  return errors
}

/**
 * Accessibility testing helpers for development
 */
export const a11yTesting = {
  // Log accessibility violations in development
  logViolations: (component: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 Accessibility Check: ${component}`)
      // This would integrate with axe-core in a real implementation
      console.log('Run axe-core accessibility tests here')
      console.groupEnd()
    }
  },

  // Check for missing alt text on images
  checkImages: () => {
    if (process.env.NODE_ENV === 'development') {
      const images = document.querySelectorAll('img:not([alt])')
      if (images.length > 0) {
        console.warn(`🚨 ${images.length} images missing alt text:`, images)
      }
    }
  },

  // Check for proper heading hierarchy
  checkHeadings: () => {
    if (process.env.NODE_ENV === 'development') {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let previousLevel = 0
      const violations: string[] = []

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        
        if (index === 0 && level !== 1) {
          violations.push('First heading should be h1')
        }
        
        if (level > previousLevel + 1) {
          violations.push(`Heading level jumps from h${previousLevel} to h${level}`)
        }
        
        previousLevel = level
      })

      if (violations.length > 0) {
        console.warn('🚨 Heading hierarchy violations:', violations)
      }
    }
  }
} 