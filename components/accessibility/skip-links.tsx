'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ariaLabels } from '@/lib/accessibility'
import { useAccessibilityContent } from '@/hooks/use-content'

interface SkipLinksProps {
  className?: string
}

/**
 * Skip Links component for keyboard navigation accessibility
 * Allows users to quickly jump to main content areas
 * Required for WCAG 2.1 AA compliance
 */
export function SkipLinks({ className }: SkipLinksProps) {
  const accessibilityContent = useAccessibilityContent()
  
  const skipLinks = [
    {
      href: '#main-content',
      label: accessibilityContent?.skipLinks?.skipToMain || 'Skip to main content',
    },
    {
      href: '#main-navigation',
      label: accessibilityContent?.skipLinks?.skipToNavigation || 'Skip to navigation',
    },
    {
      href: '#footer',
      label: accessibilityContent?.skipLinks?.skipToFooter || 'Skip to footer',
    },
  ]

  return (
    <div className={cn('skip-links', className)}>
      {skipLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            // Visually hidden by default
            'absolute left-[-10000px] top-auto w-1 h-1 overflow-hidden',
            // Visible when focused
            'focus:left-6 focus:top-6 focus:w-auto focus:h-auto focus:overflow-visible',
            // Styling when visible
            'focus:bg-primary focus:text-primary-foreground focus:p-2 focus:rounded-md focus:z-50',
            'focus:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            // Typography
            'text-sm font-medium',
            // Transition
            'transition-all duration-200'
          )}
          aria-label={link.label}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

/**
 * Visual focus indicator for debugging (development only)
 */
export function FocusIndicator() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <style jsx global>{`
      /* Enhanced focus indicators for development */
      *:focus {
        outline: 3px solid #667eea !important;
        outline-offset: 2px !important;
      }
      
      /* Skip links visibility in development */
      .skip-links a {
        position: relative !important;
        left: auto !important;
        width: auto !important;
        height: auto !important;
        background: #667eea !important;
        color: white !important;
        padding: 0.5rem !important;
        margin-right: 0.5rem !important;
        border-radius: 0.25rem !important;
        text-decoration: none !important;
      }
    `}</style>
  )
} 