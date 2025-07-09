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
    <section className={`relative overflow-hidden ${className}`}>
      {/* Enhanced Gallery4 with custom styling */}
      <div className="relative">
        <Gallery4
          title={featuredWorkContent.title}
          description={featuredWorkContent.subtitle}
          items={galleryItems}
        />
      </div>

      {/* Enhanced Bottom Section */}
      <div className="container-professional py-16">
        <div className="max-w-6xl mx-auto">
          {/* Featured Projects Stats */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-8">Project Impact Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-professional-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">$2M+</div>
                <div className="text-sm text-muted-foreground">Annual Cost Savings</div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Delivered through process optimization and digital transformation initiatives
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-professional-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-success" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-success mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Executives Trained</div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Leadership development programs with 80% internal promotion rate
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-professional-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-chart-3" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-chart-3 mb-2">60%</div>
                <div className="text-sm text-muted-foreground">Efficiency Gains</div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Average improvement across all project implementations
                </p>
              </div>
            </div>
          </div>

          {/* Project Categories */}
          <div className="mb-12">
            <h4 className="text-xl font-bold text-center mb-8">Expertise Areas</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {['Digital Transformation', 'Leadership Development', 'Sports Consulting', 'Change Management', 'Process Optimization', 'Team Performance'].map((category) => (
                <div key={category} className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm">
                  <Tag className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
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

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-white/60">
                  <span>✓ Fortune 500 Trusted</span>
                  <span>✓ 15+ Years Experience</span>
                  <span>✓ 98% Success Rate</span>
                  <span>✓ Stockholm Based</span>
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