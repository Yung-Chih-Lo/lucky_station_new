import { NextResponse } from 'next/server'
import { getSqlite } from '@/db/client'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stationId = parseInt(id, 10)
  if (isNaN(stationId)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
  }

  const db = getSqlite()

  const station = db.prepare('SELECT id FROM stations WHERE id = ?').get(stationId)
  if (!station) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const row = db
    .prepare('SELECT content FROM comments WHERE station_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(stationId) as { content: string } | undefined

  if (!row) {
    return new Response(null, { status: 204 })
  }

  return NextResponse.json({ excerpt: row.content.slice(0, 80) })
}
