'use client'

import { useFeaturedWorkContent, useLocale } from '@/hooks/use-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Filter, Tag, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'

interface ProjectGridProps {
  className?: string
}

export function ProjectGrid({ className }: ProjectGridProps) {
  const featuredWorkContent = useFeaturedWorkContent()
  const locale = useLocale()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get all projects (not just featured ones)
  const allProjects = featuredWorkContent.projects

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(allProjects.map(project => project.category)))
    return ['all', ...uniqueCategories]
  }, [allProjects])

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return allProjects
    }
    return allProjects.filter(project => project.category === selectedCategory)
  }, [allProjects, selectedCategory])

  const getCategoryLabel = (category: string) => {
    if (locale === 'sv') {
      switch (category) {
        case 'all': return 'Alla'
        case 'Project Management': return 'Projektledning'
        case 'Mentorship': return 'Mentorskap'
        case 'Sports Leadership': return 'Idrottsledarskap'
        default: return category
      }
    }
    return category === 'all' ? 'All Projects' : category
  }

  return (
    <section className={`py-24 relative overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {featuredWorkContent.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            {featuredWorkContent.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {locale === 'sv' ? 'Filtrera efter kategori:' : 'Filter by category:'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                {getCategoryLabel(category)}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
              <div className="relative overflow-hidden">
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-blue-600 text-white px-3 py-1">
                      {locale === 'sv' ? 'Utvald' : 'Featured'}
                    </Badge>
                  </div>
                )}

                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-slate-700 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Project Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>

                {/* Project Description */}
                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Key Outcomes */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    {locale === 'sv' ? 'Nyckelresultat:' : 'Key Results:'}
                  </div>
                  <ul className="space-y-1">
                    {project.outcomes?.slice(0, 2).map((outcome, index) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* View Details Link */}
                <Link href={`/${locale}/projects/${project.id}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full group/btn hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 hover:text-blue-700"
                  >
                    {locale === 'sv' ? 'Visa detaljer' : 'View Details'}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold">
                  {locale === 'sv' ? 'Redo att starta ditt nästa projekt?' : 'Ready to Start Your Next Project?'}
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
                  {locale === 'sv' 
                    ? 'Låt oss diskutera hur mina beprövade metoder kan transformera ditt team och leverera exceptionella resultat.'
                    : 'Let\'s discuss how my proven methodologies can transform your team and deliver exceptional results.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/${locale}/contact`}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 px-8 font-medium">
                    {locale === 'sv' ? 'Starta en konversation' : 'Start a Conversation'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <Link href={`/${locale}/about`}>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                    {locale === 'sv' ? 'Läs mer om mig' : 'Learn More About Me'}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-blue-100">
                <span>✓ {locale === 'sv' ? '6+ Framgångsrika projekt' : '6+ Successful Projects'}</span>
                <span>✓ {locale === 'sv' ? '98% Framgångsgrad' : '98% Success Rate'}</span>
                <span>✓ {locale === 'sv' ? '15+ År erfarenhet' : '15+ Years Experience'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-[200px] h-[200px] bg-slate-400/5 rounded-full blur-2xl"></div>
      </div>
    </section>
  )
} 