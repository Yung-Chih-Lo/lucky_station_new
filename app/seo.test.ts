import { describe, expect, it, vi } from 'vitest'
import robots from './robots'
import sitemap from './sitemap'
import { siteUrl } from '@/lib/site'
import { metadata as rootMetadata } from './layout'
import { metadata as statsMetadata } from './(public)/stats/page'
import { metadata as commentMetadata } from './(public)/comment/page'
import { metadata as adminMetadata } from './admin/layout'

vi.mock('server-only', () => ({}))
vi.mock('next/font/google', () => ({
  Noto_Sans_TC: () => ({ variable: 'sans' }),
  Noto_Serif_TC: () => ({ variable: 'serif' }),
}))
vi.mock('./(public)/stats/StatsClient', () => ({ default: () => null }))
vi.mock('./(public)/comment/CommentClient', () => ({ default: () => null }))
vi.mock('@/db/client', () => ({ getSqlite: () => null }))

describe('public search metadata', () => {
  it('lists only canonical public pages with the production host', () => {
    expect(sitemap()).toEqual([
      { url: `${siteUrl}` },
      { url: `${siteUrl}/explore` },
      { url: `${siteUrl}/stats` },
    ])
    expect(siteUrl).toBe('https://luckystation.vixight.com')
  })

  it('blocks private routes and exposes the sitemap without bot-specific overrides', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        disallow: ['/admin', '/api', '/comment'],
      },
      sitemap: `${siteUrl}/sitemap.xml`,
    })
  })

  it('uses separate canonical URLs and keeps private pages out of the index', () => {
    expect(rootMetadata.metadataBase?.toString()).toBe(`${siteUrl}/`)
    expect(rootMetadata.alternates?.canonical).toBeUndefined()
    expect(statsMetadata.alternates?.canonical).toBe('/stats')
    expect(statsMetadata.title).not.toBe(rootMetadata.title)
    expect(adminMetadata.robots).toMatchObject({ index: false, follow: false })
    expect(commentMetadata.robots).toMatchObject({ index: false, follow: false })
  })
})
