import type { Metadata } from 'next'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/sections/footer'
import { type Locale } from '@/lib/i18n'

interface ContactPageProps {
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = params
  
  const title = locale === 'sv' 
    ? 'Kontakt - Chrish Fernando | Projektledning & Mentorskap' 
    : 'Contact - Chrish Fernando | Project Management & Mentorship'
  
  const description = locale === 'sv'
    ? 'Kontakta Chrish Fernando för projektledning, mentorskap och idrottsledarskapskonsultation. Baserad i Stockholm. Låt oss diskutera ditt nästa projekt.'
    : 'Contact Chrish Fernando for project management, mentorship, and sports leadership consulting. Based in Stockholm. Let\'s discuss your next project.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function ContactPage({ params }: ContactPageProps) {
  return (
    <>
      {/* Contact Section with Form and Information */}
      <ContactSection />
      
      {/* Site Footer */}
      <Footer />
    </>
  )
} 