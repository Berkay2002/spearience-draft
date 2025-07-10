'use client'

import Image from 'next/image'
import { useBioContent } from '@/hooks/use-content'
import { CheckCircle, Award, Globe, Users, Target, Briefcase } from 'lucide-react'
import { imagePresets } from '@/lib/image-optimization'

interface BioSectionProps {
  className?: string
}

export function BioSection({ className }: BioSectionProps) {
  const bioContent = useBioContent()

  // If no content is loaded yet, show loading skeleton
  if (!bioContent || !bioContent.biography) {
    return <BioSectionSkeleton />
  }

  return (
    <section className={`section-padding-lg relative overflow-hidden ${className}`}>
      <div className="container-professional">
        {/* Section Header */}
        <div className="text-center mb-16">
                  <h2 className="section-title mb-6">
          {bioContent.title}
        </h2>
          <div className="w-24 h-1 bg-gradient-professional mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Professional Headshot */}
          <div className="relative h-full flex items-stretch">
            <div className="relative group flex-1 flex items-stretch">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-professional rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl"></div>
              
              {/* Main image container */}
              <div className="relative bg-card border border-border rounded-2xl p-6 shadow-professional flex h-full">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden w-full h-full min-h-[400px] max-h-[700px]">
                  <Image
                    src={bioContent.headshot.src}
                    alt={bioContent.headshot.alt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    priority={false}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Biography & Key Highlights */}
          <div className="space-y-8">
            {/* Professional Biography */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Professional Journey
              </h2>
              <div className="prose prose-lg max-w-none">
                {bioContent.biography.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Key Highlights
              </h3>
              <div className="space-y-3">
                {bioContent.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-[200px] h-[200px] bg-success/5 rounded-full blur-2xl"></div>
      </div>
    </section>
  )
}

// Loading skeleton for bio section
export function BioSectionSkeleton() {
  return (
    <section className="section-padding-lg">
      <div className="container-professional">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-muted rounded-lg animate-pulse max-w-md mx-auto mb-6"></div>
          <div className="w-24 h-1 bg-muted rounded-full mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column skeleton */}
          <div className="space-y-8">
            <div className="aspect-[4/5] bg-muted rounded-2xl animate-pulse"></div>
            <div className="bg-muted rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-muted-foreground/20 rounded mb-4 w-32"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column skeleton */}
          <div className="space-y-8">
            <div>
              <div className="h-8 bg-muted rounded mb-6 w-48 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            
            <div className="bg-muted rounded-2xl p-8 animate-pulse">
              <div className="h-6 bg-muted-foreground/20 rounded mb-4 w-32"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-4/5"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-muted rounded-xl p-6 animate-pulse">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-xl mx-auto mb-3"></div>
                  <div className="h-6 bg-muted-foreground/20 rounded mx-auto mb-1 w-12"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded mx-auto w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 