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

            {/* Social Media Links - Theme Aware */}
            <Card className="border-0 shadow-professional relative overflow-hidden
              bg-gradient-professional text-white 
              dark:bg-gradient-professional dark:text-white
              light:bg-gradient-to-br light:from-secondary light:to-muted light:text-foreground">
              {/* Background decoration - Theme aware */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl
                bg-white/10 dark:bg-white/10 light:bg-foreground/5"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl
                bg-white/5 dark:bg-white/5 light:bg-foreground/3"></div>
              
              <CardContent className="p-8 relative z-10">
                <h3 className="text-xl font-bold mb-4
                  text-white dark:text-white light:text-foreground">
                  {locale === 'sv' ? 'Följ mig på sociala medier' : 'Connect on Social Media'}
                </h3>
                <p className="mb-6 leading-relaxed
                  text-white/90 dark:text-white/90 light:text-muted-foreground">
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
                          className="transition-all duration-200
                            bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30
                            dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 dark:hover:border-white/30
                            light:bg-foreground/10 light:hover:bg-foreground/20 light:text-foreground light:border-foreground/20 light:hover:border-foreground/30"
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