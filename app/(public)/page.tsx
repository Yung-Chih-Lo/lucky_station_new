import HomeClient from '@/components/HomeClient'
import {
  getAllStationsWithLines,
  getCanvasConfig,
  getConnections,
  getLinesMap,
} from '@/db/queries'
import { getTraCounties } from '@/lib/data/tra'
import { getDb } from '@/db/client'
import { stations as stationsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type {
  CanvasView,
  ConnectionView,
  LineView,
  StationView,
} from '@/components/types'

export const dynamic = 'force-dynamic'

function getTraCountyToStations(): Record<string, string[]> {
  const db = getDb()
  const rows = db
    .select({
      nameZh: stationsTable.nameZh,
      county: stationsTable.county,
    })
    .from(stationsTable)
    .where(eq(stationsTable.transportType, 'tra'))
    .all()
  const out: Record<string, string[]> = {}
  for (const r of rows) {
    if (!r.county) continue
    if (!out[r.county]) out[r.county] = []
    out[r.county].push(r.nameZh)
  }
  return out
}

export default function HomePage() {
  const stationsRaw = getAllStationsWithLines()
  const connectionsRaw = getConnections()
  const linesRaw = Array.from(getLinesMap().values())
  const canvas: CanvasView = getCanvasConfig()
  const traCounties = getTraCounties()
  const traCountyToStations = getTraCountyToStations()

  const stations: StationView[] = stationsRaw.map((s) => ({
    id: s.id,
    nameZh: s.nameZh,
    nameEn: s.nameEn,
    schematicX: s.schematicX,
    schematicY: s.schematicY,
    labelX: s.labelX,
    labelY: s.labelY,
    labelAnchor: s.labelAnchor,
    lineCodes: s.lineCodes,
  }))

  const connections: ConnectionView[] = connectionsRaw.map((c) => ({
    id: c.id,
    fromStationId: c.fromStationId,
    toStationId: c.toStationId,
    lineCode: c.lineCode,
    path: c.path,
  }))

  const lines: LineView[] = linesRaw.map((l) => ({
    code: l.code,
    nameZh: l.nameZh,
    nameEn: l.nameEn,
    color: l.color,
  }))

  if (stations.length === 0) {
    return (
      <main style={{ padding: 24, color: 'var(--ink)' }}>
        <h1>捷運籤</h1>
        <p>Database is empty. Run <code>npm run migrate &amp;&amp; npm run seed</code>.</p>
      </main>
    )
  }

  return (
    <HomeClient
      mrt={{ stations, connections, lines, canvas }}
      tra={{ counties: traCounties, countyToStations: traCountyToStations }}
    />
  )
}
