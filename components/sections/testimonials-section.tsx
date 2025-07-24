'use client'

import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'
import { type TestimonialContent } from '@/lib/content'
import { Quote } from 'lucide-react'

interface TestimonialsSectionProps {
  testimonials: TestimonialContent
  className?: string
}

export function TestimonialsSection({ testimonials: testimonialsContent, className }: TestimonialsSectionProps) {

  // Transform our content data to match AnimatedTestimonials format
  // Add safety check for testimonials array
  const testimonials = (testimonialsContent?.testimonials || []).map((testimonial) => ({
    quote: testimonial.content,
    name: testimonial.name,
    designation: `${testimonial.role}, ${testimonial.company}`,
    src: testimonial.avatar || `/images/testimonials/client-${testimonial.id.split('-')[1]}.jpg`,
  }))

  // If no content is loaded yet, show loading skeleton
  if (!testimonialsContent || !testimonialsContent.testimonials || testimonialsContent.testimonials.length === 0) {
    return <TestimonialsSectionSkeleton />
  }

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="container-professional py-20 sm:py-28 lg:py-36">
        {/* Mobile-optimized section header */}
        <div className="text-center space-y-8 mb-16 lg:mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              <Quote className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{testimonialsContent.badge}</span>
            </div>
            
            <h2 className="section-title max-w-4xl mx-auto">
              {testimonialsContent.title}
            </h2>
            
            <p className="section-description mx-auto">
              {testimonialsContent.subtitle}
            </p>
          </div>
        </div>

        {/* Enhanced testimonials with mobile-first design */}
        <div className="relative">
          {/* Subtle backdrop for testimonials */}
          <div className="absolute inset-0 bg-card/30 backdrop-blur-sm rounded-3xl border border-border/30"></div>
          
          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            <AnimatedTestimonials 
              testimonials={testimonials}
              autoplay={true}
            />
          </div>
        </div>

      </div>

      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-brand-blue/3 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-[200px] h-[200px] bg-success/3 rounded-full blur-2xl"></div>
      </div>
    </section>
  )
}

// Loading skeleton for testimonials section
export function TestimonialsSectionSkeleton() {
  return (
    <section className="section-padding-lg">
      <div className="container-professional">
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-8 bg-muted rounded-lg animate-pulse max-w-md mx-auto"></div>
          <div className="h-6 bg-muted rounded-lg animate-pulse max-w-2xl mx-auto"></div>
        </div>
        
        <div className="relative">
          <div className="bg-muted rounded-3xl p-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-32 h-32 bg-muted-foreground/20 rounded-3xl mx-auto animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-muted-foreground/20 rounded animate-pulse"></div>
                <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="bg-muted rounded-2xl p-8 animate-pulse">
            <div className="h-6 bg-muted-foreground/20 rounded mx-auto mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 text-center">
                  <div className="h-8 bg-muted-foreground/20 rounded mx-auto w-24"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded mx-auto w-32"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded mx-auto w-40"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 