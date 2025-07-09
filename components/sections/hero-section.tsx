'use client'

import { Button } from '@/components/ui/button'
import { useHeroContent, useLocale } from '@/hooks/use-content'
// import { useAnalytics } from '@/lib/analytics'
import { ArrowRight, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className }: HeroSectionProps) {
  const heroContent = useHeroContent()
  const locale = useLocale()
  // const { analytics } = useAnalytics()

  // Handle CTA clicks with analytics
  const handlePrimaryCTA = () => {
    // analytics.ctaClick('primary-cta', locale)
    console.log('Primary CTA clicked')
  }

  const handleSecondaryCTA = () => {
    // analytics.ctaClick('secondary-cta', locale)
    console.log('Secondary CTA clicked')
  }

  return (
    <section className={`section-padding-lg overflow-hidden ${className}`}>
      <div className="container-professional">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Hero Title */}
            <div className="space-y-6">
              <h1 className="hero-text animate-fade-in-up">
                {heroContent.title}
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-primary gradient-text animate-fade-in-up [animation-delay:200ms]">
                  {heroContent.subtitle}
                </h2>
                
                <p className="hero-subtitle max-w-2xl animate-fade-in-up [animation-delay:400ms]">
                  {heroContent.description}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up [animation-delay:600ms]">
              <Link href={`/${locale}/projects`} onClick={handlePrimaryCTA}>
                <Button 
                  size="lg" 
                  className="btn-professional-primary group w-full sm:w-auto"
                >
                  {heroContent.primaryCta}
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
                  {heroContent.secondaryCta}
                </Button>
              </Link>
            </div>

          </div>

          {/* Image Column */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative animate-fade-in-up [animation-delay:300ms]">
              {/* Professional headshot with modern styling */}
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-professional rounded-3xl opacity-20 blur-xl"></div>
                
                {/* Main image container */}
                <div className="relative bg-card rounded-3xl p-2 shadow-professional-xl">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-subtle">
                    <Image
                      src={heroContent.headshot.src}
                      alt={heroContent.headshot.alt}
                      width={500}
                      height={600}
                      className="w-full h-auto object-cover object-center transition-transform duration-500 hover:scale-105"
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                
                {/* Professional badge */}
                <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-2xl p-3 shadow-professional">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-bounce-subtle"></div>
                    <span className="text-xs font-medium text-foreground">Available</span>
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