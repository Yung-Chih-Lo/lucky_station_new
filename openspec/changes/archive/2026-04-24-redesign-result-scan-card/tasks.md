## 1. Extend the relay API

- [x] 1.1 Update `app/api/stations/[id]/relay/route.ts` to also SELECT `id` and `created_at` from the latest comment, and run a second `COUNT(*)` query for `count`
- [x] 1.2 Return the extended shape `{ excerpt, handle, postedAt, count }`; when no comments exist return `{ excerpt: null, handle: null, postedAt: null, count: 0 }`
- [x] 1.3 Add/extend tests for the route: station with comments (fields populated), station with zero comments (all-null + zero), unknown station (404)

## 2. Add a relative-time helper

- [x] 2.1 If a shared zh-TW relative-time helper does not already exist in `lib/`, add `lib/relativeTime.ts` with a single `formatRelativeZhTW(iso: string, now?: Date): string` function covering buckets: 剛剛 / N 分鐘前 / N 小時前 / N 日前 / N 週前 / N 個月前 / N 年前
- [x] 2.2 Unit tests for each bucket including off-by-one boundaries

## 3. Add FirstArrivalCard

- [x] 3.1 Create `components/omikuji/FirstArrivalCard.tsx` — dashed border, `首 旅 人` eyebrow, italic serif body `此站尚無人留言，你是第一位抵達的旅人。`, `FIRST TO ARRIVE · 彩蛋 ✦` subtext row
- [x] 3.2 Create `components/omikuji/FirstArrivalCard.test.tsx` asserting required copy + dashed border style

## 4. Add RelayExcerptCard

- [x] 4.1 Create `components/omikuji/RelayExcerptCard.tsx` accepting `{ stationId, excerpt, handle, postedAt, count }`; masking-tape pseudo-elements at top corners; `前 旅 人 隨 筆` eyebrow; italic serif excerpt; footer row with `— 旅人 #<handle> · <relativeTime>` left + `更多 <count-1> 則 →` right (next/link to `/explore?station_id=<stationId>`)
- [x] 4.2 Hide the `更多 N 則 →` link entirely when `count === 1`
- [x] 4.3 Create `components/omikuji/RelayExcerptCard.test.tsx` covering: handle formatting, relative-time rendering, more-count link destination + count math, single-comment case hides the link

## 5. Add ScanCtaCard

- [x] 5.1 Create `components/omikuji/ScanCtaCard.tsx` accepting `{ token, ticketNo, dateLabel, variant: 'relay' | 'first' }`; two-column layout (QR ~140×140 on left, text column on right)
- [x] 5.2 Wire the existing `ScreenshotSaveBlock` for the left column at size 140; keep its static-image, no-link behavior
- [x] 5.3 Render text column in order: `SCAN · 心得` eyebrow → two-line serif headline (variant-dependent) → description (variant-dependent) → `<ShareableTicket>` button → caption `No.<ticketNo> · <dateLabel>`
- [x] 5.4 Use `var(--paper-surface-elevated)` for the card background
- [x] 5.5 Create `components/omikuji/ScanCtaCard.test.tsx` covering: both variants' headline + description copy, QR is not wrapped in link, caption format, ShareableTicket is present

## 6. Update ShareableTicket

- [x] 6.1 Collapse `buttonLabel` to the constant `'分享給你的好友'` (both touch and desktop paths); keep the underlying share/copy behavior unchanged
- [x] 6.2 Style the Antd Button as solid-dark (primary weight): `type="primary"` with a dark/ink color override, OR a custom className that sets `background: var(--ink)` + `color: var(--paper)`
- [x] 6.3 Update `components/omikuji/ShareableTicket.test.tsx`: remove or update the touch-device-label-variance test; keep the three share-behavior tests; add a test that the rendered label is `分享給你的好友` regardless of touch detection

## 7. Rewrite RevealRitual footer

- [x] 7.1 Remove `SealMark` import and all JSX references; remove the `sealRow`, `qrCaptionStyle`, `qrArrowStyle`, `dateTextStyle` style objects and their usages
- [x] 7.2 Remove the `stamp` phase from the `Phase` union and the `TIMING.stamp` constant; adjust the type-in-phase effect so `onDone` fires at `typeMs` (no separate stamp delay)
- [x] 7.3 Remove the `.is-stamped` class toggle and any CSS still keyed on it (grep the `omikuji-ritual` stylesheet — likely in `app/globals.css` or a local CSS module)
- [x] 7.4 Add props `stationId: number`, `commentCount?: number` (optional, for early display before relay resolves — see 7.6), and render two zones after the ritual stage: upper zone (children + RelayExcerptCard-or-FirstArrivalCard below) and lower zone (ScanCtaCard), separated by a dashed `<hr>` (reuse `.rail-tick-rule is-horizontal` class if its styling fits, otherwise inline border)
- [x] 7.5 Inside RevealRitual, fetch `/api/stations/${stationId}/relay` after mount; local state `relay: RelayPayload | null | 'error'`; while pending render no upper-zone card
- [x] 7.6 On resolve: if `relay.count > 0` render `<RelayExcerptCard {...relay} stationId={stationId} />` above the divider and `<ScanCtaCard variant="relay" ... />` below; else render `<FirstArrivalCard />` above and `<ScanCtaCard variant="first" ... />` below; on error render no upper-zone card and default ScanCtaCard variant to `first`

## 8. Stop using SealMark in the reveal modal

- [x] 8.1 Remove `SealMark` import and JSX from `components/omikuji/RevealRitual.tsx` (done as part of 7.1)
- [x] 8.2 Keep `components/omikuji/SealMark.tsx` in the tree — still consumed by `/ticket/[token]` page. No deletion.
- [x] 8.3 Confirm only `/ticket/[token]/page.tsx` still imports `SealMark`; `RevealRitual` no longer does

## 9. Update ResultDisplay (MRT)

- [x] 9.1 Remove the inline `relayExcerpt` state, the `useEffect` that fetches `/api/stations/<id>/relay`, and the JSX block that renders the relay excerpt (all moved into RevealRitual)
- [x] 9.2 Remove the `ShareableTicket` import and usage, and the comment-CTA `<Link>` + `<Button>` block (both moved into ScanCtaCard inside RevealRitual)
- [x] 9.3 Restyle the Wiki/Maps row: replace the pill `linkPillStyle` with two Antd `Button` components (outlined, rectangular, full-width sharing via a 50/50 flex row)
- [x] 9.4 The chip row continues to render MRT line chips via `lines.find(l => l.code === code)?.color`

## 10. Update ResultDisplay (TRA)

- [x] 10.1 Same removals as 9.1 and 9.2 (relay fetch, ShareableTicket, comment CTA button)
- [x] 10.2 Restyle Wiki/Maps as two outlined rectangular Antd buttons (50/50), same pattern as MRT
- [x] 10.3 Replace the plain `{station.county}` paragraph with a single chip (inline `<span>`) filled with `var(--accent)`, matching the MRT chip shape

## 11. Wire picker containers

- [x] 11.1 `components/mrt/MrtPicker.tsx`: pass `stationId={result.id}` to `<RevealRitual>`; drop dead `commentCount` state + `modeLabel` prop
- [x] 11.2 `components/tra/TraPicker.tsx`: pass `stationId={result.station.id}` to `<RevealRitual>`; drop `modeLabel` prop

## 12. Verification

- [x] 12.1 Run `pnpm tsc --noEmit` — zero errors from files touched by this change
- [x] 12.2 Run `pnpm test` — all new + updated tests pass
- [ ] 12.3 Manual QA: MRT picker, station with prior comments → RelayExcerptCard visible, `更多 N 則 →` navigates to `/explore?station_id=<id>`
- [ ] 12.4 Manual QA: MRT picker, station with zero comments → FirstArrivalCard visible with dashed frame + 彩蛋 subtext
- [ ] 12.5 Manual QA: TRA picker equivalents of 12.3 and 12.4
- [ ] 12.6 Manual QA: on a touch device, the share button label reads `分享給你的好友` and activates native share with the PNG
- [ ] 12.7 Manual QA: at 375px viewport width, the two Wiki/Maps buttons fit side-by-side without overflow; ScanCtaCard two-column layout (QR left, text right) does not wrap awkwardly
- [ ] 12.8 Manual QA: save a screenshot on iOS, open Photos → tap the QR hint → confirms it resolves to `/comment?token=<token>` in the browser
- [ ] 12.9 Manual QA: `prefers-reduced-motion` on → ritual skips to final state, both cards appear without animation
