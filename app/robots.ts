import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin', '/api', '/comment'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
