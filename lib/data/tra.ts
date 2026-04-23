import 'server-only'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { stations } from '@/db/schema'

export function getTraCounties(): string[] {
  const db = getDb()
  const rows = db
    .selectDistinct({ county: stations.county })
    .from(stations)
    .where(eq(stations.transportType, 'tra'))
    .orderBy(sql`${stations.county}`)
    .all()
  return rows
    .map((r) => r.county)
    .filter((c): c is string => typeof c === 'string' && c.length > 0)
}
