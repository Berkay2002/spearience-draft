'use client'

import { useLocale, useProjectCaseStudyContent } from '@/hooks/use-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Calendar, CheckCircle, ExternalLink, Target, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { type ProjectContent } from '@/lib/content'

interface ProjectCaseStudyProps {
  project: ProjectContent
  className?: string
}

export function ProjectCaseStudy({ project, className }: ProjectCaseStudyProps) {
  const locale = useLocale()
  const caseStudyContent = useProjectCaseStudyContent()

  // Provide fallback if content is not loaded yet
  if (!caseStudyContent) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Hero Section */}
      <section className="relative section-padding-lg bg-gradient-professional text-white overflow-hidden">
        <div className="container-professional relative z-10">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href={`/${locale}/projects`}>
              <Button variant="ghost" className="text-white hover:bg-white/10 mb-6 transition-all duration-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {caseStudyContent.navigation.backToProjects}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Project Info */}
            <div className="space-y-6">
              {/* Title and Brief Description Only */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {project.title}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  {project.description.split('.')[0]}.
                </p>
              </div>
            </div>

            {/* Right Column - Project Image */}
            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-professional-lg">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding-lg relative overflow-hidden">
        <div className="container-professional">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-12">
              {/* Project Overview */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  {caseStudyContent.labels.overview}
                </h2>
                
                {/* Project Metadata */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {project.featured && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                        {caseStudyContent.labels.featured}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                      {project.category}
                    </Badge>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Challenge Section */}
              <Card className="border-0 shadow-professional bg-card border border-border">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <Zap className="h-6 w-6 text-accent-foreground" />
                    {caseStudyContent.labels.challenge}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {caseStudyContent.content.challengeDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Solution Section */}
              <Card className="border-0 shadow-professional bg-card border border-border">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <Users className="h-6 w-6 text-success" />
                    {caseStudyContent.labels.solution}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {caseStudyContent.content.solutionDescription}
                  </p>
                  
                  {/* Methodology highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {caseStudyContent.content.methodologyHighlights.map((highlight, index) => (
                      <div key={index} className={`${index === 0 ? 'bg-primary/5 border border-primary/10' : 'bg-success/5 border border-success/10'} rounded-lg p-4`}>
                        <h4 className="font-semibold text-foreground mb-2">{highlight.title}</h4>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-8">
              {/* Key Results */}
              <Card className="border-0 shadow-professional bg-gradient-professional text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {caseStudyContent.labels.results}
                  </h3>
                  <div className="space-y-4">
                    {project.outcomes?.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed text-white/90">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card className="border-0 shadow-professional bg-card border border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    {caseStudyContent.labels.projectDetails}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{caseStudyContent.labels.category}</span>
                      <p className="text-foreground">{project.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{caseStudyContent.labels.status}</span>
                      <p className="text-foreground">{caseStudyContent.labels.completed}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{caseStudyContent.labels.type}</span>
                      <p className="text-foreground">
                        {project.featured ? caseStudyContent.labels.featuredProject : caseStudyContent.labels.caseStudy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="border-0 shadow-professional bg-gradient-subtle border border-border">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {caseStudyContent.callToAction.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {caseStudyContent.callToAction.subtitle}
                  </p>
                  <Link href={`/${locale}/contact`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
                      {caseStudyContent.callToAction.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
    </div>
  )
} 