import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'

// Base configuration for SEO
export const SEO_CONFIG = {
  siteName: 'Chrish Fernando',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://chrish-fernando.com',
  defaultLocale: 'en' as Locale,
  locales: ['en', 'sv'] as Locale[],
  author: {
    name: 'Chrish Fernando',
    email: 'contact@chrish-fernando.com',
    linkedin: 'https://linkedin.com/in/chrish-fernando',
    location: 'Stockholm, Sweden'
  },
  social: {
    linkedin: 'https://linkedin.com/in/chrish-fernando',
    twitter: '@chrishfernando', // If available
  },
  defaultImage: '/images/chrish/profile-hero.jpg',
  defaultImageAlt: 'Chrish Fernando - Project Management Expert, Mentor & Sports Leadership Consultant'
}

// SEO metadata interface
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  locale: Locale
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noIndex?: boolean
  canonical?: string
}

// Generate base metadata with all SEO enhancements
export function generateMetadata(seoData: SEOData): Metadata {
  const {
    title,
    description,
    keywords = [],
    locale,
    path,
    image = SEO_CONFIG.defaultImage,
    imageAlt = SEO_CONFIG.defaultImageAlt,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = SEO_CONFIG.author.name,
    noIndex = false,
    canonical
  } = seoData

  const url = `${SEO_CONFIG.siteUrl}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`
  const canonicalUrl = canonical || url

  // Generate alternate language URLs
  const alternateLanguages: Record<string, string> = {}
  SEO_CONFIG.locales.forEach(lang => {
    if (lang !== locale) {
      alternateLanguages[lang] = `${SEO_CONFIG.siteUrl}/${lang}${path === '/' ? '' : path}`
    }
  })

  const metadata: Metadata = {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: {
      default: title,
      template: `%s | ${SEO_CONFIG.siteName}`
    },
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author, url: SEO_CONFIG.author.linkedin }],
    creator: author,
    publisher: SEO_CONFIG.siteName,
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical and alternates
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

    // OpenGraph
    openGraph: {
      type,
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      url,
      siteName: SEO_CONFIG.siteName,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: 'image/jpeg'
        }
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(type === 'article' && {
        article: {
          author: [author],
          publishedTime,
          modifiedTime,
          section: 'Professional Services',
          tags: keywords,
        }
      }),
      ...(type === 'profile' && {
        profile: {
          firstName: 'Chrish',
          lastName: 'Fernando',
          username: 'chrishfernando',
          gender: 'male'
        }
      })
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.social.twitter,
      creator: SEO_CONFIG.social.twitter,
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        }
      ],
    },

    // Additional meta tags
    other: {
      'theme-color': '#667eea',
      'color-scheme': 'light dark',
      'format-detection': 'telephone=no',
    },
  }

  return metadata
}

// Generate JSON-LD structured data
export function generateStructuredData(seoData: SEOData, type: 'person' | 'organization' | 'article' | 'service') {
  const baseData = {
    '@context': 'https://schema.org',
    url: `${SEO_CONFIG.siteUrl}${seoData.path}`,
    name: seoData.title,
    description: seoData.description,
    image: seoData.image?.startsWith('http') 
      ? seoData.image 
      : `${SEO_CONFIG.siteUrl}${seoData.image || SEO_CONFIG.defaultImage}`,
  }

  switch (type) {
    case 'person':
      return {
        ...baseData,
        '@type': 'Person',
        givenName: 'Chrish',
        familyName: 'Fernando',
        jobTitle: 'Project Management Expert & Mentor',
        worksFor: {
          '@type': 'Organization',
          name: 'Independent Consultant'
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Stockholm',
          addressCountry: 'SE'
        },
        email: SEO_CONFIG.author.email,
        sameAs: [
          SEO_CONFIG.social.linkedin
        ],
        expertise: [
          'Project Management',
          'Leadership Development', 
          'Sports Consulting',
          'Team Mentorship'
        ]
      }

    case 'organization':
      return {
        ...baseData,
        '@type': 'ProfessionalService',
        founder: {
          '@type': 'Person',
          name: SEO_CONFIG.author.name
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Stockholm',
          addressCountry: 'SE'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: SEO_CONFIG.author.email,
          availableLanguage: ['English', 'Swedish']
        },
        serviceType: [
          'Project Management Consulting',
          'Leadership Development',
          'Sports Team Consulting', 
          'Professional Mentorship'
        ],
        areaServed: {
          '@type': 'Country',
          name: 'Sweden'
        }
      }

    case 'article':
      return {
        ...baseData,
        '@type': 'Article',
        author: {
          '@type': 'Person',
          name: SEO_CONFIG.author.name,
          url: SEO_CONFIG.author.linkedin
        },
        publisher: {
          '@type': 'Organization',
          name: SEO_CONFIG.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${SEO_CONFIG.siteUrl}/images/logo.png`
          }
        },
        datePublished: seoData.publishedTime,
        dateModified: seoData.modifiedTime || seoData.publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SEO_CONFIG.siteUrl}${seoData.path}`
        }
      }

    case 'service':
      return {
        ...baseData,
        '@type': 'Service',
        provider: {
          '@type': 'Person',
          name: SEO_CONFIG.author.name,
          url: SEO_CONFIG.author.linkedin
        },
        areaServed: {
          '@type': 'Country',
          name: 'Sweden'
        },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${SEO_CONFIG.siteUrl}/contact`,
          serviceSmsNumber: null,
          servicePhone: null
        }
      }

    default:
      return baseData
  }
}

// SEO utility functions for common page types
export const SEOUtils = {
  // Homepage SEO
  homepage: (locale: Locale): SEOData => ({
    title: locale === 'sv' 
      ? 'Chrish Fernando - Projektledningsexpert, Mentor & Idrottsledarskapskonsult'
      : 'Chrish Fernando - Project Management Expert, Mentor & Sports Leadership Consultant',
    description: locale === 'sv'
      ? 'Transformerar team och projekt genom beprövade ledarskapsmetoder, strategisk mentorskap och innovativa idrottsinspirerade tillvägagångssätt för professionell utveckling.'
      : 'Transforming teams and projects through proven leadership methodologies, strategic mentorship, and innovative sports-inspired approaches to professional development.',
    keywords: [
      'project management', 'leadership', 'mentorship', 'sports consulting', 
      'Stockholm', 'business consulting', 'team development', 'strategic planning'
    ],
    locale,
    path: locale === 'en' ? '/' : `/${locale}`,
    type: 'website'
  }),

  // About page SEO  
  about: (locale: Locale): SEOData => ({
    title: locale === 'sv' 
      ? 'Om Chrish Fernando - Projektledningsexpert & Mentor'
      : 'About Chrish Fernando - Project Management Expert & Mentor',
    description: locale === 'sv'
      ? 'Lär känna Chrish Fernando, en erfaren projektledningsexpert med över 15 års erfarenhet av att transformera team och organisationer genom beprövade ledarskapsmetoder.'
      : 'Get to know Chrish Fernando, an experienced project management expert with over 15 years of transforming teams and organizations through proven leadership methodologies.',
    keywords: [
      'Chrish Fernando', 'biography', 'experience', 'credentials', 
      'project management expert', 'leadership consultant', 'professional background'
    ],
    locale,
    path: `/${locale}/about`,
    type: 'profile',
    image: '/images/chrish/profile-about.jpg'
  }),

  // Projects page SEO
  projects: (locale: Locale): SEOData => ({
    title: locale === 'sv' 
      ? 'Projekt - Chrish Fernando Portfolio'
      : 'Projects - Chrish Fernando Portfolio',
    description: locale === 'sv'
      ? 'Utforska Chrish Fernandos omfattande projektportfölj inom projektledning, mentorskap och idrottsledarskap. Detaljerade fallstudier med mätbara resultat och beprövade metoder.'
      : 'Explore Chrish Fernando\'s comprehensive project portfolio spanning project management, mentorship, and sports leadership. Detailed case studies with measurable results and proven methodologies.',
    keywords: [
      'portfolio', 'case studies', 'project results', 'leadership outcomes',
      'consulting projects', 'transformation projects', 'success stories'
    ],
    locale,
    path: `/${locale}/projects`,
    type: 'website'
  }),

  // Contact page SEO
  contact: (locale: Locale): SEOData => ({
    title: locale === 'sv' 
      ? 'Kontakt - Chrish Fernando | Projektledning & Mentorskap'
      : 'Contact - Chrish Fernando | Project Management & Mentorship',
    description: locale === 'sv'
      ? 'Kontakta Chrish Fernando för projektledning, mentorskap och idrottsledarskapskonsultation. Baserad i Stockholm. Låt oss diskutera ditt nästa projekt.'
      : 'Contact Chrish Fernando for project management, mentorship, and sports leadership consulting. Based in Stockholm. Let\'s discuss your next project.',
    keywords: [
      'contact', 'consultation', 'Stockholm', 'project management services',
      'leadership consulting', 'get in touch', 'business inquiry'
    ],
    locale,
    path: `/${locale}/contact`,
    type: 'website'
  }),

  // Dynamic project page SEO
  project: (locale: Locale, projectId: string, projectTitle: string, projectDescription: string, projectImage?: string): SEOData => ({
    title: locale === 'sv' 
      ? `${projectTitle} - Projektfallstudie`
      : `${projectTitle} - Project Case Study`,
    description: projectDescription,
    keywords: [
      'case study', 'project management', 'leadership', 'consulting',
      'transformation', 'results', 'methodology', projectTitle.toLowerCase()
    ],
    locale,
    path: `/${locale}/projects/${projectId}`,
    type: 'article',
    image: projectImage,
    publishedTime: new Date().toISOString(), // Could be dynamic
    modifiedTime: new Date().toISOString()
  })
}

// Helper function to generate structured data script content
export function getStructuredDataScript(data: any): string {
  return JSON.stringify(data, null, 2)
} 