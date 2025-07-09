import { NextResponse } from 'next/server'
import { SEO_CONFIG } from '@/lib/seo'
import { getContentSection } from '@/lib/content'

export async function GET() {
  const siteUrl = SEO_CONFIG.siteUrl
  const currentDate = new Date().toISOString()

  try {
    const enProjects = await getContentSection('en', 'featuredWork')
    const svProjects = await getContentSection('sv', 'featuredWork')

    const projectUrls: Array<{
      enUrl: string
      svUrl: string
      priority: string
      changefreq: string
    }> = []

    // Create paired URLs for English and Swedish versions
    enProjects.projects.forEach((project: any) => {
      const enUrl = `${siteUrl}/en/projects/${project.id}`
      const svUrl = `${siteUrl}/sv/projects/${project.id}`
      
      projectUrls.push({
        enUrl,
        svUrl,
        priority: '0.6',
        changefreq: 'monthly'
      })
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${projectUrls.map(project => `  <url>
    <loc>${project.enUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${project.changefreq}</changefreq>
    <priority>${project.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${project.enUrl}" />
    <xhtml:link rel="alternate" hreflang="sv" href="${project.svUrl}" />
  </url>
  <url>
    <loc>${project.svUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${project.changefreq}</changefreq>
    <priority>${project.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${project.enUrl}" />
    <xhtml:link rel="alternate" hreflang="sv" href="${project.svUrl}" />
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating projects sitemap:', error)
    
    // Return empty sitemap if content loading fails
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

    return new NextResponse(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    })
  }
} 