## Context

The result modal currently stacks four conceptually-different widgets in a linear vertical list: (a) station name + eyebrow + chips (in `ResultDisplay`), (b) relay excerpt block (inline in `ResultDisplay`), (c) share button + comment CTA (in `ResultDisplay`), and (d) the ritual "seal row" containing the ScreenshotSaveBlock QR, `SealMark` stamp, and date (in `RevealRitual`). Each was added by a different change; none were composed as a whole.

The user-supplied mock (2026-04-24) consolidates this into two zones with a dashed separator:

- **Upper zone** ("此站有緣"): eyebrow, station names, single chip, two Wiki/Maps buttons (50/50 rect), and a state-dependent insert (RelayExcerptCard OR FirstArrivalCard).
- **Lower zone** ("SCAN · 心得"): a single card with QR on the left and a text column on the right containing eyebrow, two-line headline, description, solid-dark "分享給你的好友" button, and `No.xxxx · date`.

The `SealMark` is retired. The standalone "搶先留下這一站的心得 →" button (shipped in `focus-comment-cta-and-unfinished-badge` last week) is removed — the ScanCtaCard headline IS the CTA.

## Goals / Non-Goals

**Goals:**

- Match the mock pixel-equivalent for the two zones, in both commentCount-zero and commentCount-positive states, on both MRT and TRA picker modals.
- Extend the relay API once to serve the RelayExcerptCard's needs (`handle`, `postedAt`, `count`) with a single query.
- Keep the reveal-phase animation (shake → pop → type-in) unchanged for station-name appearance; only the stamp phase loses its visual anchor (SealMark) and is dropped.
- Eliminate `SealMark` entirely (no consumers).

**Non-Goals:**

- No change to the PNG ticket generator (`/api/ticket/[token]`); its seal + QR remain as-is (that QR points to site root, unchanged since `share-safe-qr-and-self-reminder`).
- No change to the pick flow, `/api/pick` contract, localStorage pick_history schema, comment submit flow, or the PickHistory badge shipped last week.
- No change to the shareable ticket PNG's embedded QR target or seal colors.
- No redesign of the MRT SchematicMap or TRA TaiwanSvgMap picker surfaces.
- No new CSS design token for the scan card background — reuses `var(--paper-surface-elevated)`.

## Decisions

### Decision: Compose the redesign inside `RevealRitual`, not as a page-level wrapper

`RevealRitual` already owns the lifecycle of `token`, `ticketNo`, `dateLabel`, and the `waitFor` promise. The scan card needs all four (QR uses `token`, caption uses `ticketNo` + `dateLabel`, gate behavior uses `waitFor`). Pushing ScanCtaCard into the picker containers would force each picker to duplicate that prop plumbing.

**Alternatives considered:**
- Passing ScanCtaCard as a second child slot to `RevealRitual` — rejected; adds a new slot convention for a one-off shape.
- Lifting ticketNo/date back up to each picker — rejected; re-introduces the prop drift that `RevealRitual` was introduced to centralize.

**Consequence:** RelayExcerptCard and FirstArrivalCard also render *after* `children` (i.e., after `ResultDisplay`). `RevealRitual` accepts `commentCount` and optional `stationId` so it can render either card above the dashed divider. `ResultDisplay` no longer fetches relay itself.

### Decision: Single relay API call returns all fields the card needs

The `/api/stations/[id]/relay` endpoint is the single source of truth for "what the prior traveler said." Extend its SELECT once — `SELECT id, content, created_at FROM comments WHERE station_id = ? ORDER BY created_at DESC LIMIT 1` plus a separate `SELECT COUNT(*) FROM comments WHERE station_id = ?` — and extend the JSON shape to `{ excerpt, handle, postedAt, count }`. Handle is `String(id).padStart(4, '0')` (no `#` prefix in the payload; the UI adds presentation).

**Alternatives considered:**
- Inventing a new endpoint (`/api/stations/[id]/latest-comment` already exists — check its shape and reuse). **Outcome:** the existing `latest-comment` route returns a different contract (full content, no count, no excerpt truncation). Extending `/relay` is the right move; the two endpoints have different consumers.
- Deriving handle from `token` hash instead of `comment_id` — rejected per user decision; `#0417` from `comment_id` is stable, globally monotonic, and matches the ticket `No.` convention users are already seeing.

**Response shape:**

```json
{
  "excerpt": "溫泉博物館的木樓梯會吱吱響…",
  "handle": "0417",
  "postedAt": "2026-04-21T14:22:00.000Z",
  "count": 3
}
```

When `count === 0` the payload is `{ excerpt: null, handle: null, postedAt: null, count: 0 }`.

### Decision: State machine is keyed on `count` from the relay payload, not `commentCount` from pick API

Both fields will converge to the same number, but `count` lives next to `excerpt` in the same response and is guaranteed consistent (no race between two API calls). The pick-API `commentCount` is now redundant for this card's state and can be ignored by the scan card logic.

```
relay.count === 0  →  <FirstArrivalCard/> + <ScanCtaCard variant="first">
relay.count > 0    →  <RelayExcerptCard/>  + <ScanCtaCard variant="relay">
```

The pick response's `commentCount` stays on the wire for backward compatibility and for any future consumer (e.g., MrtPicker may still want an early hint before the relay API resolves — but for this change, the loading state simply shows neither card until relay resolves).

### Decision: Loading state = collapsed (no card above divider, no scan headline flicker)

While the relay API is in-flight, render no card above the dashed divider, and render the scan card with a muted placeholder headline ("載入中…" avoided — just reserve vertical space). This prevents the egg "首旅人" state from flashing for picks that actually have comments.

**Trade-off:** Users see a ~150ms blank zone on typical networks before the card settles. Mitigated by the existing ritual timeline — the reveal animation covers ~1100ms before the user is looking at the footer.

### Decision: `ShareableTicket` gains a `variant` prop, not a new component

The button exists in two places after this change: (a) inside the scan card (solid-dark, label "分享給你的好友" regardless of device capability), and (b) nowhere else — `ResultDisplay` no longer renders it.

Actually, since (b) drops to zero, the "two variants" framing is wrong. The button now always lives in the scan card with identical styling. The device-specific label variance (`曬出我的籤` on touch vs `分享給你的好友` on desktop) was copy-specific, not structural. Per the mock which shows "分享給你的好友" as the label in a touch-targeted design, we collapse to a **single label "分享給你的好友"** for both devices, with the share behavior branched internally (unchanged from today).

**Consequence:** `ShareableTicket`'s props stay the same shape; only the button's class/style set changes to solid-dark, and the `buttonLabel` branch collapses to a constant.

### Decision: Masking-tape and dashed-frame treatments are pure CSS

No new image assets, no inline SVG. Masking tape = two `::before`/`::after` pseudo-elements with a rotated semi-transparent gradient. Dashed frame for FirstArrivalCard = `border: 1.5px dashed var(--rule-strong)`. The ✦ sparkle in "FIRST TO ARRIVE · 彩蛋 ✦" is the Unicode glyph `✦` (U+2726), rendered inline.

### Decision: TRA county chip uses `var(--accent)`, not a new token

The mock shows the same pinkish-mauve chip color across both MRT's line chip and the TRA's county chip. Rather than adding a TRA-specific token, the TRA `ResultDisplay` renders the county inside the same chip component (inline `<span>` with shared style) using `var(--accent)` as the background fill. If the product later wants to visually distinguish county chips from line chips, that's a follow-up.

### Decision: Drop the `stamp` phase from the ritual timeline

With `SealMark` removed, the `is-stamped` CSS class toggle has no visual consumer. The phase sequence becomes `shake → pop → type → done` (the `stamp` phase is elided — its timing window is absorbed into `done`). `onDone` fires at the same moment it used to, preserving downstream expectations.

**Consequence:** CSS rules keyed on `.is-stamped` become dead. Cleanup is part of the implementation task list.

## Risks / Trade-offs

- **Risk: Removing `SealMark` also removes the `捷運` / `台鐵` stamp that helped users recognize mode at a glance.** → Mitigation: the ScanCtaCard's `No.xxxx` caption is now rendered in an identical serif weight with a subtle `mode` prefix (implementation detail: prepend `{modeLabel}` or leave as `No.xxxx` — the mock shows the latter, so the mode indicator lives only in the modal title and the PNG ticket's seal).
- **Risk: The relay API extension changes a stable response shape.** → Mitigation: additive only. Existing consumers (if any beyond `ResultDisplay`) still read `excerpt` and ignore the new fields.
- **Risk: The FirstArrivalCard over-rewards a trivial state (brand-new DB = every station is first-arrival).** → Mitigation: product is aware; the copy leans into the narrative ("你是第一位抵達的旅人") as a feature, not a bug. If this becomes noise later, product can add a minimum-launch-age gate.
- **Risk: Test-coverage regression for the removed comment-CTA two-state button (`commentCount > 0` showed "已有 N 位旅人" routing to `/explore`).** → Mitigation: the `更多 N 則 →` link inside RelayExcerptCard takes on that destination contract. Tests move with the logic.
- **Trade-off: We remove a recently-shipped button (last week's focus-comment-cta change). That's a minor thrash cost.** → Acceptance: the two-zone design is materially clearer than the single-button design; the prior change was a local optimum, not a dead-end.

## Migration Plan

No runtime migration required. Schema unchanged. All changes are code-only and ship in a single PR.

**Rollback:** git revert. The relay API response extension is additive, so an older client would keep working if a revert skew happened.

## Open Questions

None blocking implementation.
