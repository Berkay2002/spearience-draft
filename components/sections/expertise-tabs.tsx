'use client'

import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { useLocale } from '@/hooks/use-content'
import { type ExpertiseContent } from '@/lib/content'
import { CheckCircle, Target, Users, Trophy, Lightbulb, TrendingUp } from 'lucide-react'
import Image from 'next/image'

interface ExpertiseTabsProps {
  expertise: ExpertiseContent
  className?: string
}

// Icon mapping for different expertise areas
const iconMap = {
  'project-management': Target,
  'mentorship': Users,
  'sports-leadership': Trophy,
  'concept-development': Lightbulb,
}

export function ExpertiseTabs({ expertise, className }: ExpertiseTabsProps) {
  const locale = useLocale()

  // Transform our content into the format expected by AnimatedTabs
  const tabs = expertise.tabs.map((tab) => {
    const IconComponent = iconMap[tab.id as keyof typeof iconMap] || Target
    
    return {
      id: tab.id,
      label: tab.label,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
          {/* Content Side - Mobile First */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight max-w-2xl mx-auto lg:mx-0">
                {tab.title}
              </h3>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                {tab.description}
              </p>
            </div>

            {/* Features Grid - Mobile-optimized */}
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold text-primary">
                <Lightbulb className="w-4 h-4" />
                <span>{expertise.keyCaps}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto lg:mx-0">
                {tab.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 bg-card/50 rounded-xl p-4 border border-border/30">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm text-foreground leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Side - Enhanced with mobile consideration */}
          <div className="relative order-first lg:order-last">
            <div className="relative bg-gradient-to-br from-card/80 to-muted/40 rounded-3xl p-8 min-h-[320px] flex flex-col justify-center items-center text-center border border-border/30">
              {/* Enhanced background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
              
              {/* Large icon for visual impact */}
              <div className="relative z-10 mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-lg">
                  <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                </div>
              </div>

              {/* Visual emphasis text */}
              <div className="relative z-10 space-y-3 max-w-sm">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground">
                  {expertise.professionalExcellence}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {expertise.excellenceDescription}
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-primary/5 rounded-full blur-sm"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-secondary/10 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      ),
    }
  })

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="container-professional py-20 sm:py-28 lg:py-36">
        {/* Centerpiece section header - Mobile-optimized */}
        <div className="text-center space-y-8 mb-16 lg:mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 rounded-full text-primary font-semibold text-sm sm:text-base border border-primary/20">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{expertise.badge}</span>
            </div>
            
            <h2 className="section-title max-w-4xl mx-auto">
              {expertise.title}
            </h2>
            
            <p className="section-description mx-auto">
              Three core pillars of professional excellence, each designed to drive exceptional results and sustainable growth through proven methodologies and strategic implementation.
            </p>
          </div>
        </div>

        {/* Premium Animated Tabs - Enhanced visual centerpiece */}
        <div className="relative">
          {/* Enhanced backdrop with stronger depth */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-3xl border border-border/60 shadow-2xl">
            {/* Inner gradient for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-card/30 rounded-3xl"></div>
          </div>
          
          {/* Glowing border effect */}
          <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-3xl blur-sm"></div>
          
          <div className="relative z-10 p-6 sm:p-8 lg:p-12">
            <AnimatedTabs
              tabs={tabs}
              defaultTab={tabs[0]?.id}
              className="w-full max-w-none"
            />
          </div>
        </div>

      </div>

      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-brand-blue/3 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-[300px] h-[300px] bg-accent/3 rounded-full blur-2xl"></div>
      </div>
    </section>
  )
}

// Loading skeleton for the expertise tabs
export function ExpertiseTabsSkeleton() {
  return (
    <section className="section-padding-lg">
      <div className="container-professional">
        <div className="text-center space-y-6 mb-12">
          <div className="h-8 bg-muted rounded-lg animate-pulse max-w-md mx-auto"></div>
          <div className="h-6 bg-muted rounded-lg animate-pulse max-w-2xl mx-auto"></div>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="space-y-4">
              {/* Tab buttons skeleton */}
              <div className="flex gap-2 flex-wrap bg-muted/50 p-4 rounded-xl max-w-lg">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-32 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
              
              {/* Tab content skeleton */}
              <div className="h-80 bg-muted/50 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 