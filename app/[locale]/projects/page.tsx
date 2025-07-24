import type { Metadata } from 'next'
import { ProjectGrid } from '@/components/sections/project-grid'
import { Footer } from '@/components/sections/footer'
import { type Locale } from '@/lib/i18n'
import { generateMetadata as generateSEOMetadata, generateStructuredData, SEOUtils, getStructuredDataScript } from '@/lib/seo'
import { getContentSync } from '@/lib/content'

interface ProjectsPageProps {
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = params
  const seoData = SEOUtils.projects(locale)
  return generateSEOMetadata(seoData)
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = params
  const seoData = SEOUtils.projects(locale)
  const serviceStructuredData = generateStructuredData(seoData, 'service')
  
  // Get content for components
  const content = getContentSync(locale)
  const { featuredWork } = content

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getStructuredDataScript(serviceStructuredData)
        }}
      />

      {/* Project Grid with Filtering */}
      <ProjectGrid projects={featuredWork.projects} />
      
      {/* Site Footer */}
      <Footer />
    </>
  )
} 