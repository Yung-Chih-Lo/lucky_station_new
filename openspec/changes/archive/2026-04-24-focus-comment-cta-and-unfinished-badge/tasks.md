## 1. Remove the self-reminder button

- [x] 1.1 In `components/omikuji/ShareableTicket.tsx`, delete `buildReminderText`, `handleCopyReminder`, the `<Button type="link">` that rendered "傳連結給自己", and the wrapping `<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>`. Return the JSX to the original single-button shape (`<>{contextHolder}<Button ...>{buttonLabel}</Button></>`).
- [x] 1.2 In `components/omikuji/ShareableTicket.test.tsx`, delete the "self-reminder button" describe block (two tests). Keep the three existing share tests untouched.
- [x] 1.3 Run the test suite; confirm three tests remain and pass (`pnpm test`).

## 2. Promote the comment CTA to a button (MRT)

- [x] 2.1 In `components/ResultDisplay.tsx`, replace the `<Link style={deepLinkStyle}>` block with an Antd `<Button>` that navigates to the same href. Size: `"large"`, width: `block`. Text and `href` remain driven by `commentCount > 0`. The preferred pattern is `<Link href={...} legacyBehavior passHref><Button ... /></Link>` or using `router.push` inside `onClick`. Remove the `deepLinkStyle` declaration once unused.
- [x] 2.2 Ensure the new button sits directly below the `<ShareableTicket>` container with consistent spacing (match the existing `marginTop: 18` rhythm).
- [ ] 2.3 Visually verify in the browser (MRT modal) that both states render correctly: no-comments state → "搶先留下這一站的心得 →" button → `/comment?token=...`; has-comments state → "已有 N 位旅人抽到這站 · 看他們寫了什麼 →" button → `/explore?station_id=...`.

## 3. Promote the comment CTA to a button (TRA)

- [x] 3.1 In `components/tra/ResultDisplay.tsx`, mirror the MRT change: replace the `<Link style={deepLinkStyle}>` with an Antd `<Button>` at `size="large" block`, preserving the conditional text and target. Remove the now-unused `deepLinkStyle` style object.
- [ ] 3.2 Visually verify in the browser (TRA tab → pick → modal) that both states render correctly.

## 4. Add the screenshot-save QR block (MRT + TRA)

- [x] 4.1 Extract a minimal `<ScreenshotSaveBlock token size>` component that renders a static QR `<img>` only (no link wrapper, no caption, no box). QR generated client-side via `QRCode.toDataURL(\`${origin}/comment?token=${encodeURIComponent(token)}\`)` inside a `useEffect`.
- [x] 4.2 In `components/omikuji/RevealRitual.tsx`, add an optional `token` prop. When provided, render a caption paragraph "📸 截圖保存，之後打開相簿掃 QR Code 就可以寫心得嘍！" above the seal row, then a `↓` arrow on its own line aligned to point down toward the QR, then integrate the QR into the seal row as its leftmost element (adjacent to `<SealMark>` and the date).
- [x] 4.3 Switch the seal row's `justifyContent` from `center` to `space-between` so QR / seal / date distribute cleanly.
- [x] 4.4 Pass `token` from `MrtPicker` and `TraPicker` to `<RevealRitual>`.
- [x] 4.5 Remove the standalone `<ScreenshotSaveBlock>` usage from `components/ResultDisplay.tsx` and `components/tra/ResultDisplay.tsx` (it is now rendered inside RevealRitual).
- [ ] 4.6 Visually verify: QR renders sharp at 80×80, caption wraps correctly on 375px viewport, the arrow visually "points" to the QR, QR is not tappable (no cursor change, no navigation on click), seal row layout balances with QR on the left.

## 5. Add "未寫心得" badge on active pick-history cards

- [x] 5.1 In `components/PickHistory.tsx`, inside the active-card branch (the `<Link>` card), add a `<span>` positioned in the same slot currently used by the "已留言" badge on used cards — i.e. within `cardRow`, right-aligned — reading "未寫心得".
- [x] 5.2 Give the new badge a style similar to `badgeUsed` but with the accent color treatment (subtle, not a pulse/red-dot notification). Keep the existing forward arrow `→` below or alongside the badge, whichever preserves card balance.
- [ ] 5.3 Verify the three card states render correctly:
  - Unknown `commentUsed` (API pending): treat as active → show "未寫心得" badge (consistent with the spec scenario)
  - `commentUsed === false`: active card with badge
  - `commentUsed === true`: greyed card with "已留言" badge (unchanged)

## 6. Tests & cleanup

- [x] 6.1 Run `pnpm test` — suite must be green with three ShareableTicket tests (the two self-reminder tests are gone).
- [ ] 6.2 Run `pnpm lint` (or project equivalent); fix any unused-import or unused-style-object warnings surfaced by the CTA refactor.
- [x] 6.3 Verify `package.json` has no new dependencies.

## 7. Manual QA

- [ ] 7.1 MRT: pick → result modal shows share button + comment button (stacked, same size) + QR block; no "傳連結給自己" visible.
- [ ] 7.2 TRA: same manual walkthrough.
- [ ] 7.3 Screenshot workflow: take a screenshot of the modal on iOS (or equivalent), open Photos, confirm the OS offers a link preview on the embedded QR and tapping it opens `/comment?token=...`.
- [ ] 7.4 Tap the QR block directly on the live page: confirm it navigates to `/comment?token=...` without a new tab (or matching existing behaviour).
- [ ] 7.5 Homepage `PickHistory`: at least one active card shows "未寫心得" badge; at least one used card still shows "已留言" badge (seed a local state by submitting one review).
- [ ] 7.6 Narrow viewport (iOS Safari 375px): buttons stack cleanly, QR block fits without overflow, no thumb-reach regression.
