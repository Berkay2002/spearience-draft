import type { Metadata } from 'next'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/sections/footer'
import { type Locale } from '@/lib/i18n'
import { generateMetadata as generateSEOMetadata, generateStructuredData, SEOUtils, getStructuredDataScript } from '@/lib/seo'
import { getContentSync } from '@/lib/content'

interface ContactPageProps {
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = params
  const seoData = SEOUtils.contact(locale)
  return generateSEOMetadata(seoData)
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = params
  const seoData = SEOUtils.contact(locale)
  const serviceStructuredData = generateStructuredData(seoData, 'service')
  
  // Get content for components
  const content = getContentSync(locale)
  const { contact } = content

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getStructuredDataScript(serviceStructuredData)
        }}
      />

      {/* Contact Section with Form and Information */}
      <ContactSection contact={contact} />
      
      {/* Site Footer */}
      <Footer />
    </>
  )
} 