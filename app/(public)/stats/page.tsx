import StatsClient from './StatsClient'
import { getSqlite } from '@/db/client'

export const dynamic = 'force-dynamic'

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

export default function StatsPage() {
  const all = loadRankings()
  const mrt = loadRankings('mrt')
  const tra = loadRankings('tra')
  return <StatsClient all={all} mrt={mrt} tra={tra} />
}
