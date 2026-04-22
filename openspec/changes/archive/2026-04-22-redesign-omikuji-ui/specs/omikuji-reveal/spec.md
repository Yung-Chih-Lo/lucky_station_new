## ADDED Requirements

### Requirement: Omikuji ritual reveal component
The system SHALL provide a reusable `<RevealRitual>` component that plays when a pick result is rendered. The ritual SHALL consist of four sequential phases totaling approximately 1100–1300ms:

1. **搖籤筒 (shake)** — 0–300ms: a 籤筒 SVG rotates `±3deg` in an alternating pattern 3 times; the page backdrop dims by approximately 8%.
2. **竹籤彈出 (pop)** — 300–500ms: a 竹籤 element translates upward with a bounce; optionally an opt-in 木魚 sound cue plays.
3. **站名浮現 (type-in)** — 500–900ms: a new card scales from 0 to 1; a radial `--accent → --warn` flash fades over 150ms; the station-name characters appear with a 60ms stagger from left to right.
4. **印章蓋下 (stamp)** — 900–1100ms: a `<SealMark>` animates `scale(1.4) rotate(-8deg) → scale(1) rotate(0)` with a drop shadow; optionally a 敲擊 sound cue plays.

The ritual SHALL NOT be shorter than 900ms nor longer than 1500ms. After phase 4 completes, the component SHALL emit an `onDone` callback so the parent can display post-reveal CTAs.

#### Scenario: Full ritual on normal motion preference
- **WHEN** `<RevealRitual>` mounts with a resolved pick and `prefers-reduced-motion` is not set
- **THEN** phases 1–4 SHALL play in order
- **AND** the total elapsed time from mount to `onDone` callback SHALL be between 900ms and 1500ms

#### Scenario: Reduced motion skips the ritual
- **WHEN** `<RevealRitual>` mounts with `prefers-reduced-motion: reduce`
- **THEN** the component SHALL render the final state (card visible, station name in full, seal stamped) immediately
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
- **WHEN** `POST /api/pick` returns a non-2xx status while the ritual is playing
- **THEN** the ritual SHALL abort gracefully (hide the card, undim the backdrop)
- **AND** a user-facing error message SHALL be shown
- **AND** no station name SHALL be "revealed"

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
