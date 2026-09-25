import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/explore', '/stats'].map((path) => ({
    url: `${siteUrl}${path === '/' ? '' : path}`,
  }))
}
