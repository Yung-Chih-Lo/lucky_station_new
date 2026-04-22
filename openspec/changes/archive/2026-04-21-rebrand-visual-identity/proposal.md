## Why

The current public site uses default antd blue (`#1890ff`) with no unique brand. The sidebar title still says "隨機捷運 GO！ 🚇" and the result modal is a plain antd `Empty` + heading — generic, forgettable, un-shareable. The product needs a distinct visual identity before any feature work, so that the later "籤詩 + 分享卡 + 站點圖鑑" additions sit on a coherent brand rather than being patched onto a stock dashboard.

## What Changes

- **BREAKING (copy-level):** Public-facing brand renamed from "Lucky Station / 隨機捷運" to **「捷運籤」**, slogan 「搖一搖，捷運替你決定今天」. Admin UI is unaffected.
- Introduce a visual-identity token system: Taipei MRT 6 line colors as accents, deep-indigo `#1E1B4B` background, gold CTA `#D4A574`, glassmorphism surface, Noto Serif TC (ritual moments) + Noto Sans TC (UI).
- Rebuild public components (`HomeClient`, `Sidebar`, `ResultDisplay`) to consume the new token system. Remove emoji icons. Replace antd `Typography`/`Button`/`Checkbox` styling with themed variants (keep antd, override via `ConfigProvider` theme).
- Result modal shifts from "plain info card" to a ritual reveal: station name in serif, line chip(s), Wiki/Maps as pill links. No new features —籤詩 / 分享卡 / 圖鑑 are explicitly out of scope.
- `SchematicMap` visual pass only: station dot + label typography + selected/dimmed state colors updated to match the new palette. Interaction behaviour and admin hooks unchanged.

## Capabilities

### New Capabilities
- `visual-identity`: The public-facing brand, color system, typography scale, and surface treatment that all public pages (including the schematic map's non-behavioural styling) must conform to.

### Modified Capabilities
<!-- None. `schematic-rendering` specifies coordinate math, animation, and admin hooks, none of which change. The map's fonts/background/station-dot colors are governed by the new `visual-identity` spec. -->


## Impact

- **Code:** `app/layout.tsx`, `app/page.tsx`, `components/HomeClient.tsx`, `components/Sidebar.tsx`, `components/ResultDisplay.tsx`, `components/SchematicMap.tsx` (style-only). New `app/globals.css` (or equivalent) for font imports + CSS custom properties. New `lib/theme.ts` for antd `ConfigProvider` theme + shared token exports.
- **Dependencies:** None added. Noto fonts loaded via `next/font/google` (already transitively available through Next 15). No new npm packages.
- **Admin:** Untouched. `/admin` keeps current antd default styling.
- **DB / APIs:** No schema changes, no API changes.
- **Out of scope (future changes):** 籤詩 AI 批次生成、分享卡 canvas 產圖、站點圖鑑 localStorage、抽籤音效。
