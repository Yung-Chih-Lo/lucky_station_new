/* Seeds the SQLite database from the legacy metroData.json.
   Idempotent: re-running against a populated DB does not duplicate rows. */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { sql } from 'drizzle-orm'
import * as schema from '../db/schema'

const LINE_COLORS: Record<string, string> = {
  BR: '#9c6b38',
  R: '#e3192a',
  RA: '#f5a0b5',
  G: '#008659',
  GA: '#99E64D',
  O: '#f5a622',
  BL: '#0070bd',
  Y: '#d4a017',
  V: '#e5554f',
  K: '#b3bd00',
  LB: '#66ccff',
}

const LINE_NAMES_ZH: Record<string, string> = {
  BR: '文湖線',
  R: '淡水信義線',
  G: '松山新店線',
  O: '中和新蘆線',
  BL: '板南線',
  Y: '環狀線',
  RA: '新北投支線',
  GA: '小碧潭支線',
  V: '淡海輕軌',
  K: '安坑輕軌',
  LB: '三鶯線',
}

type RawPathPoint = { command: 'M' | 'L' | 'Q'; coordinates: number[] }
type RawConnection = { line: string; from: string; to: string; path: RawPathPoint[] }
type RawStation = {
  id: number
  lines: string[]
  label: string
  lat?: number
  lng?: number
  center: { x: number; y: number }
  name: { zh: string; en?: string; pos: { x: number; y: number; anchor: 'start' | 'middle' | 'end' } }
}
type RawData = {
  size: { width: number; height: number }
  stations: RawStation[]
  connections: RawConnection[]
}

function resolveJsonPath(args: string[]): string {
  const arg = args.find((value) => value !== '--layout')
  if (arg) return path.resolve(arg)
  return path.resolve(process.cwd(), 'scripts/seed-data/metroData.json')
}

export function seedMetro(dbPath: string, jsonPath: string, options: { layout?: boolean } = {}): void {
  if (!fs.existsSync(jsonPath)) {
    console.error(`seed: source JSON not found at ${jsonPath}`)
    process.exit(1)
  }

  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  const db = drizzle(sqlite, { schema })
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as RawData

  const now = Date.now()

  const usedLineCodes = new Set<string>()
  for (const s of raw.stations) for (const code of s.lines) usedLineCodes.add(code)
  for (const c of raw.connections) usedLineCodes.add(c.line)

  const tx = sqlite.transaction(() => {
    // canvas_config singleton
    if (options.layout) {
      db.run(sql`INSERT INTO canvas_config (id, width, height) VALUES (1, ${raw.size.width}, ${raw.size.height})
        ON CONFLICT(id) DO UPDATE SET width = excluded.width, height = excluded.height`)
    } else {
      db.run(sql`INSERT INTO canvas_config (id, width, height) VALUES (1, ${raw.size.width}, ${raw.size.height})
        ON CONFLICT(id) DO UPDATE SET
          width = MAX(width, excluded.width), height = MAX(height, excluded.height)`)
    }

    // lines
    for (const code of usedLineCodes) {
      db.run(
        sql`INSERT OR IGNORE INTO lines (code, transport_type, name_zh, color)
            VALUES (${code}, 'mrt', ${LINE_NAMES_ZH[code] ?? null}, ${LINE_COLORS[code] ?? '#999'})`,
      )
    }

    // Existing MRT names own their IDs. This also protects picks, comments and
    // administrator-adjusted positions when the source diagram changes.
    const nameToId = new Map<string, number>()
    const occupiedIds = new Set<number>()
    for (const row of sqlite.prepare('SELECT id, transport_type, name_zh FROM stations').all() as
      { id: number; transport_type: string; name_zh: string }[]) {
      occupiedIds.add(row.id)
      if (row.transport_type === 'mrt') nameToId.set(row.name_zh, row.id)
    }
    let nextId = Math.max(
      0,
      ...occupiedIds,
      ...raw.stations.map((station) => station.id),
    ) + 1

    // stations
    for (const s of raw.stations) {
      if (nameToId.has(s.name.zh)) {
        if (options.layout) {
          const id = nameToId.get(s.name.zh)!
          db.run(sql`UPDATE stations SET
            schematic_x = ${s.center.x}, schematic_y = ${s.center.y},
            label_x = ${s.name.pos.x}, label_y = ${s.name.pos.y},
            label_anchor = ${s.name.pos.anchor}, updated_at = ${now}
            WHERE id = ${id} AND (
              schematic_x IS NOT ${s.center.x} OR schematic_y IS NOT ${s.center.y} OR
              label_x IS NOT ${s.name.pos.x} OR label_y IS NOT ${s.name.pos.y} OR
              label_anchor IS NOT ${s.name.pos.anchor})`)
        }
        continue
      }
      const id = occupiedIds.has(s.id) ? nextId++ : s.id
      db.run(sql`
        INSERT INTO stations
          (id, transport_type, name_zh, name_en, lat, lng, schematic_x, schematic_y, label_x, label_y, label_anchor, updated_at)
        VALUES
          (${id}, 'mrt', ${s.name.zh}, ${s.name.en ?? null},
           ${s.lat ?? null}, ${s.lng ?? null},
           ${s.center.x}, ${s.center.y},
           ${s.name.pos.x}, ${s.name.pos.y}, ${s.name.pos.anchor},
           ${now})
      `)
      occupiedIds.add(id)
      nameToId.set(s.name.zh, id)
    }

    // station_lines
    for (const s of raw.stations) {
      const stationId = nameToId.get(s.name.zh)!
      for (const code of s.lines) {
        db.run(
          sql`INSERT OR IGNORE INTO station_lines (station_id, line_code) VALUES (${stationId}, ${code})`,
        )
      }
    }

    // connections — idempotency via (from_id, to_id, line_code) uniqueness check
    for (const c of raw.connections) {
      const fromId = nameToId.get(c.from)
      const toId = nameToId.get(c.to)
      if (fromId === undefined || toId === undefined) {
        throw new Error(`seed: connection has unknown station (${c.from} -> ${c.to})`)
      }
      const existing = sqlite
        .prepare(
          'SELECT id, path_json FROM connections WHERE from_station_id = ? AND to_station_id = ? AND line_code = ?',
        )
        .get(fromId, toId, c.line) as { id: number; path_json: string } | undefined
      const pathJson = JSON.stringify(c.path)
      if (existing) {
        if (options.layout && existing.path_json !== pathJson) {
          db.run(sql`UPDATE connections SET path_json = ${pathJson} WHERE id = ${existing.id}`)
        }
        continue
      }
      db.run(sql`
        INSERT INTO connections (from_station_id, to_station_id, line_code, path_json)
        VALUES (${fromId}, ${toId}, ${c.line}, ${pathJson})
      `)
    }
  })

  try {
    tx()

    const counts = {
      stations: sqlite.prepare('SELECT COUNT(*) AS n FROM stations').get() as { n: number },
      lines: sqlite.prepare('SELECT COUNT(*) AS n FROM lines').get() as { n: number },
      stationLines: sqlite.prepare('SELECT COUNT(*) AS n FROM station_lines').get() as { n: number },
      connections: sqlite.prepare('SELECT COUNT(*) AS n FROM connections').get() as { n: number },
    }
    console.log(
      `seed: done (stations=${counts.stations.n}, lines=${counts.lines.n}, ` +
        `station_lines=${counts.stationLines.n}, connections=${counts.connections.n})`,
    )

  } finally {
    sqlite.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  seedMetro(process.env.DATABASE_PATH ?? './data/metro.db', resolveJsonPath(args), {
    layout: args.includes('--layout'),
  })
}
