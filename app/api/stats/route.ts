import { NextResponse } from 'next/server'
import { getSqlite } from '@/db/client'

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 200

export async function GET(req: Request) {
  const url = new URL(req.url)
  const transportType = url.searchParams.get('transport_type')
  const requestedLimit = parseInt(
    url.searchParams.get('limit') ?? String(DEFAULT_LIMIT),
    10,
  )
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, isNaN(requestedLimit) ? DEFAULT_LIMIT : requestedLimit),
  )

  const sqlite = getSqlite()

  const wheres: string[] = []
  const params: unknown[] = []
  if (transportType === 'mrt' || transportType === 'tra') {
    wheres.push('p.transport_type = ?')
    params.push(transportType)
  }
  const whereSql = wheres.length ? `WHERE ${wheres.join(' AND ')}` : ''

  const rows = sqlite
    .prepare(
      `SELECT p.station_id, s.name_zh, s.transport_type, s.county,
              COUNT(*) AS pick_count
       FROM station_picks p
       JOIN stations s ON s.id = p.station_id
       ${whereSql}
       GROUP BY p.station_id, s.name_zh, s.transport_type, s.county
       ORDER BY pick_count DESC, s.name_zh ASC
       LIMIT ?`,
    )
    .all(...params, limit) as Array<{
    station_id: number
    name_zh: string
    transport_type: 'mrt' | 'tra'
    county: string | null
    pick_count: number
  }>

  return NextResponse.json({ rankings: rows })
}
