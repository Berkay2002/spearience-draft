'use client'

import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { useExpertiseContent, useLocale } from '@/hooks/use-content'
import { CheckCircle, Target, Users, Trophy, Lightbulb, TrendingUp } from 'lucide-react'
import Image from 'next/image'

interface ExpertiseTabsProps {
  className?: string
}

// Icon mapping for different expertise areas
const iconMap = {
  'project-management': Target,
  'mentorship': Users,
  'sports-leadership': Trophy,
}

export function ExpertiseTabs({ className }: ExpertiseTabsProps) {
  const expertiseContent = useExpertiseContent()
  const locale = useLocale()

  // Transform our content into the format expected by AnimatedTabs
  const tabs = expertiseContent.tabs.map((tab) => {
    const IconComponent = iconMap[tab.id as keyof typeof iconMap] || Target
    
    return {
      id: tab.id,
      label: tab.label,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
          {/* Visual Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative bg-gradient-subtle rounded-2xl p-6 h-full min-h-[280px] flex flex-col justify-center">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-professional opacity-10 rounded-2xl"></div>
              
              {/* Icon */}
              <div className="relative z-10 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Features List */}
              <div className="relative z-10 space-y-3">
                {tab.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm text-foreground/80 leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-primary/5 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-brand-blue/5 rounded-full"></div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex flex-col justify-center order-1 lg:order-2 space-y-4">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {tab.title}
              </h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {tab.description}
              </p>
            </div>

            {/* Key Benefits */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Lightbulb className="w-4 h-4" />
                <span>Key Benefits</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tab.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    }
  })

  return (
    <section className={`section-padding relative overflow-hidden ${className}`}>
      <div className="container-professional">
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h2 className="section-title">
              {expertiseContent.title}
            </h2>
            
            <p className="section-subtitle max-w-2xl mx-auto">
              Three core pillars of professional excellence, each designed to drive exceptional results and sustainable growth.
            </p>
          </div>
        </div>

        {/* Animated Tabs Component */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <AnimatedTabs
              tabs={tabs}
              defaultTab={tabs[0]?.id}
              className="w-full max-w-none"
            />
          </div>
        </div>

      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl"></div>
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