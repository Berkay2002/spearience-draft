'use client'

import { MacbookScroll } from '@/components/ui/macbook-scroll'
import { useProcessContent } from '@/hooks/use-content'
import { CheckCircle, ArrowRight, PlayCircle, Target, Users, TrendingUp, Zap } from 'lucide-react'
import Image from 'next/image'

interface ProcessShowcaseProps {
  className?: string
}

// Process workflow screen content
function ProcessWorkflowScreen() {
  const processContent = useProcessContent()

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Project Workflow Dashboard</h3>
              <p className="text-blue-200 text-sm">Chrish Fernando Methodology</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Process</span>
          </div>
        </div>
      </div>

      {/* Process Steps Flow */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {processContent.steps.map((step, index) => (
            <div 
              key={step.id} 
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-400/30">
                    <span className="text-blue-400 font-bold text-sm">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm mb-1 truncate">
                    {step.title}
                  </h4>
                  <p className="text-blue-200 text-xs leading-relaxed line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-green-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(index + 1) * 25}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-400/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-green-200 text-xs">Project Completion</div>
          </div>
          
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">Team Efficiency</span>
            </div>
            <div className="text-2xl font-bold text-white">+40%</div>
            <div className="text-blue-200 text-xs">Performance Boost</div>
          </div>
          
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-xs font-medium">Delivery Speed</span>
            </div>
            <div className="text-2xl font-bold text-white">60%</div>
            <div className="text-purple-200 text-xs">Faster Delivery</div>
          </div>
        </div>

        {/* Active Project Status */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">Current Initiative Status</h4>
            <PlayCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-200">Digital Transformation Project</span>
              <span className="text-green-400 font-medium">85% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="flex items-center gap-4 text-xs text-blue-200 pt-1">
              <span>• 12 milestones achieved</span>
              <span>• 3 weeks ahead of schedule</span>
              <span>• 95% stakeholder satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 bg-green-500/10 rounded-full blur-lg animate-pulse [animation-delay:1s]"></div>
      <div className="absolute top-1/2 right-8 w-8 h-8 bg-purple-500/10 rounded-full blur-md animate-pulse [animation-delay:2s]"></div>
    </div>
  )
}

export function ProcessShowcase({ className }: ProcessShowcaseProps) {
  const processContent = useProcessContent()

  return (
    <section className={`section-padding-lg relative ${className}`}>
      {/* MacBook Scroll Component */}
      <MacbookScroll
        title={
          <div className="flex flex-col items-center space-y-4">
            <h2 className="section-title text-center">
              {processContent.title}
            </h2>
            <p className="section-subtitle text-center max-w-3xl">
              {processContent.subtitle}
            </p>
          </div>
        }
        src={<ProcessWorkflowScreen />}
        showGradient={true}
        badge={
          <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Methodology</span>
            </div>
          </div>
        }
      />

      {/* Custom MacBook Screen Content (hidden but rendered) */}
      <div className="hidden">
        <div id="process-workflow-screen">
          <ProcessWorkflowScreen />
        </div>
      </div>
    </section>
  )
}

// Loading skeleton for process showcase
export function ProcessShowcaseSkeleton() {
  return (
    <section className="py-32">
      <div className="container-professional">
        <div className="text-center space-y-6 mb-16">
          <div className="h-8 bg-muted rounded-lg animate-pulse max-w-md mx-auto"></div>
          <div className="h-6 bg-muted rounded-lg animate-pulse max-w-2xl mx-auto"></div>
        </div>
        
        <div className="flex justify-center mb-16">
          <div className="w-[800px] h-[500px] bg-muted rounded-3xl animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted rounded-2xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-muted-foreground/20 rounded-xl mb-4"></div>
              <div className="h-6 bg-muted-foreground/20 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 