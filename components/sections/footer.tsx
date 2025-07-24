'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
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
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure component is mounted before accessing theme
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!content) {
    return (
      <footer className="bg-background py-16">
        <div className="container-professional">
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-4 bg-muted rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    )
  }

  const { footer, contact, navigation } = content
  const projects = content?.featuredWork?.projects || []
  const featuredProjects = projects.filter(project => project.featured)
  const otherProjects = projects.filter(project => !project.featured)

  return (
    <footer className={`relative bg-secondary/30 border-t border-border/50 overflow-hidden ${className}`}>
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container-professional">
        {/* Main Footer Content */}
        <div className="section-padding-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Logo & Social - Left Anchor */}
            <div className="lg:col-span-1 space-y-8">
              {/* Theme-aware Logo */}
              <div className="space-y-6">
                <Link 
                  href={`/${currentLocale}`}
                  className="block group flex justify-center lg:justify-start"
                >
                  {mounted && resolvedTheme === 'light' ? (
                    <Image
                      src="/images/logo/spearience.png"
                      alt="Spearience"
                      width={128}
                      height={64}
                      className="h-16 w-auto hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-32 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-dashed border-primary/30 rounded-xl flex items-center justify-center group-hover:border-primary/50 transition-colors">
                      <span className="text-xs font-medium text-primary/70 text-center">
                        Logo<br />Placeholder
                      </span>
                    </div>
                  )}
                </Link>
              </div>
              
              {/* Social Media Links */}
              <div className="space-y-6">
                <div className="flex gap-3 justify-center lg:justify-start">
                  {contact.socialMedia?.map((social) => {
                    const IconComponent = SocialIcons[social.icon as keyof typeof SocialIcons]
                    if (!IconComponent) return null
                    
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors group"
                        aria-label={`Follow on ${social.platform}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="flex justify-center lg:justify-start">
                <ThemeToggle />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-1 space-y-6 text-center lg:text-left">
              <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">
                {currentLocale === 'sv' ? 'Navigering' : 'Navigation'}
              </h3>
              <nav className="space-y-4">
                {navigation?.menu?.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${currentLocale}${item.href === '/' ? '' : item.href}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Information Section - Right */}
            <div className="lg:col-span-1 space-y-6 text-center lg:text-left">
              <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">
                {currentLocale === 'sv' ? 'Information' : 'Information'}
              </h3>
              <div className="space-y-4">
                {/* E-post */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    {currentLocale === 'sv' ? 'E-post' : 'Email'}
                  </div>
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                  >
                    {contact.email}
                  </a>
                </div>
                
                {/* Plats */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    {currentLocale === 'sv' ? 'Plats' : 'Location'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact.location}
                  </div>
                </div>
                
                {/* Organization Number */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    {currentLocale === 'sv' ? 'Org. nummer' : 'Org. Number'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentLocale === 'sv' ? '123456-7890' : '123456-7890'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"></div>

        {/* Sub-Footer - Integrated Bottom Section */}
        <div className="pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-sm text-muted-foreground text-center lg:text-left">
              {footer?.copyright || '© 2024 Chrish Fernando. All rights reserved.'}
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {footer?.links?.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <Link 
                href={`/${currentLocale}/contact`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {currentLocale === 'sv' ? 'Kontakt' : 'Contact'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 