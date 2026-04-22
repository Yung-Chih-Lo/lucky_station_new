## Why

The current visual identity splits into two disconnected worlds — deep-indigo + muted gold (MRT) and cream + orange (TRA) — which dilutes brand memory every time a user switches mode; both palettes feel generic, and the core ritual of the product (抽一個幸運車站) is rendered with no anticipation or payoff. At the same time, the social entry points `旅人心得` and `排行榜` are buried at the bottom of the sidebar, so first-time visitors rarely see them and the retention flywheel never spins. The sidebar and map also fail to align because a vestigial "台灣縣市" eyebrow pushes the main-area content down. We need a single coherent design language that treats the pick as a ritual, elevates the social nav, and gives the product a screenshottable identity worth sharing.

## What Changes

- **BREAKING**: Replace the parallel `mrtBrand` / `traBrand` tokens with ONE unified palette ("Urban Omikuji Press"): paper base `#F3ECDC`, ink `#1A1D2B`, seal gold `#C8954A`; mode differs ONLY by one accent hue — 朱砂紅 `#E8421C` for MRT, 鐵道深藍 `#15365C` for TRA. All other tokens (surface, typography, radius, border) are shared across modes.
- **BREAKING**: Remove glassmorphism from the public layer. Surfaces are opaque paper (`#FFFBF0`), separated by 1px rail-tick rules, not blurred glass.
- Introduce a persistent **top bar** on all `(public)` routes: wordmark left, `捷運 / 台鐵` pill tabs centered, `旅人心得 · 排行榜 · 登入` text links right. Tabs no longer live inside `HomeClient`.
- Delete the "台灣縣市" eyebrow heading. Merge sidebar + hero into a single "omikuji-paper" card with an internal vertical rail-tick divider so both panes share one top edge.
- Move county picker / line picker state out of a standalone `brand-glass` sidebar card into the left pane of the shared card (no inner double-card nesting).
- Replace the current `brand-reveal` modal enter with a 4-phase ritual: (1) 籤筒搖 200–500ms, (2) 竹籤彈出 200ms, (3) 站名逐字浮現 400ms, (4) 紅印章啪一聲蓋下 200ms. Prefers-reduced-motion users get the instant reveal.
- Add a shareable **籤紙** card component rendered from the result modal: 1080×1920,站名 lockup + 印章 + 籤號 `No.XXXX` + date + QR. Export via html-to-canvas or server-side OG image.
- Add fonts: `Noto Serif TC 900` (display/站名), `Noto Sans TC 400/500/700` (body), `JetBrains Mono` (籤號 only). Serve via `next/font` with subsetting.

## Capabilities

### New Capabilities
- `omikuji-reveal`: the ritual reveal animation (shake → pop → type → stamp) and its reduced-motion fallback, covering both MRT and TRA pickers.
- `shareable-ticket`: the 1080×1920 omikuji-card generator invoked from the result modal.

### Modified Capabilities
- `visual-identity`: replace the dual MRT/TRA palettes and glassmorphism rules with the unified Omikuji Press palette, typography, and signature elements (rail-tick rules, kerf edges, seal marks, two-color offset shadow). Redefine layout composition rules (single-card split, no inner double-card).
- `community-engagement`: the nav entry points `旅人心得` and `排行榜` are promoted to the top bar; each result modal SHALL deep-link to the comment thread for the picked station with the count of existing 心得.

## Impact

- Code:
  - `lib/theme/{mrt,tra}.ts` and `lib/theme/index.ts` collapse into a single `lib/theme/tokens.ts` + per-mode accent override.
  - `app/globals.css` — replace `:root` / `[data-theme="mrt|tra"]` token blocks; delete `.brand-glass`; add `.rail-tick-rule`, `.kerf-edge`, `.seal-mark`.
  - `app/(public)/layout.tsx` — wrap children in a new `<TopBar />` that owns tabs + nav.
  - `components/HomeClient.tsx` — stops owning tabs; becomes a pass-through that reads mode from context.
  - `components/tra/{TraPicker,Sidebar,ResultDisplay}.tsx` and `components/mrt/MrtPicker.tsx` — relayout into single-card split; remove "台灣縣市" eyebrow; remove inner `brand-glass` sidebar card.
  - New `components/omikuji/{RevealRitual,ShareableTicket,StationLockup,SealMark,RailTickRule}.tsx`.
- Assets: `public/fonts/` adds Noto Serif TC 900 subset; `public/sfx/` (optional, opt-in) adds three short cues for shake/stamp/chime.
- Dependencies: add `html-to-image` (or use `satori` + `@vercel/og` already implicit in Next 15) for the shareable card export. Verify current deps before adding — prefer zero new packages if achievable.
- Out of scope (future changes): 印章 collection (stamp rally book), 每月車站運勢 — these require auth / DB schema and are separate proposals.
- Existing archived `rebrand-visual-identity` requirements that still hold (single source of truth for tokens, no hex leaks in components, theme modules expose named exports) are preserved; only the token VALUES and the glass rule change.
