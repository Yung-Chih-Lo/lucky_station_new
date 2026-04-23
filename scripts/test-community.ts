/* Standalone assertions for lib/community/{token,rate-limit}.
   Run via: DATABASE_PATH=./data/test-community.db tsx scripts/test-community.ts */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import Database from 'better-sqlite3'
import { generateToken, isValidToken } from '../lib/community/token'
import { enforceRateLimit, getClientIp } from '../lib/community/rate-limit'

const dbPath = process.env.DATABASE_PATH ?? './data/test-community.db'

fs.mkdirSync(path.dirname(dbPath), { recursive: true })
for (const ext of ['', '-journal', '-wal', '-shm']) {
  fs.rmSync(dbPath + ext, { force: true })
}

const env = { ...process.env, DATABASE_PATH: dbPath }
execSync('npx drizzle-kit migrate', { env, stdio: 'inherit' })

// --- token tests ---
const t1 = generateToken()
const t2 = generateToken()
assert.notEqual(t1, t2, 'tokens should be unique per call')
assert.ok(isValidToken(t1), 'generated token must validate')
assert.ok(!isValidToken('not-a-uuid'), 'plain string rejected')
assert.ok(!isValidToken(''), 'empty rejected')
assert.ok(
  !isValidToken('11111111-1111-1111-1111-111111111111'),
  'non-v4 UUID rejected',
)
console.log('✓ token: generate + validate')

// --- IP fallback tests ---
const h = (init: HeadersInit) => new Headers(init)
assert.equal(getClientIp(h({ 'cf-connecting-ip': '1.2.3.4' })), '1.2.3.4')
assert.equal(
  getClientIp(h({ 'x-forwarded-for': '5.6.7.8, 9.10.11.12' })),
  '5.6.7.8',
)
assert.equal(getClientIp(h({ 'x-real-ip': '13.14.15.16' })), '13.14.15.16')
assert.equal(getClientIp(h({})), 'unknown')
assert.equal(
  getClientIp(h({ 'cf-connecting-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2' })),
  '1.1.1.1',
  'cf header wins over xff',
)
console.log('✓ rate-limit: IP fallback chain')

// --- rate-limit window tests ---
const sqlite = new Database(dbPath)
sqlite.pragma('foreign_keys = ON')

const t0 = new Date('2026-04-22T10:15:30.000Z')

// 5 picks in the same minute should succeed
for (let i = 0; i < 5; i++) {
  const r = enforceRateLimit(sqlite, '1.1.1.1', 'pick', t0)
  assert.equal(r.ok, true, `pick #${i + 1} should succeed`)
}
// 6th in same minute denied
const sixth = enforceRateLimit(sqlite, '1.1.1.1', 'pick', t0)
assert.equal(sixth.ok, false, '6th pick in same minute denied')
assert.equal(sixth.remaining, 0)

// Window rolls over at next minute
const tNext = new Date('2026-04-22T10:16:00.000Z')
const sixthNextMinute = enforceRateLimit(sqlite, '1.1.1.1', 'pick', tNext)
assert.equal(sixthNextMinute.ok, true, 'new minute resets pick window')
console.log('✓ rate-limit: minute window rollover')

// Comment scope is independent of pick scope
const cmt = enforceRateLimit(sqlite, '1.1.1.1', 'comment', t0)
assert.equal(cmt.ok, true, 'comment scope independent of pick')
console.log('✓ rate-limit: scope isolation')

// Pruning: insert an old row and ensure it disappears after the next write
sqlite
  .prepare(
    `INSERT INTO rate_limits (ip, window_start, scope, count) VALUES (?, ?, 'pick', 1)`,
  )
  .run('9.9.9.9', '2020-01-01T00:00')
enforceRateLimit(sqlite, '2.2.2.2', 'pick', t0)
const oldRow = sqlite
  .prepare(
    `SELECT count FROM rate_limits WHERE ip = '9.9.9.9' AND window_start = '2020-01-01T00:00' AND scope = 'pick'`,
  )
  .get()
assert.equal(oldRow, undefined, 'old rate_limits row pruned on next write')
console.log('✓ rate-limit: pruning old rows')

sqlite.close()
for (const ext of ['', '-journal', '-wal', '-shm']) {
  fs.rmSync(dbPath + ext, { force: true })
}

console.log('\n✓ all community tests passed')
