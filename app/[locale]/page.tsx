import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { ExpertiseTabs } from '@/components/sections/expertise-tabs'
import { ProcessShowcase } from '@/components/sections/process-showcase'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FeaturedWork } from '@/components/sections/featured-work'
import { Footer } from '@/components/sections/footer'
// import { CookieConsent } from '@/components/cookie-consent'
import { type Locale } from '@/lib/i18n'
import { generateMetadata as generateSEOMetadata, generateStructuredData, SEOUtils, getStructuredDataScript } from '@/lib/seo'

interface HomePageProps {
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = params
  const seoData = SEOUtils.homepage(locale)
  return generateSEOMetadata(seoData)
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params
  const seoData = SEOUtils.homepage(locale)
  const personStructuredData = generateStructuredData(seoData, 'person')
  const organizationStructuredData = generateStructuredData(seoData, 'organization')

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getStructuredDataScript(personStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getStructuredDataScript(organizationStructuredData)
        }}
      />

      {/* Hero Section */}
      <HeroSection />
      
      {/* Areas of Expertise */}
      <ExpertiseTabs />
      
      {/* My Process in Action */}
      <ProcessShowcase />
      
      {/* What Clients Say */}
      <TestimonialsSection />
      
      {/* Featured Work */}
      <FeaturedWork />
      
      {/* Site Footer */}
      <Footer />
      
      {/* Cookie Consent Banner */}
      {/* <CookieConsent /> */}
    </>
  )
} 