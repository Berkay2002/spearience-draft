'use client'

import { useImpactContent } from '@/hooks/use-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Quote, Star } from 'lucide-react'
import Link from 'next/link'

export function ImpactStatementSection() {
  const impactContent = useImpactContent()

  if (!impactContent) {
    return null
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {impactContent.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {impactContent.subtitle}
          </p>
        </div>

        {/* Main Impact Statement */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-4xl mx-auto text-center">
                <Quote className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-6 opacity-60" />
                <p className="text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 mb-8">
                  {impactContent.statement}
                </p>
                <Link href={impactContent.cta.href}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    {impactContent.cta.text}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Client Perspective
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              What clients say about working with Chrish
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(impactContent.featuredTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Highlighted Quote */}
                <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 italic">
                  "{impactContent.featuredTestimonial.highlight}"
                </blockquote>

                {/* Full Testimonial */}
                <p className="text-lg md:text-xl leading-relaxed mb-8 text-blue-100">
                  {impactContent.featuredTestimonial.content}
                </p>

                {/* Attribution */}
                <div className="border-t border-blue-500 pt-6">
                  <p className="font-semibold text-lg">
                    {impactContent.featuredTestimonial.name}
                  </p>
                  <p className="text-blue-200">
                    {impactContent.featuredTestimonial.role}, {impactContent.featuredTestimonial.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 