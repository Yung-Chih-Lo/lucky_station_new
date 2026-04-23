import 'server-only'
import { eq } from 'drizzle-orm'
import { getDb } from './client'
import {
  canvasConfig,
  connections,
  lines,
  stationLines,
  stations,
  type ConnectionPathPoint,
  type Line,
  type Station,
} from './schema'

export type StationWithLines = Station & { lineCodes: string[] }

export type ConnectionRow = {
  id: number
  fromStationId: number
  toStationId: number
  lineCode: string
  path: ConnectionPathPoint[]
}

export type CanvasConfig = { width: number; height: number }

export function getCanvasConfig(): CanvasConfig {
  const db = getDb()
  const row = db.select().from(canvasConfig).where(eq(canvasConfig.id, 1)).get()
  if (!row) {
    throw new Error('canvas_config row missing; run `npm run seed`')
  }
  return { width: row.width, height: row.height }
}

export function getLinesMap(): Map<string, Line> {
  const db = getDb()
  const rows = db.select().from(lines).where(eq(lines.transportType, 'mrt')).all()
  return new Map(rows.map((r) => [r.code, r]))
}

export type MrtStationWithLines = {
  id: number
  nameZh: string
  nameEn: string | null
  lat: number | null
  lng: number | null
  schematicX: number
  schematicY: number
  labelX: number
  labelY: number
  labelAnchor: 'start' | 'middle' | 'end'
  updatedAt: number
  lineCodes: string[]
}

export function getAllStationsWithLines(): MrtStationWithLines[] {
  const db = getDb()
  const rows = db
    .select({ station: stations, lineCode: stationLines.lineCode })
    .from(stations)
    .leftJoin(stationLines, eq(stationLines.stationId, stations.id))
    .where(eq(stations.transportType, 'mrt'))
    .all()

  const map = new Map<number, MrtStationWithLines>()
  for (const { station, lineCode } of rows) {
    if (
      station.schematicX === null ||
      station.schematicY === null ||
      station.labelX === null ||
      station.labelY === null ||
      station.labelAnchor === null
    ) {
      // MRT rows must have schematic coords; skip malformed rows.
      continue
    }
    const existing = map.get(station.id)
    if (existing) {
      if (lineCode) existing.lineCodes.push(lineCode)
    } else {
      map.set(station.id, {
        id: station.id,
        nameZh: station.nameZh,
        nameEn: station.nameEn,
        lat: station.lat,
        lng: station.lng,
        schematicX: station.schematicX,
        schematicY: station.schematicY,
        labelX: station.labelX,
        labelY: station.labelY,
        labelAnchor: station.labelAnchor,
        updatedAt: station.updatedAt,
        lineCodes: lineCode ? [lineCode] : [],
      })
    }
  }
  return Array.from(map.values())
}

export function getConnections(): ConnectionRow[] {
  const db = getDb()
  const rows = db.select().from(connections).all()
  return rows.map((r) => ({
    id: r.id,
    fromStationId: r.fromStationId,
    toStationId: r.toStationId,
    lineCode: r.lineCode,
    path: JSON.parse(r.pathJson) as ConnectionPathPoint[],
  }))
}
