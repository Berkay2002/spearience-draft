'use client'

import { Gallery4, type Gallery4Item } from '@/components/blocks/gallery4'
import { useFeaturedWorkContent, useLocale } from '@/hooks/use-content'
import { ArrowRight, ExternalLink, Tag, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'

interface FeaturedWorkProps {
  className?: string
}

export function FeaturedWork({ className }: FeaturedWorkProps) {
  const featuredWorkContent = useFeaturedWorkContent()
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
    <section className={`section-padding relative overflow-hidden ${className}`}>
      {/* Enhanced Gallery4 with custom styling */}
      <div className="relative">
        <Gallery4
          title={featuredWorkContent.title}
          description={featuredWorkContent.subtitle}
          items={galleryItems}
        />
      </div>

      {/* Call to Action */}
      <div className="container-professional pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-gradient-professional rounded-2xl p-8 text-white max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold">Explore the Complete Portfolio</h4>
                  <p className="text-white/80 leading-relaxed">
                    Dive deeper into detailed case studies, methodologies, and measurable results across diverse industries and project scales.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={`/${locale}/projects`}>
                    <button className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors group">
                      View All Projects
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  
                  <Link href={`/${locale}/contact`}>
                    <button className="inline-flex items-center justify-center px-8 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors group">
                      Discuss Your Project
                      <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:scale-110" />
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-brand-blue/3 rounded-full blur-3xl"></div>
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