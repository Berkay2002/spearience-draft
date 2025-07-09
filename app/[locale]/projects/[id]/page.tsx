import type { Metadata } from 'next'
import { ProjectCaseStudy } from '@/components/sections/project-case-study'
import { Footer } from '@/components/sections/footer'
import type { Locale } from '@/lib/i18n'
import { getContentSection, type ProjectContent } from '@/lib/content'
import { notFound } from 'next/navigation'
import { generateMetadata as generateSEOMetadata, generateStructuredData, SEOUtils, getStructuredDataScript } from '@/lib/seo'

interface ProjectPageProps {
  params: {
    locale: Locale
    id: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, id } = params
  
  try {
    const featuredWorkContent = await getContentSection(locale, 'featuredWork')
    const project = featuredWorkContent.projects.find((p: ProjectContent) => p.id === id)
    
    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.'
      }
    }

    const seoData = SEOUtils.project(locale, id, project.title, project.description, project.image)
    return generateSEOMetadata(seoData)
  } catch (error) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    }
  }
}

export async function generateStaticParams() {
  // Generate static params for all projects in both locales
  const enContent = await getContentSection('en', 'featuredWork')
  const svContent = await getContentSection('sv', 'featuredWork')
  
  const params = []
  
  // English projects
  for (const project of enContent.projects) {
    params.push({
      locale: 'en',
      id: project.id,
    })
  }
  
  // Swedish projects  
  for (const project of svContent.projects) {
    params.push({
      locale: 'sv',
      id: project.id,
    })
  }
  
  return params
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, id } = params
  
  try {
    const featuredWorkContent = await getContentSection(locale, 'featuredWork')
    const project = featuredWorkContent.projects.find((p: ProjectContent) => p.id === id)
    
    if (!project) {
      notFound()
    }

    const seoData = SEOUtils.project(locale, id, project.title, project.description, project.image)
    const articleStructuredData = generateStructuredData(seoData, 'article')

    return (
      <>
        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: getStructuredDataScript(articleStructuredData)
          }}
        />

        {/* Project Case Study */}
        <ProjectCaseStudy project={project} />
        
        {/* Site Footer */}
        <Footer />
      </>
    )
  } catch (error) {
    notFound()
  }
} 