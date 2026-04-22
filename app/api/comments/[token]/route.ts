import { NextResponse } from 'next/server'
import { getSqlite } from '@/db/client'
import { isValidToken } from '@/lib/community/token'
import { commentRequestSchema } from '@/lib/community/validators'
import { enforceRateLimit, getClientIp } from '@/lib/community/rate-limit'

type PickRow = {
  id: number
  station_id: number
  transport_type: 'mrt' | 'tra'
  comment_used: number
  name_zh: string
  name_en: string | null
  county: string | null
}

function loadPick(sqlite: ReturnType<typeof getSqlite>, token: string): PickRow | undefined {
  return sqlite
    .prepare(
      `SELECT p.id, p.station_id, p.transport_type, p.comment_used,
              s.name_zh, s.name_en, s.county
       FROM station_picks p
       JOIN stations s ON s.id = p.station_id
       WHERE p.token = ?`,
    )
    .get(token) as PickRow | undefined
}

function pickResponse(pick: PickRow) {
  return {
    station: {
      id: pick.station_id,
      name_zh: pick.name_zh,
      name_en: pick.name_en,
      transport_type: pick.transport_type,
      county: pick.county,
    },
    comment_used: pick.comment_used,
  }
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params
  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 })
  }

  const sqlite = getSqlite()
  const pick = loadPick(sqlite, token)
  if (!pick) {
    return NextResponse.json({ error: 'token_not_found' }, { status: 404 })
  }

  return NextResponse.json(pickResponse(pick))
}

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params
  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = commentRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_body', details: parsed.error.issues[0] },
      { status: 400 },
    )
  }

  const sqlite = getSqlite()
  const pick = loadPick(sqlite, token)
  if (!pick) {
    return NextResponse.json({ error: 'token_not_found' }, { status: 404 })
  }
  if (pick.comment_used) {
    return NextResponse.json({ error: 'token_used' }, { status: 409 })
  }

  const ip = getClientIp(req.headers)
  const limit = enforceRateLimit(sqlite, ip, 'comment')
  if (!limit.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const now = Date.now()
  const tx = sqlite.transaction(() => {
    const updated = sqlite
      .prepare(
        `UPDATE station_picks SET comment_used = 1
         WHERE id = ? AND comment_used = 0`,
      )
      .run(pick.id)
    if (updated.changes === 0) {
      throw new Error('token_used')
    }
    sqlite
      .prepare(
        `INSERT INTO comments (pick_id, station_id, content, created_at)
         VALUES (?, ?, ?, ?)`,
      )
      .run(pick.id, pick.station_id, parsed.data.content, now)
  })

  try {
    tx()
  } catch (e) {
    if ((e as Error).message === 'token_used') {
      return NextResponse.json({ error: 'token_used' }, { status: 409 })
    }
    throw e
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
