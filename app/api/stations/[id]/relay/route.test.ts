import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

type PreparedFn = (...args: unknown[]) => unknown
type Prepared = { get: PreparedFn }

const prepareImpl = vi.fn<(sql: string) => Prepared>()

vi.mock('@/db/client', () => ({
  getSqlite: () => ({ prepare: (sql: string) => prepareImpl(sql) }),
}))

function mockSqlite(handlers: Record<string, PreparedFn>) {
  prepareImpl.mockImplementation((sql: string) => {
    for (const [fragment, handler] of Object.entries(handlers)) {
      if (sql.includes(fragment)) {
        return { get: handler }
      }
    }
    throw new Error(`unexpected SQL: ${sql}`)
  })
}

beforeEach(() => {
  prepareImpl.mockReset()
})

afterEach(() => {
  vi.resetModules()
})

async function callRoute(id: string) {
  const { GET } = await import('./route')
  return GET(new Request(`http://localhost/api/stations/${id}/relay`), {
    params: Promise.resolve({ id }),
  })
}

describe('GET /api/stations/[id]/relay', () => {
  it('returns populated fields for a station with at least one comment', async () => {
    const createdAtMs = Date.UTC(2026, 3, 21, 14, 22, 0) // 2026-04-21 14:22 UTC
    mockSqlite({
      'FROM stations': () => ({ id: 42 }),
      'ORDER BY created_at DESC': () => ({
        id: 417,
        content: '溫泉博物館的木樓梯會吱吱響，空氣裡一股淡淡的硫磺味。',
        created_at: createdAtMs,
      }),
      'COUNT(*)': () => ({ c: 3 }),
    })

    const res = await callRoute('42')
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(body.handle).toBe('0417')
    expect(body.postedAt).toBe(new Date(createdAtMs).toISOString())
    expect(body.count).toBe(3)
    expect(body.excerpt).toBe('溫泉博物館的木樓梯會吱吱響，空氣裡一股淡淡的硫磺味。')
  })

  it('truncates excerpt to 50 chars with ellipsis when content exceeds 50', async () => {
    const long = 'A'.repeat(80)
    mockSqlite({
      'FROM stations': () => ({ id: 1 }),
      'ORDER BY created_at DESC': () => ({
        id: 1,
        content: long,
        created_at: Date.UTC(2026, 0, 1),
      }),
      'COUNT(*)': () => ({ c: 1 }),
    })

    const res = await callRoute('1')
    const body = await res.json()
    expect(body.excerpt).toBe('A'.repeat(50) + '…')
  })

  it('returns all-null payload with count 0 when station has no comments', async () => {
    mockSqlite({
      'FROM stations': () => ({ id: 42 }),
      'ORDER BY created_at DESC': () => undefined,
      'COUNT(*)': () => ({ c: 0 }),
    })

    const res = await callRoute('42')
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(body).toEqual({
      excerpt: null,
      handle: null,
      postedAt: null,
      count: 0,
    })
  })

  it('returns 404 when station id does not exist', async () => {
    mockSqlite({
      'FROM stations': () => undefined,
    })

    const res = await callRoute('99999')
    expect(res.status).toBe(404)
  })

  it('returns 400 for non-numeric id', async () => {
    const res = await callRoute('not-a-number')
    expect(res.status).toBe(400)
  })
})
