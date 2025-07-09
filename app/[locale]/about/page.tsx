import type { Metadata } from 'next'
import { BioSection } from '@/components/sections/bio-section'
import { CredentialsSection } from '@/components/sections/credentials-section'
import { ImpactStatementSection } from '@/components/sections/impact-statement-section'
import { Footer } from '@/components/sections/footer'
import { type Locale } from '@/lib/i18n'

interface AboutPageProps {
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = params
  
  const title = locale === 'sv' 
    ? 'Om Chrish Fernando - Projektledningsexpert & Mentor' 
    : 'About Chrish Fernando - Project Management Expert & Mentor'
  
  const description = locale === 'sv'
    ? 'Lär känna Chrish Fernando, en erfaren projektledningsexpert med över 15 års erfarenhet av att transformera team och organisationer genom proven ledarskapsmetoder.'
    : 'Get to know Chrish Fernando, an experienced project management expert with over 15 years of transforming teams and organizations through proven leadership methodologies.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function AboutPage({ params }: AboutPageProps) {
  return (
    <>
      {/* Professional Bio Section */}
      <BioSection />
      
      {/* Professional Credentials Section */}
      <CredentialsSection />
      
      {/* Impact Statement Section */}
      <ImpactStatementSection />
      
      {/* Site Footer */}
      <Footer />
    </>
  )
} 