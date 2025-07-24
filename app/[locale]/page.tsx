import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { ExpertiseTabs } from '@/components/sections/expertise-tabs'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FeaturedWork } from '@/components/sections/featured-work'
import { Footer } from '@/components/sections/footer'
// import { CookieConsent } from '@/components/cookie-consent'
import { type Locale } from '@/lib/i18n'
import { generateMetadata as generateSEOMetadata, generateStructuredData, SEOUtils, getStructuredDataScript } from '@/lib/seo'
import { getContentSync } from '@/lib/content'

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
  
  // Get content for components
  const content = getContentSync(locale)
  const { hero, expertise, testimonials, featuredWork } = content

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

      {/* Hero Section - No top spacing */}
      <HeroSection hero={hero} />
      
      {/* Visual Break - Generous spacing for section transition */}
      <div className="section-transition-spacing"></div>
      
      {/* Areas of Expertise - Elevated centerpiece with depth */}
      <div className="bg-secondary/40 relative overflow-hidden section-spacing-primary">
        {/* Enhanced background for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-muted/30"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background/50 to-transparent"></div>
        
        <div className="relative z-10">
          <ExpertiseTabs expertise={expertise} />
        </div>
      </div>
      
      {/* What Clients Say - Primary background with rhythm */}
      <TestimonialsSection testimonials={testimonials} />
      
      {/* Visual Break - Section transition */}
      <div className="section-transition-spacing"></div>
      
      {/* Featured Work - Subtle depth with proper spacing */}
      <div className="bg-muted/30 relative section-spacing-primary">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-secondary/10"></div>
        
        <div className="relative z-10">
          <FeaturedWork featuredWork={featuredWork} />
        </div>
      </div>
      
      {/* Site Footer */}
      <Footer />
      
      {/* Cookie Consent Banner */}
      {/* <CookieConsent /> */}
    </>
  )
} 