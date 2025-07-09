'use client'

import * as React from 'react'
import Link from 'next/link'
import { useContent } from '@/hooks/use-content'
import { useCurrentLocale } from '@/hooks/use-current-locale'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin,
  ExternalLink
} from 'lucide-react'

// Social media icons mapping
const SocialIcons = {
  linkedin: Linkedin,
  twitter: Twitter,
  github: (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const content = useContent()
  const currentLocale = useCurrentLocale()

  if (!content) {
    return (
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </footer>
    )
  }

  const { footer, contact, navigation } = content

  return (
    <footer className={`bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <Link 
                  href={`/${currentLocale}`}
                  className="text-2xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {navigation?.logo || 'Chrish Fernando'}
                </Link>
                <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-md">
                  {currentLocale === 'sv' 
                    ? 'Transformerar team och projekt genom beprövade ledarskapsmetoder, strategisk mentorskap och innovativa idrottsinspirerade tillvägagångssätt för professionell utveckling.'
                    : 'Transforming teams and projects through proven leadership methodologies, strategic mentorship, and innovative sports-inspired approaches to professional development.'}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <a 
                    href={`mailto:${contact.email}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>{contact.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {currentLocale === 'sv' ? 'Navigering' : 'Navigation'}
            </h3>
            <nav className="space-y-3">
              {navigation?.menu?.map((item) => (
                <Link
                  key={item.href}
                  href={`/${currentLocale}${item.href === '/' ? '' : item.href}`}
                  className="block text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media & Theme */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {currentLocale === 'sv' ? 'Anslut' : 'Connect'}
            </h3>
            
            <div className="space-y-4">
              {/* Social Media Links */}
              <div className="flex space-x-3">
                {contact.socialMedia?.map((social) => {
                  const IconComponent = SocialIcons[social.icon as keyof typeof SocialIcons]
                  if (!IconComponent) return null
                  
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 group"
                      aria-label={`Follow on ${social.platform}`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 absolute translate-x-2 -translate-y-2 transition-opacity" />
                    </a>
                  )
                })}
              </div>

              {/* Theme Toggle */}
              <div className="pt-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {currentLocale === 'sv' ? 'Tema:' : 'Theme:'}
                  </span>
                  <ThemeToggle className="w-12 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {footer?.copyright || '© 2024 Chrish Fernando. All rights reserved.'}
          </div>
          
          <div className="flex flex-wrap gap-6">
            {footer?.links?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sm h-auto p-0 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Link href={`/${currentLocale}/contact`}>
                {currentLocale === 'sv' ? 'Kontakt' : 'Contact'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
} 