import type { Metadata } from 'next'
import { ProjectGrid } from '@/components/sections/project-grid'
import { Footer } from '@/components/sections/footer'
import { type Locale } from '@/lib/i18n'

interface ProjectsPageProps {
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = params
  
  const title = locale === 'sv' 
    ? 'Projekt - Chrish Fernando Portfolio' 
    : 'Projects - Chrish Fernando Portfolio'
  
  const description = locale === 'sv'
    ? 'Utforska Chrish Fernandos omfattande projektportfölj inom projektledning, mentorskap och idrottsledarskap. Detaljerade fallstudier med mätbara resultat och beprövade metoder.'
    : 'Explore Chrish Fernando\'s comprehensive project portfolio spanning project management, mentorship, and sports leadership. Detailed case studies with measurable results and proven methodologies.'

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

export default function ProjectsPage({ params }: ProjectsPageProps) {
  return (
    <>
      {/* Project Grid with Filtering */}
      <ProjectGrid />
      
      {/* Site Footer */}
      <Footer />
    </>
  )
} 