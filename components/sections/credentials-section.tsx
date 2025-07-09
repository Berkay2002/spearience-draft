'use client'

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useCredentialsContent } from '@/hooks/use-content'
import { Award, Building, Calendar, CheckCircle, Users, Target, Briefcase, X } from 'lucide-react'

interface CredentialsSectionProps {
  className?: string
}

// Transform credentials data for expandable cards
interface CredentialCard {
  id: string
  role: string
  organization: string
  description: string
  period: string
  achievements: string[]
  image: string
  icon: React.ReactNode
}

export function CredentialsSection({ className }: CredentialsSectionProps) {
  const credentialsContent = useCredentialsContent()
  const [active, setActive] = useState<CredentialCard | null>(null)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  // If no content is loaded yet, show loading skeleton
  if (!credentialsContent || !credentialsContent.credentials) {
    return <CredentialsSectionSkeleton />
  }

  // Transform credentials data to cards format
  const credentialCards: CredentialCard[] = credentialsContent.credentials.map((credential) => ({
    id: credential.id,
    role: credential.role,
    organization: credential.organization,
    description: credential.description,
    period: credential.period,
    achievements: credential.achievements,
    image: `/images/credentials/${credential.id}.jpg`,
    icon: getCredentialIcon(credential.id)
  }))

  // Handle modal state
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null)
      }
    }

    if (active) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <section className={`section-padding-lg relative overflow-hidden ${className}`}>
      <div className="container-professional">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h2 className="section-title mb-6">
            {credentialsContent.title}
          </h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Professional expertise across diverse domains, delivering exceptional results through proven methodologies and innovative approaches.
          </p>
          <div className="w-24 h-1 bg-gradient-professional mx-auto rounded-full mt-6"></div>
        </div>

        {/* Expandable Cards */}
        <>
          {/* Modal Overlay */}
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm h-full w-full z-50"
              />
            )}
          </AnimatePresence>

          {/* Modal Content */}
          <AnimatePresence>
            {active ? (
              <div className="fixed inset-0 grid place-items-center z-[100] p-4">
                <motion.button
                  key={`button-${active.role}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  className="flex absolute top-4 right-4 lg:top-6 lg:right-6 items-center justify-center bg-background border border-border rounded-full h-10 w-10 shadow-lg hover:bg-accent transition-colors z-[110]"
                  onClick={() => setActive(null)}
                >
                  <X className="h-5 w-5 text-foreground" />
                </motion.button>
                
                <motion.div
                  layoutId={`card-${active.role}-${id}`}
                  ref={ref}
                  className="w-full max-w-[600px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-background dark:bg-card border border-border sm:rounded-3xl overflow-hidden shadow-professional-lg"
                >
                  {/* Modal Header */}
                  <motion.div 
                    layoutId={`header-${active.role}-${id}`}
                    className="bg-gradient-professional text-white p-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          {active.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <motion.h3
                          layoutId={`title-${active.role}-${id}`}
                          className="text-2xl font-bold text-white mb-2"
                        >
                          {active.role}
                        </motion.h3>
                        <motion.p
                          layoutId={`organization-${active.organization}-${id}`}
                          className="text-white/90 font-medium mb-1"
                        >
                          {active.organization}
                        </motion.p>
                        <motion.p
                          layoutId={`period-${active.period}-${id}`}
                          className="text-white/80 text-sm flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          {active.period}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Modal Content */}
                  <div className="flex-1 p-8 overflow-auto">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Description */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-primary" />
                          Role Overview
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {active.description}
                        </p>
                      </div>

                      {/* Key Achievements */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-success" />
                          Key Achievements
                        </h4>
                        <div className="grid gap-3">
                          {active.achievements.map((achievement, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-success/5 rounded-lg border border-success/20"
                            >
                              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground leading-relaxed">
                                {achievement}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {credentialCards.map((card) => (
              <motion.div
                layoutId={`card-${card.role}-${id}`}
                key={card.id}
                onClick={() => setActive(card)}
                className="group cursor-pointer"
              >
                <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-professional-lg transition-all duration-300 group-hover:border-primary/20 relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl transition-opacity group-hover:opacity-70"></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <motion.div 
                      layoutId={`header-${card.role}-${id}`}
                      className="flex items-start gap-4 mb-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          {card.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <motion.h3
                          layoutId={`title-${card.role}-${id}`}
                          className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors"
                        >
                          {card.role}
                        </motion.h3>
                        <motion.p
                          layoutId={`organization-${card.organization}-${id}`}
                          className="text-sm text-muted-foreground font-medium"
                        >
                          {card.organization}
                        </motion.p>
                      </div>
                    </motion.div>

                    {/* Period */}
                    <motion.div 
                      layoutId={`period-${card.period}-${id}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground mb-3"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{card.period}</span>
                    </motion.div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {card.description}
                    </p>

                    {/* Achievements Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Target className="w-4 h-4 text-success" />
                        <span>Key Achievements</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {card.achievements.length} major accomplishments
                      </div>
                    </div>

                    {/* Expand Indicator */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Click to expand</span>
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}

// Helper function to get credential icons
function getCredentialIcon(credentialId: string): React.ReactNode {
  const iconProps = { className: "w-6 h-6 text-white" }
  
  switch (credentialId) {
    case 'initiative-leader':
      return <Building {...iconProps} />
    case 'sports-consultant':
      return <Users {...iconProps} />
    case 'pedagogue':
      return <Award {...iconProps} />
    default:
      return <Briefcase {...iconProps} />
  }
}

// Loading skeleton for credentials section
export function CredentialsSectionSkeleton() {
  return (
    <section className="section-padding-lg">
      <div className="container-professional">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="w-8 h-8 bg-muted rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-12 bg-muted rounded-lg animate-pulse max-w-md mx-auto mb-6"></div>
          <div className="h-6 bg-muted rounded-lg animate-pulse max-w-3xl mx-auto"></div>
          <div className="w-24 h-1 bg-muted rounded-full mx-auto mt-6 animate-pulse"></div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted rounded-2xl p-6 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-muted-foreground/20 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 bg-muted-foreground/20 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-muted-foreground/20 rounded mb-3 w-1/2 animate-pulse"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-4/5 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-muted-foreground/20 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 