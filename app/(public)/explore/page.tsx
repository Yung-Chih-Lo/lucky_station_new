import ExploreClient from './ExploreClient'
import type { Metadata } from 'next'
import { getComments } from '@/lib/comments'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '旅人心得 | 坐火行',
  description: '閱讀旅人在台北捷運與台鐵車站留下的心得，尋找下一站的旅行靈感。',
  alternates: { canonical: '/explore' },
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ station_id?: string }>
}) {
  const stationId = (await searchParams).station_id ?? null
  const query = new URLSearchParams({ page: '1', limit: '5' })
  if (stationId) query.set('station_id', stationId)
  const initialData = getComments(query)

  return <ExploreClient key={stationId ?? 'all'} stationId={stationId} initialData={initialData} />
}
