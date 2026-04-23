/* Seeds TRA stations from constants/tra-stations.json (sourced from lucky_station).
   Idempotent: re-running against a populated DB does not duplicate rows.
   Cross-county duplicate station names are intentionally inserted as separate rows
   per design D13 (each (name_zh, county) pair is an independently selectable station). */
import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { sql } from 'drizzle-orm'
import * as schema from '../db/schema'

type RawData = Record<string, string[]>

function resolveJsonPath(): string {
  const arg = process.argv[2]
  if (arg) return path.resolve(arg)
  return path.resolve(process.cwd(), 'scripts/seed-data/tra-stations.json')
}

function main(): void {
  const dbPath = process.env.DATABASE_PATH ?? './data/metro.db'
  const jsonPath = resolveJsonPath()

  if (!fs.existsSync(jsonPath)) {
    console.error(`seed:tra: source JSON not found at ${jsonPath}`)
    process.exit(1)
  }

  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  const db = drizzle(sqlite, { schema })
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as RawData

  const now = Date.now()
  let attempted = 0

  const tx = sqlite.transaction(() => {
    for (const [county, stationNames] of Object.entries(raw)) {
      if (!county || !Array.isArray(stationNames)) {
        console.warn(`seed:tra: skipping malformed county entry "${county}"`)
        continue
      }
      for (const nameZh of stationNames) {
        if (typeof nameZh !== 'string' || nameZh.trim() === '') {
          console.warn(`seed:tra: skipping empty name in ${county}`)
          continue
        }
        attempted++
        db.run(sql`
          INSERT OR IGNORE INTO stations
            (transport_type, name_zh, county, updated_at)
          VALUES
            ('tra', ${nameZh}, ${county}, ${now})
        `)
      }
    }
  })

  tx()

  const totalRow = sqlite
    .prepare(`SELECT COUNT(*) AS n FROM stations WHERE transport_type = 'tra'`)
    .get() as { n: number }

  console.log(
    `seed:tra: done (attempted=${attempted}, tra_stations_in_db=${totalRow.n})`,
  )

  sqlite.close()
}

main()
