'use client'

import { useContactContent, useLocale } from '@/hooks/use-content'
import { ContactForm } from '@/components/forms/contact-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, MapPin, Clock, Linkedin, Twitter, Phone, MessageCircle, Star, Users, Award } from 'lucide-react'
import Link from 'next/link'

interface ContactSectionProps {
  className?: string
}

export function ContactSection({ className }: ContactSectionProps) {
  const contactContent = useContactContent()
  const locale = useLocale()

  const quickStats = [
    {
      icon: Users,
      value: '500+',
      label: locale === 'sv' ? 'Klienter hjälpta' : 'Clients Helped',
      color: 'text-blue-600'
    },
    {
      icon: Star,
      value: '98%',
      label: locale === 'sv' ? 'Framgångsgrad' : 'Success Rate',
      color: 'text-green-600'
    },
    {
      icon: Award,
      value: '15+',
      label: locale === 'sv' ? 'År erfarenhet' : 'Years Experience',
      color: 'text-purple-600'
    }
  ]

  const responseTime = {
    title: locale === 'sv' ? 'Snabbt svar' : 'Quick Response',
    description: locale === 'sv' ? 'Jag svarar vanligtvis inom 24 timmar' : 'I typically respond within 24 hours'
  }

  const availability = {
    title: locale === 'sv' ? 'Tillgänglighet' : 'Availability',
    description: locale === 'sv' ? 'Måndag - Fredag, 9:00 - 18:00 CET' : 'Monday - Friday, 9:00 AM - 6:00 PM CET'
  }

  return (
    <section className={`py-24 bg-slate-50 dark:bg-slate-900 ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {contactContent.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            {contactContent.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="border-0 shadow-lg bg-white dark:bg-slate-800 text-center">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${stat.color} bg-current/10 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div className="space-y-8">
            <ContactForm />
          </div>

          {/* Right Column - Contact Information */}
          <div className="space-y-8">
            {/* Contact Information Card */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {locale === 'sv' ? 'Kontaktinformation' : 'Contact Information'}
                </h3>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {locale === 'sv' ? 'E-post' : 'Email'}
                      </h4>
                      <a 
                        href={`mailto:${contactContent.email}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {contactContent.email}
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {locale === 'sv' ? 'Plats' : 'Location'}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">
                        {contactContent.location}
                      </p>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {responseTime.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">
                        {responseTime.description}
                      </p>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {availability.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">
                        {availability.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">
                  {locale === 'sv' ? 'Följ mig på sociala medier' : 'Connect on Social Media'}
                </h3>
                <p className="text-blue-100 mb-6">
                  {locale === 'sv' 
                    ? 'Håll dig uppdaterad med de senaste insikterna och projekten.'
                    : 'Stay updated with the latest insights and projects.'}
                </p>
                
                <div className="flex gap-4">
                  {contactContent.socialMedia.map((social, index) => {
                    const IconComponent = social.platform === 'LinkedIn' ? Linkedin : Twitter
                    return (
                      <Link key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="ghost" 
                          size="lg"
                          className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
                        >
                          <IconComponent className="h-5 w-5 mr-2" />
                          {social.platform}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="border-0 shadow-lg bg-slate-100 dark:bg-slate-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {locale === 'sv' ? 'Föredrar du ett direktsamtal?' : 'Prefer a Direct Call?'}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {locale === 'sv' 
                    ? 'Boka ett 30-minuters strategisamtal för att diskutera ditt projekt.'
                    : 'Book a 30-minute strategy call to discuss your project directly.'}
                </p>
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  asChild
                >
                  <Link href="https://calendly.com/chrish-fernando" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" />
                    {locale === 'sv' ? 'Boka ett samtal' : 'Schedule a Call'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Additional Information */}
        <div className="mt-16 text-center">
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {locale === 'sv' ? 'Vad du kan förvänta dig' : 'What You Can Expect'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {locale === 'sv' ? 'Snabbt svar' : 'Quick Response'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {locale === 'sv' 
                      ? 'Personligt svar inom 24 timmar'
                      : 'Personal response within 24 hours'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {locale === 'sv' ? 'Skräddarsydd approach' : 'Tailored Approach'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {locale === 'sv' 
                      ? 'Lösningar anpassade efter dina specifika behov'
                      : 'Solutions customized to your specific needs'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {locale === 'sv' ? 'Proven resultat' : 'Proven Results'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {locale === 'sv' 
                      ? 'Metoder som levererar mätbara resultat'
                      : 'Methodologies that deliver measurable outcomes'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
} 