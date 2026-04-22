# visual-identity Specification

## Purpose
TBD - created by archiving change rebrand-visual-identity. Update Purpose after archive.
## Requirements
### Requirement: Public-facing brand name and slogan
The public site SHALL present the brand as **「捷運籤」** with slogan **「搖一搖，捷運替你決定今天」**. The `<title>` metadata, visible page header, and sidebar heading SHALL all use this name. The prior string "Lucky Station" and the ad-hoc heading "隨機捷運 GO！" with emoji 🚇 SHALL NOT appear on any public page.

#### Scenario: Home page title metadata
- **WHEN** a user loads `/`
- **THEN** the document `<title>` SHALL be "捷運籤" (optionally with the slogan appended after a separator)
- **AND** the page SHALL NOT contain the literal strings "Lucky Station" or "隨機捷運 GO！"

#### Scenario: Sidebar heading
- **WHEN** the public sidebar renders
- **THEN** its primary heading SHALL read "捷運籤"
- **AND** its sub-line SHALL read the slogan "搖一搖，捷運替你決定今天" (or a variant that contains the verb 「搖」 and the phrase 「決定今天」)
- **AND** the heading area SHALL NOT contain any emoji character

### Requirement: Single source of truth for brand tokens
The system SHALL expose brand tokens (colors, fonts, radii) for both the MRT and TRA themes from one TypeScript module that feeds both the antd `ConfigProvider` themes and CSS custom properties on `<html>`. Hex literals for brand colors SHALL NOT appear inline in component files; components SHALL reference tokens via the antd theme, CSS variables, or re-exported constants. The module SHALL export named theme objects (e.g. `mrtTheme`, `traTheme`), not a single anonymous default.

#### Scenario: Palette change propagates everywhere
- **WHEN** the `--brand-accent-gold` token value (MRT) is changed in the single source module
- **THEN** both the antd CTA button and any custom gold border/ring on a non-antd element SHALL reflect the new value after reload
- **AND** no component file SHALL require a separate edit

#### Scenario: Both themes change in lockstep when tokens are renamed
- **WHEN** the brand tokens module renames a token (e.g. `--brand-accent-gold` → `--brand-cta`)
- **THEN** both the MRT theme and the TRA theme exports SHALL reference the new name
- **AND** components SHALL continue to work after a single coordinated edit

#### Scenario: No hex leaks in components
- **WHEN** the public component files (`HomeClient`, `Sidebar`, `ResultDisplay`, `SchematicMap`'s styling layer, and the new `components/tra/*` files) are scanned
- **THEN** they SHALL NOT contain brand color hex literals (e.g. `#1E1B4B`, `#D4A574`, `#1890ff`, `#F97316`)
- **AND** they MAY reference DB-driven line colors (from `lines.color`) directly, since those are data, not brand tokens

### Requirement: Color system — dark indigo base with gold CTA
The MRT mode SHALL use a dark-indigo background (`#1E1B4B`) with `Noto Sans TC` / `Noto Serif TC` text, glassmorphism surfaces for cards, and a muted gold (`#D4A574`) reserved for the primary CTA and the selected/active accent. The TRA mode SHALL use a light gradient background with stronger glassmorphism surfaces and a warm orange CTA. The 6 Taipei MRT line colors (from the DB) SHALL continue to drive station / connection / line-chip colors in MRT mode and SHALL NOT be overridden.

#### Scenario: MRT primary CTA color
- **WHEN** the "搖籤筒" (random-pick) button renders in MRT mode in its default enabled state
- **THEN** its background or border SHALL resolve to `--brand-accent-gold`
- **AND** its text contrast ratio against that background SHALL be at least 4.5:1

#### Scenario: TRA primary CTA color
- **WHEN** the "抽幸運車站" button renders in TRA mode in its default enabled state
- **THEN** its background SHALL resolve to the TRA `--brand-accent` (warm orange)
- **AND** its text contrast ratio against that background SHALL be at least 4.5:1

#### Scenario: Body text contrast in MRT mode
- **WHEN** any body-text element renders under MRT mode on `--brand-bg`
- **THEN** the resolved text color SHALL produce a contrast ratio of at least 4.5:1 against the background
- **AND** the resolved text color SHALL be `--brand-text` for primary text or `--brand-text-muted` for secondary labels

#### Scenario: Line chips keep DB colors in MRT mode
- **WHEN** an MRT line chip (sidebar checkbox dot, or a chip in the result modal) renders for a line whose `lines.color` is `#0070bd`
- **THEN** the chip fill SHALL be `#0070bd`
- **AND** no brand token SHALL override this value

### Requirement: Typography system — Noto Serif TC for ritual moments, Noto Sans TC for UI
The public site SHALL load Noto Serif TC (weights 500, 700) and Noto Sans TC (weights 400, 500, 700) via `next/font/google`, exposing them as CSS variables. Noto Serif TC SHALL be used for ritual-moment text: the result-reveal station name and the brand wordmark (「捷運籤」). All other UI text — buttons, helper labels, line-filter checkbox labels, page-section headings, and station labels on the schematic map — SHALL use Noto Sans TC.

#### Scenario: Result modal station name uses serif
- **WHEN** the result modal reveals a station
- **THEN** the station's Chinese name element SHALL compute `font-family` to Noto Serif TC (or its CSS-variable reference)
- **AND** the font weight SHALL be at least 700

#### Scenario: Brand wordmark uses serif
- **WHEN** the sidebar brand wordmark「捷運籤」renders
- **THEN** its computed `font-family` SHALL be Noto Serif TC (or its CSS-variable reference)
- **AND** the font weight SHALL be at least 700

#### Scenario: Non-wordmark UI text uses sans
- **WHEN** a button, helper label, line-filter checkbox label, page-section heading, or station label on the schematic map renders
- **THEN** the computed `font-family` SHALL be Noto Sans TC
- **AND** this rule SHALL NOT apply to the brand wordmark or the result-reveal station name

#### Scenario: Fonts load via next/font
- **WHEN** `app/layout.tsx` is inspected
- **THEN** it SHALL import both fonts from `next/font/google`
- **AND** it SHALL NOT rely on `@import url()` inside a CSS file or a `<link>` to `fonts.googleapis.com`

### Requirement: Glassmorphism surface treatment for cards
Public card-like surfaces (the sidebar container, the result modal inner panel) SHALL use a translucent white fill over the dark background with a blurred backdrop and a subtle border. A solid fallback SHALL render on browsers that lack `backdrop-filter` support.

#### Scenario: Sidebar card appearance
- **WHEN** the sidebar container renders on a `backdrop-filter`-supporting browser
- **THEN** it SHALL have `background: var(--brand-surface)` (a low-opacity white), a `backdrop-filter` of at least `blur(12px)`, and a 1px `var(--brand-border)` outline

#### Scenario: Fallback without backdrop-filter
- **WHEN** the browser does not support `backdrop-filter`
- **THEN** the sidebar container SHALL render with a solid `var(--brand-surface-strong)` fill
- **AND** the sidebar SHALL remain readable (body text still ≥ 4.5:1 contrast)

### Requirement: Ritual reveal for the result modal
The random-pick result modal SHALL reveal the station name with a soft fade-in plus a small upward translate, lasting no more than 400ms. The station name SHALL be the dominant visual element (serif, ≥ 40px). Wiki and Google Maps links SHALL render as pill-shaped buttons with inline SVG icons — no emoji characters SHALL appear.

#### Scenario: Default reveal animation
- **WHEN** the modal opens after an animation ends
- **THEN** the station-name element SHALL animate `opacity` from 0 to 1 and `transform` from `translateY(8px)` to `translateY(0)` over ≤ 400ms
- **AND** after the animation, the station name SHALL be visually dominant (largest text on screen)

#### Scenario: prefers-reduced-motion
- **WHEN** the user's OS reports `prefers-reduced-motion: reduce`
- **THEN** the reveal SHALL skip the fade/translate and render the final state immediately
- **AND** the 2-second station-name cycling animation in the map SHALL collapse to a single-frame reveal

#### Scenario: No emoji in links
- **WHEN** the Wiki and Google Maps links render
- **THEN** their icons SHALL be inline SVG (e.g. antd `@ant-design/icons`)
- **AND** their rendered text + accessible name SHALL NOT contain any emoji character

### Requirement: Brand scope is limited to public routes
The visual-identity tokens, theme provider, and CSS overrides SHALL apply only to the public marketing/picker routes (`/`, `/explore`, `/stats`, `/comment`). The admin subtree (`/admin/**` and `/login` if present) SHALL continue to render with the unmodified antd default theme. Within the public surface, the active theme (MRT or TRA) SHALL be determined as follows: `/` honors the user-selected tab; `/explore`, `/stats`, and `/comment` are pinned to the MRT theme.

#### Scenario: Admin page untouched
- **WHEN** a user navigates to `/admin`
- **THEN** the rendered UI SHALL use antd's default light theme (default blue `#1890ff`, default font stack)
- **AND** the `--brand-*` CSS variables MAY be present on `<html>` but SHALL NOT be consumed by any admin component

#### Scenario: Public home in MRT tab uses MRT theme
- **WHEN** a user navigates to `/` and the active tab is MRT
- **THEN** the rendered UI SHALL use the MRT theme tokens (dark indigo bg, Noto Sans/Serif TC, gold CTA)

#### Scenario: Public home in TRA tab uses TRA theme
- **WHEN** the user switches to the TRA tab on `/`
- **THEN** the rendered UI SHALL use the TRA theme tokens (light glassmorphism bg, warm orange CTA)

#### Scenario: Shared community pages pinned to MRT theme
- **WHEN** a user navigates to `/explore`, `/stats`, or `/comment`
- **THEN** the rendered UI SHALL use the MRT theme regardless of any displayed content's `transport_type`

### Requirement: Interactive elements have visible focus and pointer affordance
All clickable or focusable elements on the public surface SHALL show a visible focus ring when reached via keyboard and SHALL present `cursor: pointer` on hover for mouse users. Focus rings SHALL be at least 2px wide and SHALL have contrast ≥ 3:1 against the adjacent surface.

#### Scenario: Keyboard focus on CTA
- **WHEN** the user tabs to the "搖籤筒" button
- **THEN** a visible focus ring SHALL appear around the button
- **AND** the ring SHALL be at least 2px wide with at least 3:1 contrast against the button background

#### Scenario: Hover cursor
- **WHEN** the user hovers any clickable element (CTA, checkbox, pill link, modal close)
- **THEN** the cursor SHALL be `pointer`

### Requirement: Second public theme — TRA glassmorphism light
The system SHALL provide a second public visual theme dedicated to the TRA picker mode. This theme SHALL be a light-background glassmorphism style with a warm orange CTA accent, distinct from the MRT dark indigo theme. Both themes SHALL be exported from the same single source of truth module so brand tokens cannot drift.

The TRA theme tokens SHALL include at minimum:
- `--brand-bg`: a light gradient or near-white background suitable for glass surfaces
- `--brand-surface`: a translucent white at higher opacity than the MRT theme (≥ 0.55)
- `--brand-text`: a dark color readable on the light background (contrast ≥ 4.5:1 on `--brand-surface`)
- `--brand-text-muted`: a muted dark color for secondary labels
- `--brand-accent`: a warm orange (e.g. `#F97316`) reserved for the TRA primary CTA

#### Scenario: TRA theme tokens defined in the source module
- **WHEN** the brand tokens module (e.g. `lib/theme/index.ts`) is inspected
- **THEN** it SHALL export both `mrtTheme` and `traTheme` objects
- **AND** each theme SHALL provide values for the full set of brand tokens consumed by the public surface

#### Scenario: TRA theme contrast on body text
- **WHEN** any body-text element renders under the TRA theme on `--brand-bg`
- **THEN** the resolved text color SHALL produce a contrast ratio of at least 4.5:1 against the background

#### Scenario: TRA CTA color
- **WHEN** the "抽幸運車站" button renders in its enabled state under the TRA theme
- **THEN** its background SHALL resolve to `--brand-accent` (warm orange)
- **AND** its text contrast against that background SHALL be at least 4.5:1

### Requirement: Tab-driven theme switching on the home page
The home page (`/`) SHALL switch the active visual theme based on the selected transport tab. Theme switching SHALL update both the antd `ConfigProvider` and the `<html data-theme>` attribute so CSS variables and antd components stay synchronized.

#### Scenario: Initial render uses MRT theme
- **WHEN** the home page is server-rendered
- **THEN** `<html>` SHALL have `data-theme="mrt"`
- **AND** the antd `ConfigProvider` for the public surface SHALL receive the MRT theme config

#### Scenario: User switches to TRA tab
- **WHEN** the user clicks the TRA tab
- **THEN** `<html>` SHALL update to `data-theme="tra"`
- **AND** the antd `ConfigProvider` for the public surface SHALL re-render with the TRA theme config
- **AND** all public CSS that reads `--brand-*` variables SHALL reflect the TRA theme values without page reload

#### Scenario: Theme transition is smooth
- **WHEN** the active theme switches between MRT and TRA
- **THEN** background-color, color, and border-color properties on the root document SHALL transition over 150–250ms
- **AND** `prefers-reduced-motion: reduce` users SHALL receive an instant switch with no transition

### Requirement: Shared community pages are pinned to the MRT theme
The `/explore`, `/stats`, and `/comment` pages SHALL render with the MRT dark indigo theme regardless of which transport type the displayed content belongs to. These pages SHALL NOT switch theme based on per-row transport type or any user preference.

#### Scenario: /explore renders with MRT theme
- **WHEN** a visitor loads `/explore`
- **THEN** `<html>` SHALL have `data-theme="mrt"`
- **AND** the antd `ConfigProvider` for the page SHALL use the MRT theme config

#### Scenario: /stats renders with MRT theme
- **WHEN** a visitor loads `/stats`
- **THEN** `<html>` SHALL have `data-theme="mrt"`
- **AND** the leaderboard SHALL render against the MRT dark background even when the active scope is `tra`

#### Scenario: /comment renders with MRT theme regardless of token's transport_type
- **WHEN** a visitor loads `/comment?token=<token>` for a token whose `station_picks.transport_type = 'tra'`
- **THEN** `<html>` SHALL have `data-theme="mrt"`
- **AND** the page SHALL NOT switch to the TRA theme

