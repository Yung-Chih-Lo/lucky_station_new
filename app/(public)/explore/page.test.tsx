import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import Database from 'better-sqlite3'

vi.mock('server-only', () => ({}))
vi.mock('@/components/ThemeProvider', () => ({ useThemeMode: () => ({ setMode: vi.fn() }) }))
vi.mock('@/components/PickHistory', () => ({ default: () => null }))

let sqlite: Database.Database
vi.mock('@/db/client', () => ({ getSqlite: () => sqlite }))

beforeAll(() => {
  sqlite = new Database(':memory:')
  sqlite.exec(`
    CREATE TABLE stations (id INTEGER PRIMARY KEY, name_zh TEXT, transport_type TEXT, county TEXT);
    CREATE TABLE comments (id INTEGER PRIMARY KEY, station_id INTEGER, content TEXT, created_at INTEGER);
    INSERT INTO stations VALUES (1, '台北車站', 'mrt', '台北市'), (2, '花蓮', 'tra', '花蓮縣');
    INSERT INTO comments VALUES (1, 1, '在台北車站看見夕陽', 1780000000000),
                                (2, 2, '花蓮的海很美', 1780000001000);
  `)
})

afterAll(() => sqlite.close())

describe('ExplorePage server-rendered comments', () => {
  it('puts the first page of comments in HTML without a client effect', async () => {
    const { default: ExplorePage } = await import('./page')
    const html = renderToString(await ExplorePage({ searchParams: Promise.resolve({}) }))

    expect(html).toContain('花蓮的海很美')
    expect(html).toContain('在台北車站看見夕陽')
    expect(html).toContain('旅人心得')
    expect(html).toContain('2026-05-29 04:26')
  })

  it('applies station_id before rendering HTML', async () => {
    const { default: ExplorePage } = await import('./page')
    const html = renderToString(
      await ExplorePage({ searchParams: Promise.resolve({ station_id: '1' }) }),
    )

    expect(html).toContain('在台北車站看見夕陽')
    expect(html).not.toContain('花蓮的海很美')
  })
})
