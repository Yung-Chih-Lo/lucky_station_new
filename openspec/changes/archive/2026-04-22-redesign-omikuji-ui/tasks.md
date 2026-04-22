## 1. Foundation — palette, layout, top bar (Phase 1, shippable alone)

- [x] 1.1 Create `lib/theme/tokens.ts` with the unified palette (paper-bg, paper-surface, paper-surface-elevated, ink, ink-muted, rule, seal, warn, success) plus `accentForMode(mode)` returning the MRT/TRA accent hex
- [x] 1.2 Rewrite `lib/theme/index.ts` to expose a single `themeFor(mode)` built from `tokens.ts`; keep named exports `mrtTheme` / `traTheme` as thin wrappers for back-compat; delete the body of `lib/theme/mrt.ts` and `lib/theme/tra.ts` (re-export from `tokens.ts` to preserve existing imports)
- [x] 1.3 Rewrite the token blocks in `app/globals.css`: delete `[data-theme="mrt"]` and `[data-theme="tra"]` dark/gradient tokens; add the new paper-base tokens; add mode-scoped `--accent` override under `[data-theme="mrt"]` and `[data-theme="tra"]`; keep back-compat aliases (`--brand-bg` → `--paper-bg`, `--brand-text` → `--ink`, `--brand-accent` → `--accent`) for one release
- [x] 1.4 Remove `.brand-glass` rule from `globals.css` (and its `@supports` fallback); add `.rail-tick-rule`, `.kerf-edge`, `.paper-noise` utility classes plus `.omikuji-card` surface style (opaque, 1px rule border, two-color offset shadow)
- [x] 1.5 Create `components/layout/TopBar.tsx`: 64px height, three regions (wordmark left / mode tabs center / nav right); tabs read mode from `ThemeProvider` context and write back via `setMode`; active tab shows 2px `--accent` underline (no filled pill); right region contains `旅人心得` and `排行榜` text links (no login — admin auth stays at `/admin/login` outside public nav); bottom border is a single rail-tick hairline
- [x] 1.6 Update `app/(public)/layout.tsx` to render `<TopBar />` above `{children}` inside `ThemeProvider`; remove the bare `<div className="brand-public">` nesting rule if it would double-wrap
- [x] 1.7 Strip tabs out of `components/HomeClient.tsx`: it stops owning `<Tabs>`; picks mode purely from context; renders `<MrtPicker>` or `<TraPicker>` based on `mode`; preserves hydration and `localStorage` persistence (move persistence into `TopBar` or `ThemeProvider`)
- [x] 1.8 Rewrite `components/tra/TraPicker.tsx` layout: one `<OmikujiCard>` wrapping both panes; delete the `<h2>台灣縣市</h2>` eyebrow; remove the inner `brand-glass` sidebar card; internal divider is a single vertical rail-tick rule; shared 32px top padding so pane tops align
- [x] 1.9 Rewrite `components/mrt/MrtPicker.tsx` to the same single-card composition (line filter left, schematic right, shared rail-tick divider, 32px shared top padding)
- [x] 1.10 Rewrite `components/tra/Sidebar.tsx` to remove the brand-title block (wordmark is now in the top bar) and remove the `旅人心得 · 排行榜` nav links; keep only the county selector + summary + CTA; rename if a narrower name fits
- [x] 1.11 Mirror the equivalent cleanup in `components/mrt/MrtPicker.tsx`'s line-filter column (no nav, no duplicate wordmark)
- [x] 1.12 Add responsive breakpoint at 960px: below 960px the two panes stack; the internal rail-tick divider rotates to horizontal
- [ ] 1.13 Visual QA on desktop and mobile viewports — verify top/left alignment, no double-card nesting, no remaining "台灣縣市" text, contrast ≥ AA on CTA, tab underline renders
- [x] 1.14 Run `grep -rn '#1E1B4B\|#D4A574\|#F97316\|brand-glass' app components lib` and resolve every leak; remove dead back-compat aliases if none remain

## 2. Fonts and typography

- [x] 2.1 Register Noto Serif TC (weights 500, 900) and Noto Sans TC (weights 400, 500, 700) via `next/font/google` in `app/layout.tsx`; expose as CSS vars `--font-serif` and `--font-sans`; enable `display: 'swap'` and the appropriate subsets; preload only the weights used above the fold
- [x] 2.2 Update all inline `fontFamily` usages in public components to read `var(--font-serif)` / `var(--font-sans)`; remove the old `Georgia` serif fallback in favor of `"Noto Serif TC", ui-serif, serif`
- [~] 2.3 Create `components/omikuji/StationLockup.tsx`: Chinese name serif 48–64px (responsive clamp), English caption above in sans, optional `← 前站 · 下一站 →` sub-lockup — deferred: ResultDisplay components already render inline serif lockup, extracting would be single-use abstraction. Will extract if/when the shareable ticket route reuses the same layout
- [x] 2.4 Verify bundle size delta under 200KB for fonts; re-subset if it overruns

## 3. Signature elements

- [x] 3.1 Create `components/omikuji/RailTickRule.tsx` (horizontal + vertical variants) — 1px `--rule` base line with repeating 4px tick marks via `background-image`; accept `orientation` prop
- [x] 3.2 Create `components/omikuji/SealMark.tsx` — circular SVG stamp in `--seal` color, 56–72px, renders centered text (date + 籤號 or mode label); accepts `children`
- [x] 3.3 Create `components/omikuji/OmikujiCard.tsx` — the single-card surface with paper texture (subtle SVG noise), kerf-edge top/bottom dashed borders, two-color offset shadow; renders a top-edge caption strip `No.XXXX · 都市籤詩 · <date>`
- [x] 3.4 Create `components/omikuji/KerfEdge.tsx` if needed, or ship kerf as a CSS utility class consumed by `OmikujiCard` directly (keep the primitive count low)

## 4. Reveal ritual (Phase 2)

- [x] 4.1 Create `components/omikuji/RevealRitual.tsx` with the 4-phase timeline (shake 0–300ms, pop 300–500ms, type-in 500–900ms, stamp 900–1100ms); use CSS keyframes + a small JS orchestrator with `requestAnimationFrame`; accept props `{ station, token, pickedAt, ticketNo, soundEnabled? }`
- [x] 4.2 Implement the parallel-fetch contract: caller starts the `POST /api/pick` fetch at CTA-press time; ritual begins immediately and pauses at end of phase 2 if response is late; resumes within 100ms of response; aborts gracefully on error
- [x] 4.3 Implement `prefers-reduced-motion` short-circuit: render final state immediately and fire `onDone` within 50ms
- [x] 4.4 Integrate `<RevealRitual>` into `components/tra/ResultDisplay.tsx` (replace the current `brand-reveal` fade) and into the MRT result path; keep all post-reveal CTAs (Wiki, Google Maps, 留下心得, 分享) in place
- [x] 4.5 Confirm no animation runtime was added: `grep -E "framer-motion|gsap|anime|lottie-web" package.json` SHALL be empty
- [ ] 4.6 Visual QA of the ritual: timing feels right, reduced-motion works, error state cleans up properly, rapid repeat clicks don't double-play

## 5. Community nav and deep link

- [x] 5.1 Extend `POST /api/pick` in `app/api/pick/route.ts` to include `comment_count` in the response; implement as a cheap COUNT query with a station-id index (verify `comments.station_id` has an index; add one via Drizzle migration if missing)
- [x] 5.2 Extend the pick response type in `components/types.ts` (or wherever `PickResult` is defined) to include `comment_count`; propagate through both `MrtPicker` and `TraPicker`
- [x] 5.3 In `components/tra/ResultDisplay.tsx` (and the MRT equivalent), add a secondary deep link under the main CTA: when `comment_count > 0`, "已有 N 位旅人抽到這站 · 看他們寫了什麼 →" linking to `/explore?station_id=<id>`; when `comment_count === 0`, "搶先留下這一站的心得 →" linking to `/comment?token=<token>`
- [x] 5.4 Ensure `/explore` accepts a `station_id` query parameter and filters; add minimal handling if not already present

## 6. Shareable ticket (Phase 3)

- [x] 6.1 Create `app/api/ticket/[token]/route.tsx` — GET handler that loads the `station_picks` row by token, joins to `stations`, generates a 1080×1920 PNG via `next/og`'s `ImageResponse`; sets `Cache-Control: public, max-age=3600, s-maxage=3600, immutable`. `/ticket/[token]` (HTML) kept as a landing page for QR scans.
- [x] 6.2 Bundle Noto Serif TC 900 and Noto Sans TC 500 (subset to station-name charset ≈ 26KB each) and JetBrains Mono 500 (≈110KB) under `public/fonts/`; loaded as `ArrayBuffer` in the ticket route via `readFile` — no outbound HTTP at request time.
- [x] 6.3 Design the ticket layout in JSX: station lockup (≥30% canvas height), English name caption, 籤號 `No.XXXX` mono, date, seal mark with mode label, brand wordmark caption, QR code (→ `/ticket/[token]`), kerf-edge top/bottom.
- [x] 6.4 Create `components/omikuji/ShareableTicket.tsx` — detects `navigator.share` with file support; fetches the PNG from `/api/ticket/[token]` and calls `navigator.share({ files: [File] })`; falls back to opening the PNG in a new tab with a "長按圖片儲存或分享" hint.
- [x] 6.5 Wire the share button into the result modal (TRA and MRT), positioned alongside `留下心得`
- [x] 6.6 Add a 籤號 generator: deterministic from the pick token (e.g. first 4 hex chars of token → 4-digit decimal) so the same token always produces the same number

## 7. Cleanup and validation

- [x] 7.1 Renamed all `--brand-*` CSS vars to their new names across consumer files, deleted back-compat alias block in `app/globals.css`, and swapped `.brand-glass` → `.omikuji-card` in community pages.
- [x] 7.2 Run `openspec validate redesign-omikuji-ui` and resolve all warnings
- [x] 7.3 Run `npm run build` and confirm no TypeScript or lint errors; verify `.next` analyzer shows expected bundle size
- [ ] 7.4 Manual accessibility pass: keyboard-navigate top bar, tabs, CTA, result modal, share button; confirm focus rings visible with ≥3:1 contrast; confirm `prefers-reduced-motion` disables the ritual
- [x] 7.5 Update `app/(public)/page.tsx` metadata (`<title>`) to contain "下一站" or "幸運車站"; remove any legacy "Lucky Station" / "捷運籤 / 搖一搖, 捷運替你決定今天" strings that still appear in source
- [ ] 7.6 Take before/after screenshots of desktop picker (MRT + TRA), result modal, and generated ticket PNG; attach to the PR description for review
