import type { Metadata } from 'next'
import { BioSection } from '@/components/sections/bio-section'
import { CredentialsSection } from '@/components/sections/credentials-section'
import { Footer } from '@/components/sections/footer'
import { type Locale } from '@/lib/i18n'
import { generateMetadata as generateSEOMetadata, generateStructuredData, SEOUtils, getStructuredDataScript } from '@/lib/seo'
import { getContentSync } from '@/lib/content'

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
  
  // Get content for components
  const content = getContentSync(locale)
  const { bio, credentials } = content

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
      <BioSection bio={bio} />
      
      {/* Professional Credentials Section */}
      <CredentialsSection credentials={credentials} />
      
      {/* Site Footer */}
      <Footer />
    </>
  )
} 