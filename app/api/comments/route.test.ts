import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import Database from 'better-sqlite3'

vi.mock('server-only', () => ({}))

let sqlite: Database.Database
vi.mock('@/db/client', () => ({ getSqlite: () => sqlite }))

beforeAll(() => {
  sqlite = new Database(':memory:')
  sqlite.exec(`
    CREATE TABLE stations (id INTEGER PRIMARY KEY, name_zh TEXT, transport_type TEXT, county TEXT);
    CREATE TABLE comments (id INTEGER PRIMARY KEY, station_id INTEGER, content TEXT, created_at INTEGER);
    INSERT INTO stations VALUES (1, '台北車站', 'mrt', '台北市'), (2, '花蓮', 'tra', '花蓮縣');
    INSERT INTO comments VALUES (1, 1, '台北轉車', 1780000000000),
                                (2, 2, '花蓮看海', 1780000001000);
  `)
})

afterAll(() => sqlite.close())

describe('GET /api/comments', () => {
  it('keeps station, transport, search and pagination filters', async () => {
    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/api/comments?station_id=1&transport_type=mrt&q=%E8%BD%89%E8%BB%8A&page=1&limit=1'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.total).toBe(1)
    expect(data.total_pages).toBe(1)
    expect(data.comments.map((comment: { content: string }) => comment.content)).toEqual(['台北轉車'])
  })

  it('returns the expected second page', async () => {
    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/api/comments?page=2&limit=1'))
    const data = await response.json()

    expect(data.total).toBe(2)
    expect(data.total_pages).toBe(2)
    expect(data.comments.map((comment: { content: string }) => comment.content)).toEqual(['台北轉車'])
  })
})
