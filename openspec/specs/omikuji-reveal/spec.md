# omikuji-reveal Specification

## Purpose
The 4-phase "shake → pop → type → stamp" ritual played when a pick result is
revealed. Defines the timeline, the parallel-fetch contract that lets the
ritual hide API latency, the prefers-reduced-motion fallback, and the
reusability contract across MRT and TRA modes.
## Requirements
### Requirement: Omikuji ritual reveal component
The system SHALL provide a reusable `<RevealRitual>` component that plays when a pick result is rendered. The ritual SHALL consist of three sequential phases totaling approximately 900–1300ms:

1. **搖籤筒 (shake)** — 0–300ms: a 籤筒 SVG rotates `±3deg` in an alternating pattern 3 times; the page backdrop dims by approximately 8%.
2. **竹籤彈出 (pop)** — 300–500ms: a 竹籤 element translates upward with a bounce; optionally an opt-in 木魚 sound cue plays.
3. **站名浮現 (type-in)** — 500–900ms: a new card scales from 0 to 1; a radial `--accent → --warn` flash fades over 150ms; the station-name characters appear with a 60ms stagger from left to right.

The ritual SHALL NOT be shorter than 900ms nor longer than 1500ms. After the type-in phase completes, the component SHALL emit an `onDone` callback so the parent can display post-reveal CTAs.

The legacy **印章蓋下 (stamp)** phase is removed in this capability revision; the `SealMark` footer element is retired.

#### Scenario: Full ritual on normal motion preference
- **WHEN** `<RevealRitual>` mounts with a resolved pick and `prefers-reduced-motion` is not set
- **THEN** the shake, pop, and type-in phases SHALL play in order
- **AND** the total elapsed time from mount to `onDone` callback SHALL be between 900ms and 1500ms

#### Scenario: Reduced motion skips the ritual
- **WHEN** `<RevealRitual>` mounts with `prefers-reduced-motion: reduce`
- **THEN** the component SHALL render the final state (card visible, station name in full) immediately
- **AND** it SHALL fire `onDone` within 50ms of mount
- **AND** no shake, scale, flash, or stagger animation SHALL play

#### Scenario: Sound cues are opt-in and default off
- **WHEN** `<RevealRitual>` plays its default configuration
- **THEN** no audio SHALL be played
- **AND** audio SHALL play only when an explicit user preference (e.g. `soundEnabled === true` from app state or a URL flag) is set

### Requirement: Ritual plays in parallel with the pick API call
To hide network latency, the client SHALL begin the `<RevealRitual>` presentation timeline at CTA-press time and fetch the pick result in parallel. If the pick response arrives before phase 3 (station-name typing) is ready to begin, the station name SHALL be revealed on schedule. If the pick response is still pending at the start of phase 3, the ritual SHALL hold at the pre-type-in state and resume as soon as the response arrives.

#### Scenario: API faster than ritual
- **WHEN** `POST /api/pick` resolves in less than 400ms
- **THEN** the ritual SHALL NOT cut phases 1–2 short
- **AND** phase 3 SHALL begin at its scheduled 500ms mark

#### Scenario: API slower than ritual
- **WHEN** `POST /api/pick` has not resolved by 500ms after CTA press
- **THEN** the ritual SHALL pause at the end of phase 2
- **AND** phase 3 SHALL begin within 100ms of the response arriving

#### Scenario: API error during ritual
- **WHEN** `POST /api/pick` returns a non-2xx status
- **THEN** the client SHALL display a user-facing toast containing the phrase "請重新整理頁面"
- **AND** the reveal modal SHALL NOT open
- **AND** no station name SHALL be "revealed"
- **AND** the picker SHALL return to its idle state so the user can pick again

### Requirement: Ritual uses primitive assets, not framework-specific animation libraries
The ritual SHALL be implementable with CSS keyframes plus a small JavaScript orchestrator; it SHALL NOT require adding a new runtime dependency beyond what is already in `package.json`. Lightweight existing helpers (e.g. `antd`'s motion hooks) MAY be used. If `framer-motion` (or equivalent) is later added for this feature, it SHALL be justified in the change's design document and SHALL keep the ritual's observable behavior identical to the spec.

#### Scenario: No new animation runtime dependency
- **WHEN** `package.json` is inspected after the change ships
- **THEN** the dependencies list SHALL NOT include `framer-motion`, `gsap`, `anime.js`, `lottie-web`, or any similar animation runtime that was not present before the change
- **AND** the ritual SHALL still satisfy the timing scenarios above

### Requirement: Ritual is reusable across transport modes
The `<RevealRitual>` component SHALL accept props identifying the resolved station (name, optional English name, mode, token, date, 籤號) and SHALL produce the same ritual shape for both MRT and TRA modes. The only per-mode variation SHALL be the accent color used in phase 3's radial flash and the seal stamp's trim color.

#### Scenario: Same component handles MRT and TRA
- **WHEN** a TRA pick resolves
- **THEN** the same `<RevealRitual>` module SHALL render the result
- **AND** the phase-3 radial flash SHALL use the TRA `--accent` value

#### Scenario: Props contract
- **WHEN** `<RevealRitual>` is invoked
- **THEN** it SHALL accept at minimum `station: { nameZh, nameEn?, mode: 'mrt' | 'tra' }`, `token: string`, `pickedAt: Date`, and `ticketNo: string`
- **AND** it SHALL render without throwing when any optional prop is omitted

### Requirement: Reveal footer is a two-zone layout with a dashed separator
The `<RevealRitual>` post-reveal body SHALL render two zones separated by a dashed horizontal rule:

- **Upper zone** renders the picker-provided result content (via `children`) plus a state-dependent insert beneath it: either a `<RelayExcerptCard>` (when the station has ≥1 prior comment) or a `<FirstArrivalCard>` (when the station has zero prior comments).
- **Lower zone** renders a `<ScanCtaCard>` containing the screenshot-save QR, eyebrow `SCAN · 心得`, a state-dependent two-line headline, description copy, the `<ShareableTicket>` button labeled `分享給你的好友`, and a caption of the form `No.xxxx · yyyy.mm.dd`.

The ritual SHALL NOT render the legacy seal row (the previous footer containing `<SealMark>`, inline QR, and date).

#### Scenario: Two-zone layout is present after reveal
- **WHEN** `<RevealRitual>` finishes its type-in phase
- **THEN** the component SHALL render the upper zone (children + RelayExcerptCard or FirstArrivalCard) above a dashed horizontal separator
- **AND** it SHALL render the lower zone (`<ScanCtaCard>`) below that separator
- **AND** no `<SealMark>` element SHALL be present in the DOM

#### Scenario: Upper-zone insert is state-dependent
- **WHEN** the relay API reports `count > 0` for the picked station
- **THEN** the upper zone SHALL render a `<RelayExcerptCard>` with the excerpt, handle, relative time, and `更多 N 則 →` link
- **AND** the lower zone SHALL render a `<ScanCtaCard>` with the "換你寫下此站心得" headline variant

#### Scenario: First-arrival variant
- **WHEN** the relay API reports `count === 0` for the picked station
- **THEN** the upper zone SHALL render a `<FirstArrivalCard>` with the dashed frame and "此站尚無人留言，你是第一位抵達的旅人。" copy
- **AND** the lower zone SHALL render a `<ScanCtaCard>` with the "成為此站第一位留言者" headline variant

#### Scenario: Loading state does not flash the first-arrival card
- **WHEN** the relay API request is still in-flight
- **THEN** the upper-zone insert SHALL be absent (no card rendered)
- **AND** no layout jump SHALL occur when the response resolves

### Requirement: ScanCtaCard composes QR, copy, share action, and caption
The `<ScanCtaCard>` component SHALL render as a single card with two columns: a QR on the left (sized ~140×140 CSS px) and a vertical text column on the right. The text column SHALL contain, in order, the eyebrow `SCAN · 心得`, a two-line serif-weight headline (content depends on the `variant` prop), a short description paragraph, a solid-dark `<ShareableTicket>` button labeled `分享給你的好友`, and a caption of the form `No.xxxx · yyyy.mm.dd`.

The QR SHALL encode the absolute URL `${origin}/comment?token=<token>`. The QR SHALL NOT be wrapped in a link, button, or click handler; scanning from a screenshot is the only intended activation path.

#### Scenario: Relay variant copy
- **WHEN** `<ScanCtaCard variant="relay" ... />` renders
- **THEN** the headline SHALL read `換你 / 寫下此站心得` on two lines
- **AND** the description SHALL read `截圖保存，日後掃描即可留言，與前旅人同框。`

#### Scenario: First-arrival variant copy
- **WHEN** `<ScanCtaCard variant="first" ... />` renders
- **THEN** the headline SHALL read `成為此站 / 第一位留言者` on two lines
- **AND** the description SHALL read `截圖保存此籤，日後掃描留言，你的字會是第一個被後來者看見的。`

#### Scenario: QR is static image, not interactive
- **WHEN** a user mounts a keyboard or pointer event on the QR image
- **THEN** the card SHALL NOT navigate or trigger any handler
- **AND** the QR SHALL render as an `<img>` with no surrounding `<a>` or `<button>`

#### Scenario: Caption shows pick number and date
- **WHEN** the card renders with `ticketNo="0042"` and `dateLabel="2026.04.22"`
- **THEN** the caption line SHALL read `No.0042 · 2026.04.22`

### Requirement: RelayExcerptCard renders the prior traveler's note with a masking-tape treatment
The `<RelayExcerptCard>` component SHALL render a paper-note card decorated with masking-tape visuals at two top corners (CSS pseudo-elements, no new image assets). The card SHALL show the eyebrow `前 旅 人 隨 筆`, the excerpt in italic serif, and a footer row containing `— 旅人 #<handle>` and the relative time on the left, and a `更多 N 則 →` link on the right when `count > 1`.

The `#<handle>` SHALL be derived from the latest comment's `id`, formatted as `String(id).padStart(4, '0')` — the literal `#` is prepended at render time.

The `更多 N 則 →` link SHALL navigate to `/explore?station_id=<stationId>` when the user activates it; `N` SHALL equal `count - 1` (others beyond the excerpted latest) when `count >= 2`, and the link SHALL NOT render when `count === 1`.

#### Scenario: Handle formatting
- **WHEN** the relay response has `handle: "0417"`
- **THEN** the card SHALL render the text `— 旅人 #0417`

#### Scenario: Relative time
- **WHEN** the excerpt's `postedAt` is 3 days before now
- **THEN** the card SHALL render a Chinese relative-time string matching `三日前` (or the closest bucket produced by the shared relative-time helper)

#### Scenario: More-count link
- **WHEN** the relay response has `count: 3`
- **THEN** the card SHALL render `更多 2 則 →`
- **AND** activating the link SHALL navigate to `/explore?station_id=<stationId>`

#### Scenario: Single-comment case hides more-count link
- **WHEN** the relay response has `count: 1`
- **THEN** the card SHALL NOT render the `更多 N 則 →` link

### Requirement: FirstArrivalCard renders the egg state for zero-comment stations
The `<FirstArrivalCard>` component SHALL render a dashed-border card with the eyebrow `首 旅 人`, an italic serif body `此站尚無人留言，你是第一位抵達的旅人。`, and a subtext row `FIRST TO ARRIVE · 彩蛋 ✦` (using the Unicode glyph U+2726).

#### Scenario: Egg card body copy
- **WHEN** `<FirstArrivalCard />` renders
- **THEN** the DOM SHALL contain the text `此站尚無人留言，你是第一位抵達的旅人。`
- **AND** the DOM SHALL contain the text `FIRST TO ARRIVE · 彩蛋 ✦`
- **AND** the card's border SHALL be styled dashed

