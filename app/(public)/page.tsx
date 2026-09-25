import HomeClient from '@/components/HomeClient'
import type { Metadata } from 'next'
import Link from 'next/link'
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

export const metadata: Metadata = {
  title: '坐火行｜台北捷運、台鐵隨機抽站，決定今天去哪',
  description: '不知道今天去哪？坐火行讓你依捷運路線或台鐵縣市隨機抽站，查看地圖、分享旅行籤紙，並留下旅人心得。免費使用，不需註冊。',
  alternates: { canonical: '/' },
}

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
    <>
      <section className="home-intro" aria-labelledby="home-title">
        <h1 id="home-title">台北捷運、台鐵隨機抽站</h1>
        <p>不知道今天去哪？選幾條捷運路線，或切換台鐵選擇縣市，讓坐火行決定你的下一站。</p>
        <a href="#how-to-play">第一次玩？看看抽站方式 ↓</a>
      </section>
      <HomeClient
        mrt={{ stations, connections, lines, canvas }}
        tra={{ counties: traCounties, countyToStations: traCountyToStations }}
      />
      <section id="how-to-play" className="home-guide" aria-labelledby="guide-title">
        <h2 id="guide-title">坐火行怎麼玩？</h2>
        <p>坐火行是一個免費、不需註冊的隨機車站工具，適合想出門散步、安排鐵道小旅行，卻還沒決定目的地的你。</p>
        <div className="home-guide-grid">
          <div>
            <h3>抽一個捷運站</h3>
            <p>在上方選擇「捷運」，勾選想包含的路線，再按「命．中．注．定」。系統會從所選路線的車站中隨機選出目的地。</p>
          </div>
          <div>
            <h3>抽一個台鐵站</h3>
            <p>在上方切換「台鐵」，選擇想去的縣市，再按抽站按鈕，隨機決定鐵道旅行的下一站。</p>
          </div>
          <div>
            <h3>抽到之後可以做什麼？</h3>
            <p>查看車站地圖與維基百科、分享籤紙，或透過抽站後的專屬連結留下旅行心得。出發前請再確認班次、營業時間與交通安排。</p>
          </div>
        </div>
        <nav aria-label="探索坐火行">
          <Link href="/explore">閱讀旅人心得</Link>
          <Link href="/stats">查看抽站排行榜</Link>
        </nav>
        <noscript><p>使用說明與旅人心得可以直接閱讀；互動抽站需要啟用 JavaScript。</p></noscript>
      </section>
    </>
  )
}
