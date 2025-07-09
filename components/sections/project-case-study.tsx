'use client'

import { useLocale } from '@/hooks/use-content'
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

const localizedTexts = {
  en: {
    backToProjects: 'Back to Projects',
    overview: 'Project Overview',
    challenge: 'The Challenge',
    solution: 'Our Solution',
    results: 'Key Results',
    methodology: 'Methodology',
    technologies: 'Technologies & Approaches',
    timeline: 'Project Timeline',
    nextSteps: 'Next Steps',
    getInTouch: 'Discuss Your Project',
    viewAllProjects: 'View All Projects',
    featured: 'Featured Project'
  },
  sv: {
    backToProjects: 'Tillbaka till projekt',
    overview: 'Projektöversikt',
    challenge: 'Utmaningen',
    solution: 'Vår lösning',
    results: 'Nyckelresultat',
    methodology: 'Metodik',
    technologies: 'Teknologier & tillvägagångssätt',
    timeline: 'Projektets tidslinje',
    nextSteps: 'Nästa steg',
    getInTouch: 'Diskutera ditt projekt',
    viewAllProjects: 'Visa alla projekt',
    featured: 'Utvalt projekt'
  }
}

export function ProjectCaseStudy({ project, className }: ProjectCaseStudyProps) {
  const locale = useLocale()

  const getLocalizedText = (key: keyof typeof localizedTexts.en) => {
    return localizedTexts[locale as keyof typeof localizedTexts]?.[key] || localizedTexts.en[key]
  }

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href={`/${locale}/projects`}>
              <Button variant="ghost" className="text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {getLocalizedText('backToProjects')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Project Info */}
            <div className="space-y-6">
              {/* Featured Badge */}
              {project.featured && (
                <Badge className="bg-blue-600 text-white px-4 py-2 text-sm">
                  {getLocalizedText('featured')}
                </Badge>
              )}

              {/* Category & Title */}
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {project.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {project.title}
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-white border-white/30 bg-white/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right Column - Project Image */}
            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
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

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-12">
              {/* Project Overview */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <Target className="h-8 w-8 text-blue-600" />
                  {getLocalizedText('overview')}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Challenge Section */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <Zap className="h-6 w-6 text-orange-600" />
                    {getLocalizedText('challenge')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Every successful project starts with understanding the core challenges. This project required navigating complex stakeholder requirements, tight deadlines, and the need for innovative solutions that would deliver measurable impact while ensuring sustainable long-term results.
                  </p>
                </CardContent>
              </Card>

              {/* Solution Section */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <Users className="h-6 w-6 text-green-600" />
                    {getLocalizedText('solution')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    Our approach combined proven methodologies with innovative thinking, focusing on sustainable change and measurable outcomes. We implemented a phased strategy that prioritized quick wins while building toward long-term transformation.
                  </p>
                  
                  {/* Methodology highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Strategic Planning</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Comprehensive roadmap development with clear milestones and success metrics.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Team Development</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Focused on building capabilities and fostering collaborative excellence.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-8">
              {/* Key Results */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {getLocalizedText('results')}
                  </h3>
                  <div className="space-y-4">
                    {project.outcomes?.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Project Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Category</span>
                      <p className="text-slate-900 dark:text-white">{project.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</span>
                      <p className="text-slate-900 dark:text-white">Completed</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Type</span>
                      <p className="text-slate-900 dark:text-white">
                        {project.featured ? 'Featured Project' : 'Case Study'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    Interested in Similar Results?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Let's discuss how I can help achieve your project goals.
                  </p>
                  <Link href={`/${locale}/contact`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      {getLocalizedText('getInTouch')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-100 dark:bg-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Explore More Projects
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Discover how proven methodologies can transform your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/projects`}>
              <Button size="lg" variant="outline" className="px-8">
                {getLocalizedText('viewAllProjects')}
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                {getLocalizedText('getInTouch')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 