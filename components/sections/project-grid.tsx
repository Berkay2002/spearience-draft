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
    <section className={`section-padding-lg relative overflow-hidden ${className}`}>
      <div className="container-professional">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title mb-6">
            {featuredWorkContent.title}
          </h2>
          <p className="section-subtitle max-w-3xl mx-auto mb-8">
            {featuredWorkContent.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-brand-blue mx-auto rounded-full"></div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
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
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-professional' 
                    : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
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
            <Card key={project.id} className="group overflow-hidden border-0 shadow-professional hover:shadow-professional-lg transition-all duration-300 bg-card border border-border flex flex-col">
              <div className="relative overflow-hidden">
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-primary/90 text-primary-foreground px-3 py-1 backdrop-blur-sm">
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
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-card/90 text-foreground backdrop-blur-sm border border-border">
                      {project.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-border">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-border">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Key Outcomes */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <div className="w-6 h-6 bg-success/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-3 w-3 text-success" />
                      </div>
                      {locale === 'sv' ? 'Nyckelresultat:' : 'Key Results:'}
                    </div>
                    <ul className="space-y-1">
                      {project.outcomes?.slice(0, 2).map((outcome, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* View Details Link - Now at bottom */}
                <Link href={`/${locale}/projects/${project.id}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full group/btn hover:bg-primary/10 hover:text-primary text-primary border border-primary/20 hover:border-primary/50 transition-all duration-200"
                  >
                    {locale === 'sv' ? 'Visa detaljer' : 'View Details'}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-[200px] h-[200px] bg-success/5 rounded-full blur-2xl"></div>
      </div>
    </section>
  )
} 