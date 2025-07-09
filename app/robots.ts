import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SEO_CONFIG.siteUrl

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/en/',
          '/sv/',
          '/en/about',
          '/sv/about', 
          '/en/projects',
          '/sv/projects',
          '/en/contact',
          '/sv/contact',
          '/en/projects/*',
          '/sv/projects/*',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/en/',
          '/sv/',
          '/en/about',
          '/sv/about', 
          '/en/projects',
          '/sv/projects',
          '/en/contact',
          '/sv/contact',
          '/en/projects/*',
          '/sv/projects/*',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      }
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/sitemap-pages.xml`,
      `${siteUrl}/sitemap-projects.xml`,
    ],
    host: siteUrl,
  }
} 