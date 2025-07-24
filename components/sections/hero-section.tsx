'use client'

import { Button } from '@/components/ui/button'
import { useLocale } from '@/hooks/use-content'
import { type HeroContent } from '@/lib/content'
// import { useAnalytics } from '@/lib/analytics'
import { ArrowRight, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SocialShare } from '@/components/social-share'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface HeroSectionProps {
  hero: HeroContent
  className?: string
}

export function HeroSection({ hero, className }: HeroSectionProps) {
  const locale = useLocale()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // const { analytics } = useAnalytics()

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle CTA clicks with analytics
  const handlePrimaryCTA = () => {
    // analytics.ctaClick('primary-cta', locale)
    console.log('Primary CTA clicked')
  }

  const handleSecondaryCTA = () => {
    // analytics.ctaClick('secondary-cta', locale)
    console.log('Secondary CTA clicked')
  }

  // Get theme-aware image source
  const getThemeAwareImageSrc = () => {
    if (!mounted) return '/images/chrish/chrish-light-theme.png' // Default fallback
    const isDark = resolvedTheme === 'dark'
    return isDark 
      ? '/images/chrish/chrish-dark-theme.png'
      : '/images/chrish/chrish-light-theme.png'
  }

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="container-professional pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content Column - Mobile-First, appears second on mobile */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Hero Title with mobile-optimized typography */}
            <div className="space-y-6">
              <h1 className="hero-title-mobile text-balance animate-fade-in-up mx-auto lg:mx-0">
                {hero.title}
              </h1>
              
              <div className="space-y-5">
                <p className="hero-subtitle-mobile animate-fade-in-up [animation-delay:200ms] mx-auto lg:mx-0">
                  {hero.subtitle}
                </p>
                
                <p className="hero-description-mobile animate-fade-in-up [animation-delay:400ms] mx-auto lg:mx-0">
                  {hero.description}
                </p>
              </div>
            </div>

            {/* CTA Buttons - Mobile-centered, desktop left-aligned */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up [animation-delay:600ms]">
              <Link href={`/${locale}/projects`} onClick={handlePrimaryCTA}>
                <Button 
                  size="lg" 
                  className="btn-professional-primary group w-full sm:w-auto"
                >
                  {hero.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href={`/${locale}/contact`} onClick={handleSecondaryCTA}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="btn-professional-secondary group w-full sm:w-auto"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {hero.secondaryCta}
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Column - Mobile-optimized, appears first on mobile */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative animate-fade-in-up [animation-delay:300ms] w-full max-w-sm sm:max-w-md lg:max-w-lg">
              {/* Professional headshot with mobile-friendly sizing */}
              <div className="relative">
                {/* Main image container */}
                <div className="relative rounded-3xl p-2 shadow-professional-xl">
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={getThemeAwareImageSrc()}
                      alt={hero.headshot.alt}
                      width={500}
                      height={600}
                      className="w-full h-auto object-cover object-center transition-transform duration-500 hover:scale-105"
                      priority
                      sizes="(max-width: 640px) 300px, (max-width: 768px) 400px, (max-width: 1024px) 350px, 500px"
                    />
                    
                    {/* Floating elements for visual interest */}
                    <div className="absolute top-4 right-4 bg-brand-blue/10 backdrop-blur-sm rounded-xl p-2">
                      <div className="w-3 h-3 bg-brand-blue rounded-full animate-pulse-subtle"></div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 bg-success/10 backdrop-blur-sm rounded-xl p-2">
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse-subtle [animation-delay:1s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}

// Loading skeleton for the hero section
export function HeroSectionSkeleton() {
  return (
    <section className="section-padding-lg">
      <div className="container-professional">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-6">
              <div className="h-16 bg-muted rounded-lg animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded-lg animate-pulse"></div>
                <div className="h-6 bg-muted rounded-lg animate-pulse max-w-2xl"></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-12 w-40 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-12 w-40 bg-muted rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-full max-w-md mx-auto aspect-[4/5] bg-muted rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 