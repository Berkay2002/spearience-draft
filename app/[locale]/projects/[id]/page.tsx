import type { Metadata } from 'next'
import { ProjectCaseStudy } from '@/components/sections/project-case-study'
import { Footer } from '@/components/sections/footer'
import type { Locale } from '@/lib/i18n'
import { getContentSection, type ProjectContent } from '@/lib/content'
import { notFound } from 'next/navigation'

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

    const title = locale === 'sv' 
      ? `${project.title} - Projektfallstudie` 
      : `${project.title} - Project Case Study`
    
    const description = project.description

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        locale: locale === 'sv' ? 'sv_SE' : 'en_US',
        images: [
          {
            url: project.image,
            alt: project.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [project.image],
      },
    }
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

    return (
      <>
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