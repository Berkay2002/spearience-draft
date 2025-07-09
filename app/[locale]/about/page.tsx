import type { Metadata } from 'next'
import { BioSection } from '@/components/sections/bio-section'
import { CredentialsSection } from '@/components/sections/credentials-section'
import { ImpactStatementSection } from '@/components/sections/impact-statement-section'
import { Footer } from '@/components/sections/footer'
import { type Locale } from '@/lib/i18n'
import { generateMetadata as generateSEOMetadata, generateStructuredData, SEOUtils, getStructuredDataScript } from '@/lib/seo'

interface AboutPageProps {
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = params
  const seoData = SEOUtils.about(locale)
  return generateSEOMetadata(seoData)
}

export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = params
  const seoData = SEOUtils.about(locale)
  const personStructuredData = generateStructuredData(seoData, 'person')

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getStructuredDataScript(personStructuredData)
        }}
      />

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