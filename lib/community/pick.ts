import type Database from 'better-sqlite3'

export type PickedStation = {
  id: number
  nameZh: string
  nameEn: string | null
  county: string | null
  transportType: 'mrt' | 'tra'
  lineCodes?: string[]
}

export function lookupMrtStation(
  sqlite: Database.Database,
  stationId: number,
): PickedStation | null {
  const row = sqlite
    .prepare(
      `SELECT id, name_zh, name_en FROM stations
       WHERE id = ? AND transport_type = 'mrt'`,
    )
    .get(stationId) as { id: number; name_zh: string; name_en: string | null } | undefined

  if (!row) return null

  const linesForStation = sqlite
    .prepare('SELECT line_code FROM station_lines WHERE station_id = ?')
    .all(row.id) as { line_code: string }[]

  return {
    id: row.id,
    nameZh: row.name_zh,
    nameEn: row.name_en,
    county: null,
    transportType: 'mrt',
    lineCodes: linesForStation.map((r) => r.line_code),
  }
}

export function pickTra(
  sqlite: Database.Database,
  opts: { counties: string[] },
): PickedStation | null {
  const counties = opts.counties.filter(
    (c) => typeof c === 'string' && c.trim() !== '',
  )
  if (counties.length === 0) return null

  const placeholders = counties.map(() => '?').join(',')
  const row = sqlite
    .prepare(
      `SELECT id, name_zh, name_en, county FROM stations
       WHERE transport_type = 'tra' AND county IN (${placeholders})
       ORDER BY RANDOM() LIMIT 1`,
    )
    .get(...counties) as
    | { id: number; name_zh: string; name_en: string | null; county: string }
    | undefined

  if (!row) return null

  return {
    id: row.id,
    nameZh: row.name_zh,
    nameEn: row.name_en,
    county: row.county,
    transportType: 'tra',
  }
}
