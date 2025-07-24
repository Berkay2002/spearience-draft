'use client'

import { Gallery4, type Gallery4Item } from '@/components/blocks/gallery4'
import { useLocale } from '@/hooks/use-content'
import { type FeaturedWorkContent } from '@/lib/content'
import { ArrowRight, ExternalLink, Tag, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'

interface FeaturedWorkProps {
  featuredWork: FeaturedWorkContent
  className?: string
}

export function FeaturedWork({ featuredWork: featuredWorkContent, className }: FeaturedWorkProps) {
  const locale = useLocale()

  // Transform our content data to match Gallery4 format
  const galleryItems: Gallery4Item[] = featuredWorkContent.projects
    .filter(project => project.featured) // Only show featured projects
    .map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      href: `/${locale}/projects/${project.id}`, // Link to individual project page
      image: project.image,
    }))

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="container-professional py-20 sm:py-28 lg:py-36">
        {/* Mobile-optimized section header */}
        <div className="text-center space-y-8 mb-16 lg:mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Featured Work</span>
            </div>
            
            <h2 className="section-title max-w-4xl mx-auto">
              {featuredWorkContent.title}
            </h2>
            
            <p className="section-description mx-auto">
              {featuredWorkContent.subtitle}
            </p>
          </div>
        </div>

        {/* Enhanced Gallery with mobile-first design */}
        <div className="relative mb-16">
          <Gallery4
            title=""
            description=""
            items={galleryItems}
          />
        </div>

        {/* Mobile-optimized Call to Action */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-secondary/60 to-muted/50 dark:from-secondary/40 dark:to-muted/60 rounded-3xl p-6 sm:p-8 lg:p-12 border border-border/20">
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {featuredWorkContent.cta.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {featuredWorkContent.cta.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/${locale}/projects`}>
                  <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 group shadow-lg">
                    {featuredWorkContent.cta.primaryButton}
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                
                <Link href={`/${locale}/contact`}>
                  <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-border text-foreground rounded-xl font-semibold hover:bg-card transition-all duration-200 group">
                    {featuredWorkContent.cta.secondaryButton}
                    <ExternalLink className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-brand-blue/2 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] bg-accent/2 rounded-full blur-2xl"></div>
      </div>
    </section>
  )
}

// Loading skeleton for featured work section
export function FeaturedWorkSkeleton() {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        {/* Gallery4 header skeleton */}
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <div className="h-12 bg-muted rounded-lg animate-pulse max-w-md"></div>
            <div className="h-6 bg-muted rounded-lg animate-pulse max-w-lg"></div>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <div className="w-10 h-10 bg-muted rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        {/* Gallery carousel skeleton */}
        <div className="w-full mb-16">
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[320px] lg:min-w-[360px]">
                <div className="h-[27rem] bg-muted rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats section skeleton */}
        <div className="container-professional">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-muted rounded-lg animate-pulse max-w-md mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted rounded-2xl p-6 animate-pulse">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-xl mx-auto mb-4"></div>
                  <div className="h-8 bg-muted-foreground/20 rounded mx-auto mb-2 w-20"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded mx-auto mb-2 w-32"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded mx-auto w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 