import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

type AnyFn = (...args: unknown[]) => unknown

type Handlers = {
  // MRT lookup: SELECT id, name_zh, name_en FROM stations WHERE id = ? AND transport_type = 'mrt'
  mrtStation?: (id: number) => { id: number; name_zh: string; name_en: string | null } | undefined
  // Lines for a station
  stationLines?: (id: number) => { line_code: string }[]
  // TRA pick: SELECT ... FROM stations WHERE transport_type = 'tra' AND county IN (...)
  traStation?: (
    counties: string[],
  ) =>
    | { id: number; name_zh: string; name_en: string | null; county: string }
    | undefined
  // Comment count
  commentCount?: (stationId: number) => number
}

type CallLog = {
  inserts: Array<{ stationId: number; transportType: string; token: string; pickedAt: number }>
}

function makeSqlite(handlers: Handlers, calls: CallLog) {
  return {
    transaction: (fn: AnyFn) => () => fn(),
    prepare: (sql: string) => {
      // Rate limit: prune
      if (sql.includes('DELETE FROM rate_limits')) {
        return { run: () => ({ changes: 0 }) }
      }
      // Rate limit: SELECT count
      if (sql.includes('FROM rate_limits')) {
        return { get: () => undefined } // no existing window → allowed
      }
      // Rate limit: INSERT
      if (sql.includes('INSERT INTO rate_limits')) {
        return { run: () => ({ changes: 1 }) }
      }
      // Rate limit: UPDATE (won't be hit because SELECT returns undefined, but stub anyway)
      if (sql.includes('UPDATE rate_limits')) {
        return { run: () => ({ changes: 1 }) }
      }
      // MRT station lookup
      if (
        sql.includes('FROM stations') &&
        sql.includes("transport_type = 'mrt'") &&
        sql.includes('WHERE id = ?')
      ) {
        return { get: (id: number) => handlers.mrtStation?.(id) }
      }
      // TRA random pick
      if (sql.includes('FROM stations') && sql.includes("transport_type = 'tra'")) {
        return {
          get: (...counties: string[]) => handlers.traStation?.(counties),
        }
      }
      // Station lines
      if (sql.includes('FROM station_lines')) {
        return { all: (id: number) => handlers.stationLines?.(id) ?? [] }
      }
      // Insert pick
      if (sql.includes('INSERT INTO station_picks')) {
        return {
          run: (
            stationId: number,
            transportType: string,
            token: string,
            pickedAt: number,
          ) => {
            calls.inserts.push({ stationId, transportType, token, pickedAt })
            return { changes: 1, lastInsertRowid: 100 + calls.inserts.length }
          },
        }
      }
      // Comment count
      if (sql.includes('FROM comments')) {
        return {
          get: (stationId: number) => ({ n: handlers.commentCount?.(stationId) ?? 0 }),
        }
      }
      throw new Error(`unexpected SQL: ${sql}`)
    },
  }
}

const calls: CallLog = { inserts: [] }
let activeHandlers: Handlers = {}

vi.mock('@/db/client', () => ({
  getSqlite: () => makeSqlite(activeHandlers, calls),
}))

beforeEach(() => {
  calls.inserts = []
  activeHandlers = {}
})

afterEach(() => {
  vi.resetModules()
})

async function callRoute(body: unknown) {
  const { POST } = await import('./route')
  return POST(
    new Request('http://localhost/api/pick', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
}

describe('POST /api/pick (MRT)', () => {
  it('looks up the station by id and binds the token to that exact id', async () => {
    activeHandlers = {
      mrtStation: (id) =>
        id === 42 ? { id: 42, name_zh: '中山', name_en: 'Zhongshan' } : undefined,
      stationLines: () => [{ line_code: 'R' }, { line_code: 'G' }],
    }

    const res = await callRoute({
      transport_type: 'mrt',
      station_id: 42,
      filter: { line_codes: ['R'] },
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.station.id).toBe(42)
    expect(body.station.nameZh).toBe('中山')
    expect(calls.inserts).toHaveLength(1)
    expect(calls.inserts[0].stationId).toBe(42)
    expect(calls.inserts[0].transportType).toBe('mrt')
    expect(typeof calls.inserts[0].token).toBe('string')
  })

  it('returns 400 when station_id is missing and does not insert a pick', async () => {
    activeHandlers = {
      // Set a station handler that would succeed if called — proving we never reach lookup.
      mrtStation: () => ({ id: 1, name_zh: '台北車站', name_en: null }),
      stationLines: () => [],
    }

    const res = await callRoute({
      transport_type: 'mrt',
      filter: { line_codes: ['R'] },
    })

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('invalid_body')
    expect(calls.inserts).toHaveLength(0)
  })

  it('returns 422 with no_candidates when station_id refers to an unknown station', async () => {
    activeHandlers = {
      mrtStation: () => undefined,
    }

    const res = await callRoute({
      transport_type: 'mrt',
      station_id: 999999,
    })

    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.error).toBe('no_candidates')
    expect(calls.inserts).toHaveLength(0)
  })
})

describe('POST /api/pick (TRA)', () => {
  it('still uses the random-pick path for TRA', async () => {
    activeHandlers = {
      traStation: (counties) => {
        expect(counties).toEqual(['台北市', '宜蘭縣'])
        return { id: 7, name_zh: '宜蘭', name_en: 'Yilan', county: '宜蘭縣' }
      },
    }

    const res = await callRoute({
      transport_type: 'tra',
      filter: { counties: ['台北市', '宜蘭縣'] },
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.station.id).toBe(7)
    expect(body.station.county).toBe('宜蘭縣')
    expect(calls.inserts[0].transportType).toBe('tra')
    expect(calls.inserts[0].stationId).toBe(7)
  })
})
