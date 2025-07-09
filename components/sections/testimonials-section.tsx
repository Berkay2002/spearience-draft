'use client'

import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'
import { useTestimonialsContent } from '@/hooks/use-content'
import { Star, Quote, Users, TrendingUp } from 'lucide-react'

interface TestimonialsSectionProps {
  className?: string
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const testimonialsContent = useTestimonialsContent()

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
    <section className={`section-padding-lg relative overflow-hidden ${className}`}>
      <div className="container-professional">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">5.0 Client Rating</span>
            </div>
            
            <h2 className="section-title">
              {testimonialsContent?.title || 'What Clients Say'}
            </h2>
            
            <p className="section-subtitle max-w-2xl mx-auto">
              Hear from clients who have experienced transformational results through our proven methodologies and dedicated partnership.
            </p>
          </div>

          {/* Social Proof Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>50+ Happy Clients</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-success" />
              <span>98% Success Rate</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Quote className="w-4 h-4 text-chart-3" />
              <span>Fortune 500 Testimonials</span>
            </div>
          </div>
        </div>

        {/* Animated Testimonials Component */}
        <div className="relative">
          {/* Background decoration for testimonials */}
          <div className="absolute inset-0 bg-gradient-subtle rounded-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <AnimatedTestimonials 
              testimonials={testimonials}
              autoplay={true}
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-6">Trusted by Leading Organizations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">Fortune 500</div>
                <div className="text-sm text-muted-foreground">Companies Served</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Trusted by industry leaders for critical transformations
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-success">15+ Years</div>
                <div className="text-sm text-muted-foreground">Experience</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Proven track record across diverse industries
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-chart-3">Stockholm</div>
                <div className="text-sm text-muted-foreground">Based</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Local expertise with global perspective
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-professional rounded-2xl p-8 max-w-2xl mx-auto text-white">
            <div className="space-y-4">
              <Quote className="w-8 h-8 mx-auto text-white/80" />
              <h4 className="text-xl font-bold">Ready to Join Our Success Stories?</h4>
              <p className="text-white/80">
                Experience the same transformational results that have made our clients industry leaders.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors"
                >
                  Start Your Journey
                </a>
                <a 
                  href="/projects" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  View Case Studies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-[200px] h-[200px] bg-success/5 rounded-full blur-2xl"></div>
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