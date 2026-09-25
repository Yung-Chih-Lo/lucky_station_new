import type { Metadata } from 'next'
import StatsClient from './StatsClient'
import { getSqlite } from '@/db/client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '抽站排行榜 | 坐火行',
  description: '查看坐火行的台北捷運與台鐵熱門抽站排行，探索大家抽到的下一站。',
  alternates: { canonical: '/stats' },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '坐火行',
    title: '抽站排行榜 | 坐火行',
    description: '查看台北捷運與台鐵熱門抽站排行。',
    url: '/stats',
  },
}

type Ranking = {
  station_id: number
  name_zh: string
  transport_type: 'mrt' | 'tra'
  county: string | null
  pick_count: number
}

function loadRankings(transportType?: 'mrt' | 'tra'): Ranking[] {
  const sqlite = getSqlite()
  const wheres: string[] = []
  const params: unknown[] = []
  if (transportType) {
    wheres.push('p.transport_type = ?')
    params.push(transportType)
  }
  const whereSql = wheres.length ? `WHERE ${wheres.join(' AND ')}` : ''

  return sqlite
    .prepare(
      `SELECT p.station_id, s.name_zh, s.transport_type, s.county,
              COUNT(*) AS pick_count
       FROM station_picks p
       JOIN stations s ON s.id = p.station_id
       ${whereSql}
       GROUP BY p.station_id, s.name_zh, s.transport_type, s.county
       ORDER BY pick_count DESC, s.name_zh ASC
       LIMIT 100`,
    )
    .all(...params) as Ranking[]
}

function loadTotalPicks(): number {
  const sqlite = getSqlite()
  const row = sqlite.prepare<[], { total: number }>('SELECT COUNT(*) AS total FROM station_picks').get()
  return row?.total ?? 0
}

export default function StatsPage() {
  const all = loadRankings()
  const mrt = loadRankings('mrt')
  const tra = loadRankings('tra')
  const totalPicks = loadTotalPicks()
  return <StatsClient all={all} mrt={mrt} tra={tra} totalPicks={totalPicks} />
}
