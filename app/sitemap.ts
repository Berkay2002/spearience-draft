import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '@/lib/seo'
import { getContentSection } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SEO_CONFIG.siteUrl
  const currentDate = new Date().toISOString()

  // Static pages for both locales
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage (English - default)
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Homepage (Swedish)
    {
      url: `${siteUrl}/sv`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // About pages
    {
      url: `${siteUrl}/en/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/sv/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Projects pages
    {
      url: `${siteUrl}/en/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sv/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Contact pages
    {
      url: `${siteUrl}/en/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/sv/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic project pages
  try {
    const enProjects = await getContentSection('en', 'featuredWork')
    const svProjects = await getContentSection('sv', 'featuredWork')

    const projectPages: MetadataRoute.Sitemap = []

    // English project pages
    enProjects.projects.forEach((project: any) => {
      projectPages.push({
        url: `${siteUrl}/en/projects/${project.id}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })

    // Swedish project pages  
    svProjects.projects.forEach((project: any) => {
      projectPages.push({
        url: `${siteUrl}/sv/projects/${project.id}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })

    return [...staticPages, ...projectPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if dynamic content fails
    return staticPages
  }
} 