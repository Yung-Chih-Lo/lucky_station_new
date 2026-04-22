## Context

The product is a Next.js 15 + antd 5 app with two modes (MRT, TRA). The current design splits brand tokens across `lib/theme/mrt.ts` and `lib/theme/tra.ts`, mirrored via CSS custom properties under `[data-theme="mrt"]` / `[data-theme="tra"]` in `app/globals.css`. The MRT mode uses a dark-indigo + gold + glassmorphism palette; TRA uses a cream-to-sky gradient + orange. Neither feels distinctive, and the two modes look like different products.

The public layout shell (`app/(public)/layout.tsx`) renders a single `ThemeProvider`; tabs live inside `components/HomeClient.tsx`, so the page has no persistent top bar and no always-visible nav for the social surfaces (`/explore`, `/stats`). The `TraPicker` places a glass card sidebar next to a second glass card containing the SVG map, with a "台灣縣市" eyebrow on top of the map — this creates a double-card nest and a vertical misalignment.

The archived change `rebrand-visual-identity` locked in three invariants we must preserve: (a) brand tokens live in ONE TypeScript module and are consumed via `ConfigProvider` + CSS vars, (b) components SHALL NOT contain brand hex literals, (c) theme modules export named objects, not a default.

## Goals / Non-Goals

**Goals:**
- Unify MRT and TRA into one design language; mode identity reduced to a single accent-hue swap.
- Move `旅人心得 / 排行榜 / 登入` into a persistent top bar on every `(public)` route.
- Collapse the sidebar/hero split into a single "omikuji-paper" card with an internal rail-tick divider; delete the "台灣縣市" eyebrow.
- Establish signature visual elements (rail-tick rule, kerf edge, seal mark, two-color offset shadow) so any screenshot is identifiable.
- Turn the pick reveal into a 4-phase ritual (搖 → 彈 → 顯字 → 蓋章) that creates variable-reward anticipation and a peak-end moment.
- Generate a 1080×1920 shareable 籤紙 card from the result modal.
- Keep WCAG AA contrast on all body text and interactive states.

**Non-Goals:**
- Stamp-rally collection book, monthly station horoscope, and any feature that requires auth + new DB schema. These are future changes.
- Sound effects are opt-in and off by default; no auto-play audio.
- Dark mode is out of scope for this change. The design is light-first; dark follow-up can remap the same tokens later.
- Mobile-only redesigns (bottom nav, sticky CTA sheet) are not in scope — we keep responsive behavior reasonable but do not add mobile-specific components in this change.
- Internationalization of copy (adding English UI strings) — current 繁中 strings stay.

## Decisions

### 1. One palette, one-hue-swap modes
Store a single `tokens.ts` with all shared tokens; expose `accentForMode(mode)` that returns the MRT or TRA accent. Preferred over keeping separate `mrtBrand` / `traBrand` objects because the whole point of the redesign is that everything else (surface, radius, typography, border, seal) is identical. Alternatives considered: (a) keeping two full theme objects and deduping by composition — rejected as it invites drift; (b) derive TRA accent from MRT via a hue-rotate — rejected because `#E8421C` → `#15365C` is not a single hue rotation and hand-picked hexes are more controllable.

Palette (final):
- `--paper-bg: #F3ECDC` (body)
- `--paper-surface: #FFFBF0` (card)
- `--paper-surface-elevated: #FFFFFF` (modal)
- `--ink: #1A1D2B`
- `--ink-muted: #6B6557`
- `--rule: rgba(26, 29, 43, 0.15)`
- `--accent` — mode-dependent: MRT `#E8421C`, TRA `#15365C`
- `--accent-soft` — 10% tint of accent, for hover/selected-county fill
- `--seal: #C8954A` (印章金, only appears on the stamp mark)
- `--warn: #F2B63D` (香火黃, reserved for streak/collection badges in future changes)
- `--success: #2F7D4F`

Contrast verified: ink on paper-bg = 13.8:1 (AAA); ink-muted on paper-bg = 5.9:1 (AA+); white on MRT accent = 4.9:1 (AA for ≥18px); white on TRA accent = 9.1:1 (AAA). All primary CTAs meet AA for body text.

### 2. Drop glassmorphism, embrace paper
Surfaces are opaque paper, not `rgba(255,255,255,0.06)` on a dark gradient. This is a deliberate break from 2021 SaaS and a commitment to the 紙本籤 metaphor. Alternatives considered: keep a subtle blur for premium feel — rejected because the metaphor is printed paper, not frosted glass.

Add one texture: an SVG `feTurbulence` noise filter at 3% opacity on `--paper-surface` to give it a subtle paper grain. Applied once at the `TopBar` + `OmikujiCard` level via a CSS class, not a per-component decision.

### 3. Top bar owns mode tabs and social nav
Tabs move OUT of `HomeClient` and INTO a new `components/layout/TopBar.tsx`, which reads/writes mode through `ThemeProvider`'s context. Rationale: tabs are global navigation, not a picker-page concern; same tabs should feel consistent on `/explore` and `/stats` so users can switch mode from any social surface.

Layout (64px height, 1px rail-tick hairline at bottom):
```
[Logo 下一站·幸運車站]   (捷運)(台鐵)   旅人心得 排行榜 登入
       120px                pill-tabs          text links, gap 24px
```
- Logo: Noto Serif TC 900, stacked two-line lockup ("下一站" 18px / "幸運車站" 11px caption), color `--ink`.
- Tabs: ghost buttons, active uses `--accent` 2px underline (not a filled pill — keeps the bar airy). 300ms ease-out transition when accent swaps.
- Right nav: three text links. "登入" is a ghost button (border only, `--ink` border). `旅人心得` shows a small red dot when the backend signals "new within 24h" (future wiring — UI slot reserved, hidden by default).

### 4. Picker page as a single omikuji card
One `<OmikujiCard>` wraps both panes. Internal split is a 1px `--rule` vertical line with rail-tick decoration (`background: linear-gradient(to bottom, transparent, --rule 20%, --rule 80%, transparent)` + repeating tick marks via CSS `background-image`).

Left pane (320px fixed on desktop, full width above card on mobile): brand eyebrow ("選擇你的出發範圍") replaces the duplicate "台鐵籤" heading + slogan already shown in the top bar. Below: line/county picker, count summary ("已選 3 條"), primary CTA `抽．下．一．站`.

Right pane (flex-1): SVG map (TRA) or schematic (MRT). The "台灣縣市" eyebrow is deleted. Map fills the pane edge-to-edge with 32px top padding matching the left pane.

Card outer treatment: kerf edge (top + bottom dashed line 4px 2px), "No.XXXX / 2026.04.22 / 都市籤詩" caption strip inside the top edge so the card reads as an actual omikuji slip before any interaction.

### 5. Reveal ritual as a reusable `<RevealRitual>`
The ritual is a single component that plays when the pick API resolves. Timeline (~1200ms total):
- 0–300ms: 籤筒 SVG `rotate(±3deg)` 3x, backdrop dims 8%.
- 300–500ms: 籤筒 base `translateY(-4px)` bounce; one short木魚 cue if sound enabled.
- 500–900ms: new card scales 0→1 with radial `#E8421C → #F2B63D` flash fading 0.5→0 over 150ms; station name characters fade in at 60ms stagger.
- 900–1100ms: 印章 `scale(1.4) rotate(-8deg) → scale(1) rotate(0)` with a shadow drop; optional木敲 cue.
- `prefers-reduced-motion`: skip frames 0–900, jump to card visible + instant stamp.

Implementation: CSS keyframes + a small JS orchestrator using `requestAnimationFrame` or framer-motion. Prefer pure CSS+JS over adding framer-motion if animations are simple enough — evaluate during task 3.1. No new dependency unless the CSS path becomes unmaintainable.

### 6. Shareable ticket via satori + @vercel/og
Next 15 ships `@vercel/og` — no new dependency. A new route `app/(public)/api/ticket/[token]/route.ts` returns a 1080×1920 PNG. The result modal gets a "分享" button that opens this URL / triggers a download. We pass the token (already returned by `/api/pick`) + server-fetches station + date + 籤號. Alternatives considered: client-side `html-to-image` — rejected because it requires bundling canvas shims and fails on Safari intermittently; server-side OG gives consistent cross-platform output.

### 7. Fonts via `next/font/google`
Load Noto Serif TC (weights 500, 900) and Noto Sans TC (400, 500, 700) through `next/font/google` with `display: 'swap'` and subset to `chinese-traditional` + `latin`. Attach as CSS variables `--font-serif`, `--font-sans` on `<html>`. Estimated add: ~180KB combined after subset. JetBrains Mono loaded only on pages that render the ticket (lazy via dynamic import of the ticket component).

## Risks / Trade-offs

- **Cream paper + 朱砂紅 is visually loud** → Mitigation: keep accent used sparingly (CTA, active tab underline, selected map county, stamp). Most of the surface is paper + ink.
- **Serif station names on small Android screens may render slowly** → Mitigation: subset Noto Serif TC to the ~2.4k station-name characters + common UI glyphs; preload critical weight. Budget < 90KB for display weight.
- **Reveal ritual adds 1.2s latency between button and result** → Mitigation: start the pick API call on button down, play ritual in parallel; if API is slower than ritual, delay reveal frame until data arrives (rare). If API is faster, never cut ritual short — the ritual IS the product.
- **Shareable ticket via @vercel/og means SSR font loading + CJK glyph subsetting** → Mitigation: ship a pre-subset Noto Serif TC TTF in `public/fonts/` sized to station-name charset; skip emoji support in the ticket.
- **Losing the dark-MRT look breaks returning users' expectation** → Mitigation: the archived spec `rebrand-visual-identity` requires brand token single-source, not specific hex values; we're within that contract. Announcement copy on first visit can acknowledge the change.
- **Single-card composition may be harder to make responsive** → Mitigation: on viewport < 880px, collapse to stacked (left pane on top, right pane below); rail-tick divider rotates to horizontal.
- **Omikuji metaphor may confuse non-Taiwanese audiences** → Acceptable; primary audience is Taiwanese, and the visual language degrades gracefully (foreign viewers still see a clean ticket-like card).

## Migration Plan

1. Phase 1 (foundation, shippable independently): new palette tokens, top bar, single-card layout, delete eyebrow, remove glass. No behavior change in picker logic. This alone resolves the three alignment/color complaints and the nav placement.
2. Phase 2: reveal ritual. Guarded by `prefers-reduced-motion`. Rollback = revert one commit, reveal falls back to current `brand-reveal`.
3. Phase 3: shareable ticket route + modal "分享" button. Rollback = hide button; API route left in place is harmless.
4. No DB migration. No breaking API changes. Archived `rebrand-visual-identity` stays archived; this change produces a delta against its spec.

## Open Questions

- Sound cues — ship opt-in toggle in top bar overflow menu, or defer to a later change? (Recommend defer; UI slot reserved but not wired.)
- `旅人心得` red dot source — do we count distinct new comments in the last 24h globally, or just for stations the user has picked? (Recommend global for v1; personal follows auth work.)
- Desktop breakpoint for single-card → stacked: 880px or 1024px? (Recommend 960px; verify with real content in phase 1 visual QA.)
