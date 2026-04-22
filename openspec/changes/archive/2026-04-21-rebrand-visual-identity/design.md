## Context

- Stack: Next.js 15 App Router + antd 5 + better-sqlite3. No existing CSS framework (no Tailwind, no CSS-in-JS beyond antd's emotion).
- Existing public UI (`HomeClient`, `Sidebar`, `ResultDisplay`, `SchematicMap`) uses inline `style={{}}` objects with hardcoded antd blue `#1890ff`, antd defaults for `Typography`/`Button`/`Checkbox`, and one emoji (🚇) in the sidebar title.
- Admin UI (`/admin/**`) also uses antd defaults and is explicitly out of scope — the visual system must NOT leak into `AdminClient` or the login page.
- Station/line colors already live in the DB (`lines.color`, seeded from `scripts/seed-data/metroData.json`) and drive `SchematicMap` strokes. They stay as-is; the rebrand wraps them, not replaces them.

## Goals / Non-Goals

**Goals:**
- A single source of truth for brand tokens (color, typography, radius, elevation) consumed by both CSS and antd.
- "Ritual" feel on the public picker: dark-indigo canvas, glassmorphism sidebar card, gold CTA, serif for station names in the result reveal.
- Zero new dependencies. Zero DB changes. Zero API changes.
- Responsive kept: sidebar stacks under map on mobile (current flexWrap behaviour preserved).
- Accessibility kept or improved: contrast ≥ 4.5:1 on body text, focus rings on all interactive elements, no colour-only indicators.

**Non-Goals:**
- New features (籤詩 / 分享卡 / 站點圖鑑 / 音效) — these live in later changes.
- Ripping out antd. We theme it, not replace it.
- Redesigning `/admin`. Admin keeps antd defaults; the new theme is scoped to the public `(home)` segment.
- Light mode toggle. The public site is dark-by-default for this change.
- Any change to `SchematicMap`'s coordinate math, animation hops, or admin interaction hooks.

## Decisions

### D1. Theme the existing antd, don't replace it
**Choice:** Wrap the public route with a nested `<ConfigProvider theme={...}>` that overrides `token.colorPrimary`, `token.colorBgBase`, `token.fontFamily`, `token.borderRadius`, etc. Admin gets its own plain `<AntdRegistry>` wrapper without the override.

**Why not:** Tailwind or CSS modules would mean rewriting every antd component or double-styling. Ripping antd entirely would blow the scope; the sidebar's `Checkbox.Group` and modal are already wired and fine functionally.

**Alternative considered:** Pure CSS overrides via `:where()` selectors on antd class names — rejected because antd 5 uses hashed class names under emotion, and `ConfigProvider` is the supported API.

### D2. Two token layers: CSS custom properties + antd theme object, both referencing one TS constant
**Choice:** `lib/theme.ts` exports a `brand` object (hex values, font family names, radius scale). From that we build (a) an antd `ThemeConfig` used in `<ConfigProvider>`, and (b) a CSS string injected via `app/globals.css` for non-antd elements (custom buttons, gradients, glass surfaces).

**Why:** Without this, the antd tokens and the CSS vars will drift. With one TS source, a palette change is a one-line edit.

**Scope of CSS vars (minimal):** `--brand-bg`, `--brand-surface`, `--brand-surface-strong`, `--brand-text`, `--brand-text-muted`, `--brand-accent-gold`, `--brand-border`, `--brand-radius-sm/md/lg`, `--brand-font-sans`, `--brand-font-serif`. That's it — line colors stay in the DB.

### D3. Fonts via `next/font/google`, not manual `@import`
**Choice:** Load `Noto_Sans_TC` (400/500/700) and `Noto_Serif_TC` (500/700) in `app/layout.tsx` using `next/font/google`. Expose them as CSS variables on `<html>`.

**Why:** Zero new deps (bundled with Next 15), zero FOIT, automatic `font-display: swap`, subset fetched per page. Manual `@import` in CSS would block render and skip Next's optimization.

**Trade-off:** Chinese subsets are large (~200KB per weight). Mitigated by loading only 3 + 2 weights and relying on Next's streaming.

### D4. Dark indigo base with glassmorphism sidebar
**Tokens (locked):**
- `--brand-bg` = `#1E1B4B` (indigo-950)
- `--brand-surface` = `rgba(255, 255, 255, 0.06)` on dark bg (the glass)
- `--brand-surface-strong` = `rgba(255, 255, 255, 0.10)` (hover/active state)
- `--brand-text` = `#F5F3FF` (near-white, passes 4.5:1 on bg)
- `--brand-text-muted` = `#A5B4FC` (indigo-300, for secondary labels)
- `--brand-accent-gold` = `#D4A574` (CTA + "搖籤筒" button + selected line chip)
- `--brand-border` = `rgba(255, 255, 255, 0.12)`

**Glass:** `background: var(--brand-surface); backdrop-filter: blur(16px) saturate(140%); border: 1px solid var(--brand-border);`

**Why these specific hexes:** `#1E1B4B` is deep enough to make line colors (the 6 MRT hues) pop without washing out. `#D4A574` is a muted gold — avoids the "spam gold" of `#FFD700` while still reading as distinct from the 6 MRT line colors.

### D5. Map canvas gets a subtle vignette, not a wholesale restyle
**Choice:** `SchematicMap` keeps its existing SVG rendering (coordinates, paths from DB, admin hooks). Only the *container* changes: dark indigo bg, subtle radial gradient vignette, the SVG's default text color switched to `--brand-text` via a CSS var cascade. Station dots stay the DB line color. Labels switch from browser default to `var(--brand-font-sans)`.

**Why:** Rewriting the SVG styling risks breaking the admin editor. Container-level changes are safe and reversible.

### D6. "Ritual reveal" result modal
**Choice:** Keep antd `<Modal>` as the shell (centering, backdrop, escape-to-close). Replace inner content:
- Station Chinese name: `Noto Serif TC` weight 700, 48px, fade-in with `translateY(8px → 0)` over 400ms on mount.
- Line chip(s): pill shape with the DB line color as background + white text; serif disabled here, Noto Sans 13px.
- Wiki / Google Maps: two text-link "pill" buttons with gold border, white text; no emoji, use inline SVG icons (Lucide's `ExternalLink` / `MapPin`).
- Background: `--brand-surface-strong` with thicker blur (`24px`) and a 1px gold hairline border for the ritual accent.

**Why fade-in instead of a full flip:** Flip animations look good in demos but feel forced for a single-element reveal. A soft fade + slight translate reads as ceremonial without being cute. Duration capped at 400ms per UI/UX pro max `duration-timing` rule (150–300ms micro, ≤400ms transitions).

**`prefers-reduced-motion`:** When set, the fade is replaced with instant render; the 2-second station-name-cycling animation in `SchematicMap` also collapses to a single-frame reveal.

### D7. Icons: SVG, not emoji
**Choice:** Remove `🚇` from sidebar title. For the handful of glyphs we need (the CTA's "shuffle" icon, external-link, map-pin), import from `@ant-design/icons` (already in deps) — `SwapOutlined`, `ExportOutlined`, `EnvironmentOutlined`. No new icon pack.

**Why:** Ant Design icons are already a transitive dep via antd and ship as individually tree-shakable SVG React components. Adding Lucide would be ~30KB for no benefit here.

## Risks / Trade-offs

- [antd `ConfigProvider` doesn't cover every component style, e.g., Modal's backdrop] → Override the handful of holdouts with a scoped CSS block in `globals.css` keyed on `.ant-modal-content` inside the public route. Document the scope on that block.
- [Glassmorphism fails on browsers without `backdrop-filter` (older Firefox/Android WebView)] → Provide a solid `--brand-surface-strong` fallback via `@supports not (backdrop-filter: blur(1px))`. The sidebar is still readable, just less pretty.
- [Dark theme may clash with `AntdRegistry` default light mode briefly on hydration] → Set the dark background on `<html>` via inline style in `layout.tsx` so first paint is already dark. antd mounts after, and the scoped `ConfigProvider` applies instantly on the client.
- [Large Chinese font payload] → Accept the cost; we already ship antd and Next's JS, a few hundred KB of Noto is in line with user expectations. Monitor `/` Lighthouse if it becomes an issue; can drop to weight 400 + 700 only.
- [Admin pages accidentally inheriting the dark theme] → Scope the new `ConfigProvider` to a root layout segment group (e.g., wrap only `app/page.tsx` or use a `(public)` route group) rather than the global `app/layout.tsx`. `/admin/**` uses its own layout already.
- [Re-test the 2-second cycling animation with the new label font] → Labels get longer/wider; verify the SVG text element doesn't clip near the canvas edges with the serif/sans swap.

## Migration Plan

- Single-branch swap, no feature flag. The public route rebuild can land in one PR because admin is untouched.
- Before merge: smoke-test (a) all 6 line filters work, (b) random pick still animates + lands correctly, (c) modal links open correctly, (d) admin at `/admin` still renders in antd default blue (regression check).
- Rollback: revert the PR. DB and server code are unchanged, so rollback is pure frontend.

## Open Questions

- None blocking. Light-mode toggle is deliberately deferred to a future change.
