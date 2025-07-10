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
    <footer className={`relative bg-background border-t border-border overflow-hidden ${className}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container-professional section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">S</span>
                </div>
                <Link 
                  href={`/${currentLocale}`}
                  className="text-xl font-bold text-foreground hover:text-primary transition-colors"
                >
                  {navigation?.logo || 'Chrish Fernando'}
                </Link>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground group">
                  <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
                  </div>
                  <a 
                    href={`mailto:${contact.email}`}
                    className="hover:text-primary transition-colors touch-target-large"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>{contact.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {currentLocale === 'sv' ? 'Navigering' : 'Navigation'}
            </h3>
            <nav className="space-y-3">
              {navigation?.menu?.map((item) => (
                <Link
                  key={item.href}
                  href={`/${currentLocale}${item.href === '/' ? '' : item.href}`}
                  className="block text-muted-foreground hover:text-primary transition-colors touch-target-large"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Featured Projects */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {currentLocale === 'sv' ? 'Utvalda projekt' : 'Featured Projects'}
            </h3>
            <nav className="space-y-3">
              <Link
                href={`/${currentLocale}/projects`}
                className="block font-medium text-muted-foreground hover:text-primary transition-colors touch-target-large"
              >
                {currentLocale === 'sv' ? 'Visa alla projekt' : 'View All Projects'}
              </Link>
              {featuredProjects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  href={`/${currentLocale}/projects/${project.id}`}
                  className="block text-muted-foreground hover:text-primary transition-colors touch-target-large"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground/70">{project.category}</div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect & Other Projects */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {currentLocale === 'sv' ? 'Anslut' : 'Connect'}
            </h3>
            
            <div className="space-y-6">
              {/* Social Media Links */}
              <div className="flex gap-3">
                {contact.socialMedia?.map((social) => {
                  const IconComponent = SocialIcons[social.icon as keyof typeof SocialIcons]
                  if (!IconComponent) return null
                  
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 group touch-target-large"
                      aria-label={`Follow on ${social.platform}`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 absolute translate-x-2 -translate-y-2 transition-opacity" />
                    </a>
                  )
                })}
              </div>

              {/* Other Projects */}
              {otherProjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    {currentLocale === 'sv' ? 'Övriga projekt' : 'Other Projects'}
                  </h4>
                  <nav className="space-y-2">
                    {otherProjects.slice(0, 3).map((project) => (
                      <Link
                        key={project.id}
                        href={`/${currentLocale}/projects/${project.id}`}
                        className="block text-sm text-muted-foreground/80 hover:text-primary transition-colors touch-target-large"
                      >
                        {project.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* Theme Toggle */}
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {currentLocale === 'sv' ? 'Tema:' : 'Theme:'}
                  </span>
                  <ThemeToggle className="w-12 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            {footer?.copyright || '© 2024 Chrish Fernando. All rights reserved.'}
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            {footer?.links?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors touch-target-large"
              >
                {link.label}
              </Link>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sm h-auto p-0 text-muted-foreground hover:text-primary touch-target-large"
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