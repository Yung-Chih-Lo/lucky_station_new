import { getSqlite } from '@/db/client'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

export type Comment = {
  id: number
  station_id: number
  content: string
  created_at: number
  name_zh: string
  transport_type: 'mrt' | 'tra'
  county: string | null
}

export type CommentsResult = {
  comments: Comment[]
  total: number
  page: number
  total_pages: number
}

export function getComments(searchParams: URLSearchParams): CommentsResult {
  const transportType = searchParams.get('transport_type')
  const stationIdRaw = searchParams.get('station_id')
  const q = searchParams.get('q')?.trim() ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const requestedLimit = parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10)
  const limit = Math.min(MAX_LIMIT, Math.max(1, isNaN(requestedLimit) ? DEFAULT_LIMIT : requestedLimit))
  const offset = (page - 1) * limit

  const wheres: string[] = []
  const params: unknown[] = []

  if (transportType === 'mrt' || transportType === 'tra') {
    wheres.push('s.transport_type = ?')
    params.push(transportType)
  }

  if (stationIdRaw) {
    const stationId = parseInt(stationIdRaw, 10)
    if (!isNaN(stationId)) {
      wheres.push('c.station_id = ?')
      params.push(stationId)
    }
  }

  if (q) {
    wheres.push('c.content LIKE ?')
    params.push(`%${q}%`)
  }

  const whereSql = wheres.length ? `WHERE ${wheres.join(' AND ')}` : ''
  const sqlite = getSqlite()
  const total = (
    sqlite
      .prepare(
        `SELECT COUNT(*) AS n FROM comments c
         JOIN stations s ON s.id = c.station_id
         ${whereSql}`,
      )
      .get(...params) as { n: number }
  ).n
  const comments = sqlite
    .prepare(
      `SELECT c.id, c.station_id, c.content, c.created_at,
              s.name_zh, s.transport_type, s.county
       FROM comments c
       JOIN stations s ON s.id = c.station_id
       ${whereSql}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset) as Comment[]

  return {
    comments,
    total,
    page,
    total_pages: Math.max(1, Math.ceil(total / limit)),
  }
}
