/* One-time migration: imports station_picks and comments from a legacy
   lucky_station.db into the current DATABASE_PATH.
   Mapping key: (station_name, county) on transport_type='tra'.
   Skips rate_limits (time-sensitive data, see design D5 / Q4).

   Usage:
     DATABASE_PATH=./data/metro.db \
       tsx scripts/migrate-legacy.ts --src=/path/to/lucky_station.db [--dry-run] [--allow-unmatched=N]
*/
import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

type Args = {
  src: string
  dryRun: boolean
  allowUnmatched: number
}

function parseArgs(argv: string[]): Args {
  const args: Args = { src: '', dryRun: false, allowUnmatched: 0 }
  for (const a of argv.slice(2)) {
    if (a === '--dry-run') args.dryRun = true
    else if (a.startsWith('--src=')) args.src = a.slice(6)
    else if (a.startsWith('--allow-unmatched='))
      args.allowUnmatched = parseInt(a.slice(18), 10) || 0
  }
  if (!args.src) {
    console.error('Missing --src=<path-to-lucky_station.db>')
    process.exit(1)
  }
  return args
}

function isoToUnixMs(iso: string | null): number {
  if (!iso) return Date.now()
  // SQLite DATETIME defaults look like "2026-03-10 10:24:41" (no TZ; treat as UTC).
  const t = Date.parse(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z')
  return isNaN(t) ? Date.now() : t
}

type SourcePick = {
  id: number
  station_name: string
  county: string
  token: string
  picked_at: string | null
  comment_used: number
}

type SourceComment = {
  id: number
  token: string
  station_name: string
  county: string
  content: string
  created_at: string | null
}

type UnmatchedPick = { id: number; station_name: string; county: string; token: string }

function main(): void {
  const args = parseArgs(process.argv)
  const targetPath = process.env.DATABASE_PATH
  if (!targetPath) {
    console.error('DATABASE_PATH must be set (target DB)')
    process.exit(1)
  }

  if (!fs.existsSync(args.src)) {
    console.error(`Source DB not found at ${args.src}`)
    process.exit(1)
  }

  const src = new Database(args.src, { readonly: true })
  const tgt = new Database(targetPath)
  tgt.pragma('foreign_keys = ON')

  const picks = src.prepare(
    'SELECT id, station_name, county, token, picked_at, comment_used FROM station_picks',
  ).all() as SourcePick[]

  const comments = src.prepare(
    'SELECT id, token, station_name, county, content, created_at FROM comments',
  ).all() as SourceComment[]

  console.log(`source: ${picks.length} picks, ${comments.length} comments`)

  // Phase A: build (station_name, county) -> target station_id map
  const pairKey = (n: string, c: string) => `${n}|${c}`
  const uniquePairs = new Map<string, { station_name: string; county: string }>()
  for (const p of picks) {
    uniquePairs.set(pairKey(p.station_name, p.county), {
      station_name: p.station_name,
      county: p.county,
    })
  }

  const lookup = tgt.prepare(
    `SELECT id FROM stations
     WHERE name_zh = ? AND county = ? AND transport_type = 'tra'`,
  )
  const stationIdMap = new Map<string, number>()
  const unmatchedPairs: Array<{ station_name: string; county: string }> = []
  for (const [key, pair] of uniquePairs) {
    const row = lookup.get(pair.station_name, pair.county) as { id: number } | undefined
    if (row) stationIdMap.set(key, row.id)
    else unmatchedPairs.push(pair)
  }

  const unmatchedPicks: UnmatchedPick[] = picks
    .filter((p) => !stationIdMap.has(pairKey(p.station_name, p.county)))
    .map((p) => ({
      id: p.id,
      station_name: p.station_name,
      county: p.county,
      token: p.token,
    }))

  const report = {
    source_db: args.src,
    target_db: targetPath,
    source_pick_count: picks.length,
    source_comment_count: comments.length,
    matched_pair_count: stationIdMap.size,
    unmatched_pair_count: unmatchedPairs.length,
    unmatched_pick_count: unmatchedPicks.length,
    unmatched_pairs: unmatchedPairs,
    unmatched_picks: unmatchedPicks,
    dry_run: args.dryRun,
  }
  const reportPath = path.resolve('./data/migration-report.json')
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`report written: ${reportPath}`)
  console.log(
    `matched_pairs=${stationIdMap.size}, unmatched_pairs=${unmatchedPairs.length}, unmatched_picks=${unmatchedPicks.length}`,
  )

  if (unmatchedPicks.length > args.allowUnmatched) {
    console.error(
      `ABORT: ${unmatchedPicks.length} unmatched picks exceed threshold (${args.allowUnmatched}). ` +
        `Inspect ${reportPath}, then rerun with --allow-unmatched=<n> to proceed (skipping them).`,
    )
    process.exit(1)
  }

  if (args.dryRun) {
    console.log('dry-run: no writes performed')
    src.close()
    tgt.close()
    return
  }

  // Phase B + C in a transaction
  const insertPick = tgt.prepare(
    `INSERT OR IGNORE INTO station_picks
       (station_id, transport_type, token, picked_at, comment_used)
     VALUES (?, 'tra', ?, ?, ?)`,
  )
  const pickIdByToken = tgt.prepare(
    'SELECT id, station_id FROM station_picks WHERE token = ?',
  )
  const insertComment = tgt.prepare(
    `INSERT INTO comments (pick_id, station_id, content, created_at)
     VALUES (?, ?, ?, ?)`,
  )
  const existsCommentForPick = tgt.prepare(
    'SELECT 1 FROM comments WHERE pick_id = ? LIMIT 1',
  )

  let picksInserted = 0
  let commentsInserted = 0

  const tx = tgt.transaction(() => {
    // Phase B: picks
    for (const p of picks) {
      const stationId = stationIdMap.get(pairKey(p.station_name, p.county))
      if (stationId === undefined) continue
      const r = insertPick.run(
        stationId,
        p.token,
        isoToUnixMs(p.picked_at),
        p.comment_used ?? 0,
      )
      if (r.changes > 0) picksInserted++
    }

    // Phase C: comments
    for (const c of comments) {
      const pick = pickIdByToken.get(c.token) as
        | { id: number; station_id: number }
        | undefined
      if (!pick) continue // orphan comment (pick wasn't migrated)
      if (existsCommentForPick.get(pick.id)) continue // already imported
      insertComment.run(
        pick.id,
        pick.station_id,
        c.content,
        isoToUnixMs(c.created_at),
      )
      commentsInserted++
    }
  })

  tx()

  console.log(
    `migration: picks_inserted=${picksInserted}, comments_inserted=${commentsInserted}`,
  )
  src.close()
  tgt.close()
}

main()
