'use client'

import { useContactContent, useLocale } from '@/hooks/use-content'
import { ContactForm } from '@/components/forms/contact-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, MapPin, Clock, Linkedin, Twitter, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface ContactSectionProps {
  className?: string
}

export function ContactSection({ className }: ContactSectionProps) {
  const contactContent = useContactContent()
  const locale = useLocale()

  const responseTime = {
    title: locale === 'sv' ? 'Snabbt svar' : 'Quick Response',
    description: locale === 'sv' ? 'Jag svarar vanligtvis inom 24 timmar' : 'I typically respond within 24 hours'
  }

  const availability = {
    title: locale === 'sv' ? 'Tillgänglighet' : 'Availability',
    description: locale === 'sv' ? 'Måndag - Fredag, 9:00 - 18:00 CET' : 'Monday - Friday, 9:00 AM - 6:00 PM CET'
  }

  return (
    <section className={`section-padding-lg relative overflow-hidden ${className}`}>
      <div className="container-professional">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title mb-6">
            {contactContent.title}
          </h2>
          <p className="section-subtitle max-w-3xl mx-auto mb-8">
            {contactContent.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-professional mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Form */}
          <div className="space-y-8">
            <ContactForm />
          </div>

          {/* Right Column - Contact Information */}
          <div className="space-y-8">
            {/* Contact Information Card */}
            <Card className="border-0 shadow-professional bg-card border border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {locale === 'sv' ? 'Kontaktinformation' : 'Contact Information'}
                </h3>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {locale === 'sv' ? 'E-post' : 'Email'}
                      </h4>
                      <a 
                        href={`mailto:${contactContent.email}`}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {contactContent.email}
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {locale === 'sv' ? 'Plats' : 'Location'}
                      </h4>
                      <p className="text-muted-foreground">
                        {contactContent.location}
                      </p>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {responseTime.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {responseTime.description}
                      </p>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {availability.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {availability.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="border-0 shadow-professional bg-gradient-professional text-white relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              
              <CardContent className="p-8 relative z-10">
                <h3 className="text-xl font-bold mb-4">
                  {locale === 'sv' ? 'Följ mig på sociala medier' : 'Connect on Social Media'}
                </h3>
                <p className="text-white/90 mb-6 leading-relaxed">
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
                          className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 transition-all duration-200"
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
            <Card className="border-0 shadow-professional bg-card border border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {locale === 'sv' ? 'Föredrar du ett direktsamtal?' : 'Prefer a Direct Call?'}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {locale === 'sv' 
                    ? 'Boka ett 30-minuters strategisamtal för att diskutera ditt projekt.'
                    : 'Book a 30-minute strategy call to discuss your project directly.'}
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-medium transition-all duration-200"
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
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-[200px] h-[200px] bg-success/5 rounded-full blur-2xl"></div>
      </div>
    </section>
  )
} 