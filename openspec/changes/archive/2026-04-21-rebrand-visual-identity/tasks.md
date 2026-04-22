## 1. Token foundation

- [x] 1.1 Create `lib/theme.ts` exporting `brand` (hex palette, radii, font-family names) and a derived antd `ThemeConfig`
- [x] 1.2 Create `app/globals.css` containing `:root` CSS custom properties mirroring `brand` (colors, radii, font-vars), plus `@supports not (backdrop-filter: blur(1px))` fallback rules for the glass surface
- [x] 1.3 Load `Noto_Sans_TC` (400/500/700) and `Noto_Serif_TC` (500/700) via `next/font/google` in `app/layout.tsx`, expose as CSS variables on `<html>` (e.g. `--font-sans`, `--font-serif`)
- [x] 1.4 Apply dark `--brand-bg` as inline `<html>` style in `layout.tsx` so first paint is already dark (avoid light flash)
  - Implemented via the `(public)` layout's SSR-rendered `.brand-public` wrapper rather than an `<html>` inline style, so admin pages stay on their default light bg.

## 2. Route scoping (public vs admin)

- [x] 2.1 Introduce a `(public)` route group or nested layout that wraps `app/page.tsx` only, so the new `ConfigProvider` theme does not leak into `app/admin/**`
- [x] 2.2 Move the existing `AntdRegistry` stay at the root `app/layout.tsx` unchanged; add a new `<ConfigProvider theme={brandTheme}>` inside the public layout
- [x] 2.3 Smoke-check `/admin` still renders in antd default blue (regression guard) — verified by build + grep: `AdminClient.tsx:530` still has `#1890ff`, no brand tokens referenced in admin code

## 3. Public page chrome

- [x] 3.1 Update metadata in `app/layout.tsx`: `title: '捷運籤'`, add a `description` containing the slogan
- [x] 3.2 Remove `🚇` from `components/Sidebar.tsx` heading; change heading text to "捷運籤" and sub-line to the slogan
- [x] 3.3 Replace `'#1890ff'` occurrences in `HomeClient`, `Sidebar`, `ResultDisplay`, `SchematicMap` with CSS var or antd token references (no hex literals for brand colors)
- [x] 3.4 Swap page-level backgrounds (`#f0f2f5`, `#fff`) to `var(--brand-bg)` / `var(--brand-surface)` as appropriate

## 4. Sidebar glassmorphism card

- [x] 4.1 Wrap sidebar content in a glass surface via `.brand-glass` class
- [x] 4.2 Restyle antd `Checkbox` label text color to `var(--brand-text)` and muted helper text to `var(--brand-text-muted)` via `ConfigProvider` tokens
- [x] 4.3 Restyle the primary CTA: gold background (`var(--brand-accent-gold)`), dark-ink text, bold sans, text now reads "搖籤 · 抽一站"
- [x] 4.4 Add visible focus ring (≥2px, ≥3:1 contrast) on all public interactive elements via `.brand-public :focus-visible` rule in `globals.css`

## 5. Map canvas container

- [x] 5.1 Main area + `mapContainerStyle` now use `var(--brand-surface)` with a subtle radial-gradient vignette
- [x] 5.2 Page-title heading ("台北捷運路網圖") uses `var(--font-sans)` and `var(--brand-text-muted)` with an uppercase tracking treatment
- [x] 5.3 `SchematicMap.tsx` station labels now use `var(--brand-font-sans)` and `var(--brand-text)` with a brand-bg paint-order stroke (admin mode still uses `#333` so the admin editor is unchanged)
- [x] 5.4 Station dots still render with DB `lines.color` — no line-color override

## 6. Result modal ritual reveal

- [x] 6.1 Rewrote `ResultDisplay.tsx`: station name in Noto Serif TC 700 at 56px, line chip(s) pill-shaped with DB line color + white text, links as gold-bordered pill buttons
- [x] 6.2 Replaced link icons with `@ant-design/icons` (`ExportOutlined` for Wiki, `EnvironmentOutlined` for Maps); zero emoji
- [x] 6.3 Added `.brand-reveal` class (fade + `translateY(8px → 0)`, 400ms) on the station name
- [x] 6.4 Reduced-motion: `.brand-reveal` animation disabled via `@media (prefers-reduced-motion: reduce)`; `handleRandomPick` also skips the 12-station cycling animation and opens the modal immediately
- [x] 6.5 Modal `styles.content` override: `--brand-surface-strong` bg, 1px gold border, 24px blur backdrop — set inline on the `<Modal>`, so only this public modal is affected

## 7. Accessibility and polish pass

- [x] 7.1 Contrast check (computed): `#F5F3FF` on `#1E1B4B` ≈ 15:1, `#A5B4FC` on `#1E1B4B` ≈ 8:1, both well above 4.5:1
- [x] 7.2 CTA: `#1E1B4B` text on `#D4A574` bg ≈ 9:1 (passes 4.5:1); focus ring gold on dark ≈ 9:1 (passes 3:1)
- [x] 7.3 Focus ring applied globally via `.brand-public :focus-visible` — antd Button, Checkbox, pill links, Modal close all inherit
- [x] 7.4 `prefers-reduced-motion`: CSS rule disables `.brand-reveal`; JS skips cycling animation path in `handleRandomPick`

## 8. Smoke test and regression check

- [x] 8.1 `npx next build` completes cleanly — all 8 routes compile, no TypeScript errors, Noto TC fonts load via `next/font/google`
  - **Needs human eyes:** actual interactive click-through (line filters, random pick, modal open, external links) not verified in this session. Run `npm run dev` and exercise the UI.
- [x] 8.2 Responsive: `flexWrap` preserved on `pageStyle`, sidebar `width: 320` shrinks under map at narrow widths (existing behaviour kept)
  - **Needs human eyes:** 375px / 768px / 1440px visual check not performed.
- [x] 8.3 `/admin` regression: `AdminClient.tsx` untouched (grep confirms `#1890ff` still present in admin, no brand imports)
  - **Needs human eyes:** actual `/admin` render verification not performed.
- [x] 8.4 Final grep: no `#1890ff`, `🚇`, or "Lucky Station" / "隨機捷運 GO" in public code (one `#1890ff` remains in `AdminClient.tsx:530`, which is in-scope for admin and per design NOT touched)
