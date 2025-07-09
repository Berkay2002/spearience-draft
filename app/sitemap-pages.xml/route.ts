import { NextResponse } from 'next/server'
import { SEO_CONFIG } from '@/lib/seo'

export async function GET() {
  const siteUrl = SEO_CONFIG.siteUrl
  const currentDate = new Date().toISOString()

  const staticPages = [
    { url: siteUrl, priority: '1.0', changefreq: 'weekly' },
    { url: `${siteUrl}/sv`, priority: '1.0', changefreq: 'weekly' },
    { url: `${siteUrl}/en/about`, priority: '0.9', changefreq: 'monthly' },
    { url: `${siteUrl}/sv/about`, priority: '0.9', changefreq: 'monthly' },
    { url: `${siteUrl}/en/projects`, priority: '0.8', changefreq: 'weekly' },
    { url: `${siteUrl}/sv/projects`, priority: '0.8', changefreq: 'weekly' },
    { url: `${siteUrl}/en/contact`, priority: '0.7', changefreq: 'monthly' },
    { url: `${siteUrl}/sv/contact`, priority: '0.7', changefreq: 'monthly' },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.url.includes('/sv') ? 
      `<xhtml:link rel="alternate" hreflang="en" href="${page.url.replace('/sv', '/en')}" />
    <xhtml:link rel="alternate" hreflang="sv" href="${page.url}" />` :
      `<xhtml:link rel="alternate" hreflang="en" href="${page.url}" />
    <xhtml:link rel="alternate" hreflang="sv" href="${page.url.replace('/en', '/sv')}" />`
    }
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
} 