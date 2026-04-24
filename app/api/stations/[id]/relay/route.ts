import { NextResponse } from 'next/server'
import { getSqlite } from '@/db/client'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const stationId = parseInt(id, 10)
  if (isNaN(stationId)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  }

  const sqlite = getSqlite()

  const station = sqlite
    .prepare('SELECT id FROM stations WHERE id = ?')
    .get(stationId)
  if (!station) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const latest = sqlite
    .prepare(
      `SELECT id, content, created_at FROM comments
       WHERE station_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .get(stationId) as { id: number; content: string; created_at: number } | undefined

  const countRow = sqlite
    .prepare(`SELECT COUNT(*) AS c FROM comments WHERE station_id = ?`)
    .get(stationId) as { c: number }
  const count = countRow?.c ?? 0

  if (!latest) {
    return NextResponse.json({
      excerpt: null,
      handle: null,
      postedAt: null,
      count,
    })
  }

  const excerpt =
    latest.content.length > 50 ? latest.content.slice(0, 50) + '…' : latest.content
  const handle = String(latest.id).padStart(4, '0')
  const postedAt = new Date(latest.created_at).toISOString()

  return NextResponse.json({ excerpt, handle, postedAt, count })
}
