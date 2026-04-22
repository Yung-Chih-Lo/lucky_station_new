## 1. Schema & Migration

- [ ] 1.1 Update `lib/db/schema.ts`: add `transportType` column to `stations` (TEXT NOT NULL, CHECK in `('mrt','tra')`), add `county` (TEXT, nullable). Remove the unconditional `UNIQUE(name_zh)`. Declare two partial unique indexes via Drizzle's `uniqueIndex(...).where(...)`: `uniq_mrt_name` on `(name_zh) WHERE transport_type='mrt'` and `uniq_tra_name_county` on `(name_zh, county) WHERE transport_type='tra'`
- [ ] 1.2 Update `lib/db/schema.ts`: add `transportType` column to `lines` with same CHECK
- [ ] 1.3 Add `lib/db/schema.ts` entries for `stationPicks` (id, stationId FK CASCADE, transportType, token UNIQUE, pickedAt, commentUsed)
- [ ] 1.4 Add `lib/db/schema.ts` entries for `comments` (id, pickId FK CASCADE, stationId FK CASCADE, content, createdAt)
- [ ] 1.5 Add `lib/db/schema.ts` entries for `rateLimits` (ip, windowStart, scope CHECK in `('pick','comment')`, count, composite PK)
- [ ] 1.6 Add Drizzle indexes: `idx_station_picks_token` (UNIQUE), `idx_station_picks_station_id`, `idx_station_picks_transport_type`, `idx_comments_station_id`, `idx_comments_created_at`, `idx_rate_limits_window`
- [ ] 1.7 Run `drizzle-kit generate` to scaffold migration SQL; manually edit to use the SQLite table-rebuild pattern for `stations` and `lines` per design D12: CREATE _new (no inline `UNIQUE(name_zh)`, with CHECK on transport_type) → INSERT SELECT backfilling `transport_type='mrt'` → DROP → RENAME → then `CREATE UNIQUE INDEX uniq_mrt_name ON stations(name_zh) WHERE transport_type='mrt'` and `CREATE UNIQUE INDEX uniq_tra_name_county ON stations(name_zh, county) WHERE transport_type='tra'`
- [ ] 1.8 Verify migration in dev: drop dev DB, run `npm run migrate`, then `npm run seed` (existing MRT seed), confirm 118 MRT stations exist with `transport_type='mrt'`

## 2. TRA Seed Data

- [ ] 2.1 Copy `lucky_station/constants/stations.json` (291 stations) to `scripts/seed-data/tra-stations.json`; verify shape includes county per station
- [ ] 2.2 Implement `scripts/seed-tra.ts`: read JSON, `INSERT OR IGNORE INTO stations (name_zh, transport_type, county) VALUES (?, 'tra', ?)` for each row, idempotent
- [ ] 2.3 Add `seed:tra` script to `package.json` invoking `tsx scripts/seed-tra.ts`
- [ ] 2.4 Run `npm run seed:tra` against the dev DB; confirm 291 TRA stations exist, no MRT row mutated
- [ ] 2.5 Update existing `npm run seed` (MRT seed) to write `transport_type='mrt'` explicitly into every inserted stations and lines row

## 3. Community Library (`lib/community/`)

- [ ] 3.1 Create `lib/community/token.ts`: `generateToken()` using `crypto.randomUUID()`, `isValidToken(s)` UUIDv4 regex check
- [ ] 3.2 Create `lib/community/rate-limit.ts`: `getClientIp(headers, socket)` priority order (cf-connecting-ip → x-forwarded-for[0] → socket → 'unknown'), `enforceRateLimit(ip, scope, db)` returning `{ ok, remaining }` and pruning old rows in same batch
- [ ] 3.3 Create `lib/community/pick.ts`: `pickMrt(db, { lineCodes? })` and `pickTra(db, { counties })` returning a single station row or `null` when candidate set is empty
- [ ] 3.4 Create `lib/community/validators.ts`: zod schemas for pick request body (mrt vs tra discriminated union), comment body (`content` 10-500 chars trimmed, `honeypot` empty string)
- [ ] 3.5 Add unit tests for `token.ts` (format) and `rate-limit.ts` (window rollover, pruning, IP fallback chain)

## 4. Community API Routes

- [ ] 4.1 `app/api/pick/route.ts` (POST): parse + zod validate body, enforce rate limit (scope=pick), resolve candidate via `pickMrt`/`pickTra`, generate token (retry up to 3 on UNIQUE collision), insert `station_picks`, return `{ token, station }`. Handle 422 empty candidates, 400 invalid body, 429 rate limited, 500 collision exhausted
- [ ] 4.2 `app/api/comments/[token]/route.ts` (GET): lookup `station_picks` by token, return `{ station, comment_used }` or 404
- [ ] 4.3 `app/api/comments/[token]/route.ts` (POST): zod validate body, reject if honeypot non-empty, enforce rate limit (scope=comment), in transaction insert `comments` and update `station_picks.comment_used = 1`, reject 409 if already used, 404 if no pick
- [ ] 4.4 `app/api/comments/route.ts` (GET): parse `transport_type`, `station_id`, `q`, `page`, `limit` query params; clamp limit ≤ 50; query with appropriate JOIN to `stations` for transport_type filter; return `{ comments, total, page, total_pages }`
- [ ] 4.5 `app/api/stats/route.ts` (GET): parse `transport_type`, `limit` (default 50, max 200); group by `station_id`, count picks, JOIN stations for display fields, order by pick_count DESC, name_zh ASC
- [ ] 4.6 Manual smoke test each endpoint with curl: pick → comment GET → comment POST → comments listing → stats. Verify rate limit kicks in at 6th pick within a minute

## 5. Theme System

- [ ] 5.1 Restructure `lib/theme.ts` into `lib/theme/index.ts` re-exporting `mrtTheme` and `traTheme`; move existing tokens into `lib/theme/mrt.ts` (no value changes)
- [ ] 5.2 Create `lib/theme/tra.ts`: define TRA brand tokens (light gradient bg, translucent white surface ≥ 0.55, dark text ≥ 4.5:1 contrast, warm orange `#F97316` accent) and the corresponding antd `ThemeConfig`
- [ ] 5.3 Update `app/globals.css`: declare both theme variable sets under `[data-theme="mrt"]` and `[data-theme="tra"]` selectors; add `transition: background-color 200ms ease, color 200ms ease` on `html`/`body`; honor `@media (prefers-reduced-motion: reduce)` to disable the transition
- [ ] 5.4 Create `components/ThemeProvider.tsx` (client): props `{ mode: 'mrt' | 'tra', children }`. Sets `document.documentElement.dataset.theme` on mount/update and renders children inside the matching antd `<ConfigProvider>`
- [ ] 5.5 Refactor `app/layout.tsx`: leave admin route untouched; for public routes, render the appropriate `ThemeProvider` (default `mrt`) so SSR ships `data-theme="mrt"`

## 6. TRA Picker UI

- [ ] 6.1 Add dependency: `npm install @svg-maps/taiwan.main`; verify type definitions or add `declare module` shim if missing
- [ ] 6.2 Create `components/tra/TaiwanSvgMap.tsx`: render the SVG, accept `selectedCounties: string[]`, `disabledCounties: string[]`, `onToggleCounty(county)`. Apply `--brand-accent` fill for selected, default fill for unselected, lower opacity for disabled. Hover state: cursor pointer + opacity change. Tooltip with county name. Pure CSS (no styled-components)
- [ ] 6.3 Create `components/tra/Sidebar.tsx`: heading + checkbox group of available counties + 全選/清除 controls + 抽幸運車站 CTA. Use antd `Checkbox.Group` and `Button`. CTA disabled when zero counties selected. Emits `onPick(counties)` on click
- [ ] 6.4 Create `components/tra/ResultDisplay.tsx`: modal content rendered by parent. Cycles random TRA station names every 80ms for ≤2000ms then fades into the real name (CSS keyframes in globals.css). Shows county. Wikipedia + Google Maps external link buttons. "留下心得" CTA navigates to `/comment?token=...`. Honor `prefers-reduced-motion`
- [ ] 6.5 Create `components/tra/TraPicker.tsx`: composes Sidebar + TaiwanSvgMap + result Modal. Manages `selectedCounties` state. On pick, calls `POST /api/pick` with `{ transport_type: 'tra', filter: { counties } }`. Handles 429 with `message.warning(...)`. Reads available counties via SSR-injected prop or first-render fetch from a server util reading the DB
- [ ] 6.6 Add server util `lib/data/tra.ts`: `getTraCounties()` returning distinct county list from stations where transport_type='tra' (used for SSR prop)

## 7. Home Page Tab Integration

- [ ] 7.1 Refactor `components/HomeClient.tsx`: wrap content in antd `Tabs` with two items, `mrt` and `tra`. The MRT tab renders the existing schematic + Sidebar + ResultDisplay (extracted into `components/mrt/MrtPicker.tsx` if helpful). The TRA tab renders `<TraPicker />`
- [ ] 7.2 Tab change handler updates `ThemeProvider` mode (lift state up to a wrapper or use context)
- [ ] 7.3 Add localStorage persistence: on first client mount, read `localStorage.lastTransportTab`; if `tra`, switch tab. On every tab change, write back. SSR initial render is always `mrt` to avoid hydration mismatch
- [ ] 7.4 Verify in browser: refresh on MRT, switch to TRA, refresh → first paint MRT then snaps to TRA

## 8. Shared Public Pages

- [ ] 8.1 Create `app/(public)/explore/page.tsx`: server component fetches first page of comments via direct DB query (or via internal call). Client child renders filter controls (transport_type select: all/mrt/tra; station_id from a dropdown; search input) and paginated cards. Use existing CSS variable styling. Pinned to MRT theme via layout
- [ ] 8.2 Create `app/(public)/stats/page.tsx`: server component fetches `/api/stats` (combined). Client child renders antd `Tabs` (總榜 / 捷運 / 台鐵) and an antd `Table` with rank, station, transport type tag, county, pick count. Default tab 總榜
- [ ] 8.3 Create `app/(public)/comment/page.tsx`: client component reading `?token=...` from URL. On mount calls `GET /api/comments/[token]`. Renders form (TextArea with `showCount`, hidden honeypot input) when `comment_used = 0`; renders 「此 token 已留過心得」notice when `1`; renders error when 404. On submit calls POST and shows success card with copy-link + 「看看其他人的心得」link to `/explore?station_id=...`
- [ ] 8.4 Ensure `app/(public)/layout.tsx` (or per-page wrapping) pins `<ThemeProvider mode="mrt">` for these three routes
- [ ] 8.5 Add nav links from home + Sidebar to `/explore` and `/stats` (subtle text links, not primary CTAs)

## 9. Legacy Data Migration

- [ ] 9.1 Implement `scripts/migrate-legacy.ts`: arg parser for `--src=<path-to-lucky_station.db>` and `--dry-run`. Open source DB read-only with better-sqlite3
- [ ] 9.2 Phase A: SELECT DISTINCT (station_name, county) FROM source.station_picks; for each, lookup target `stations.id WHERE name_zh=? AND county=? AND transport_type='tra'` (county is part of the join key per D13 — TRA stations can repeat across counties); collect `{station_name, county, target_id|null}` map
- [ ] 9.3 Write `migration-report.json` with counts (matched, unmatched), and full unmatched list. Abort if `--dry-run` or unmatched count > threshold (default 0, override via flag)
- [ ] 9.4 Phase B (in transaction): INSERT INTO target.station_picks copying id, token, picked_at (convert string DATETIME → unix ms), comment_used; set station_id from map and transport_type='tra'
- [ ] 9.5 Phase C (same transaction): for each source.comments row, find pick_id by joining on token; INSERT INTO target.comments (id, pick_id, station_id from pick, content, created_at converted)
- [ ] 9.6 Skip source.rate_limits per design D5 / Open Question Q4
- [ ] 9.7 Add `migrate:legacy` script to `package.json` invoking `tsx scripts/migrate-legacy.ts`
- [ ] 9.8 Test against a copy of lucky_station.db in dev: dry-run → confirm 0 unmatched → real run → spot-check that a known token still resolves via `GET /api/comments/[token]` after migration

## 10. Style Cleanup & Component Polish

- [ ] 10.1 Remove all styled-components imports from migrated components (TaiwanSvgMap, Sidebar, ResultDisplay); confirm `package.json` does not depend on `styled-components`
- [ ] 10.2 Audit migrated components for hex literal leaks; replace with `var(--brand-*)` references. Run a grep for `#[0-9a-fA-F]{3,6}` in `components/tra/` and ensure only DB-sourced values remain (or none)
- [ ] 10.3 Add `prefers-reduced-motion` handling to TRA result reveal animation (skip cycling, instant final name)
- [ ] 10.4 Add visible focus rings (≥ 2px, contrast ≥ 3:1) to TRA Sidebar CTA, county checkboxes, map regions, and modal close

## 11. Infrastructure & Deployment

- [ ] 11.1 Update `Dockerfile` if needed (e.g. ensure `scripts/seed-data/tra-stations.json` is included in the runner image via `outputFileTracingIncludes` or COPY)
- [ ] 11.2 Update `docker-entrypoint.sh` to also handle the TRA seed step on first boot (after migrate + mrt seed): run `npm run seed:tra` if no TRA stations exist. Do NOT auto-run `migrate:legacy`
- [ ] 11.3 Document a runbook section in `README.md` (or a new `docs/migration.md` if README must stay short): how to mount the legacy lucky_station.db read-only at `/data/legacy/lucky_station.db` and run `docker exec ... npm run migrate:legacy -- --src=/data/legacy/lucky_station.db`
- [ ] 11.4 Verify CSP allows the `@svg-maps/taiwan.main` SVG inlining (it ships as JSON paths, not external URL — should be fine, but confirm `next.config.mjs` headers don't block)

## 12. End-to-End Verification

- [ ] 12.1 Fresh dev DB: migrate → seed mrt → seed tra → run app → click through MRT tab pick → comment → see comment in `/explore`
- [ ] 12.2 TRA tab pick → comment → see comment in `/explore?transport_type=tra`
- [ ] 12.3 `/stats` shows combined leaderboard by default; switch to MRT-only and TRA-only tabs and verify filtering
- [ ] 12.4 Hammer `POST /api/pick` 6 times in under a minute from the same IP via curl → 6th returns 429
- [ ] 12.5 Submit a comment with honeypot filled → 400, no insert
- [ ] 12.6 Try to comment twice on the same token → 2nd returns 409
- [ ] 12.7 Theme switch between tabs is smooth (no flashing); refresh on TRA → MRT first then snaps to TRA without layout shift
- [ ] 12.8 Run legacy migration against a sample lucky_station.db copy → spot-check 5 random tokens still resolve

## 13. Spec Validation

- [ ] 13.1 Run `openspec verify --change add-multi-transport-community` (or equivalent) to confirm all spec scenarios are reflected in implementation
- [ ] 13.2 Cross-check that no Out-of-Scope item from the proposal got implemented by accident (no admin-side picks/comments UI, no TRA admin editor, no other transport types beyond mrt/tra)
