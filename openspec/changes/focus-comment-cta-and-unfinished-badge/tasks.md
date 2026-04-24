## 1. Remove the self-reminder button

- [ ] 1.1 In `components/omikuji/ShareableTicket.tsx`, delete `buildReminderText`, `handleCopyReminder`, the `<Button type="link">` that rendered "傳連結給自己", and the wrapping `<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>`. Return the JSX to the original single-button shape (`<>{contextHolder}<Button ...>{buttonLabel}</Button></>`).
- [ ] 1.2 In `components/omikuji/ShareableTicket.test.tsx`, delete the "self-reminder button" describe block (two tests). Keep the three existing share tests untouched.
- [ ] 1.3 Run the test suite; confirm three tests remain and pass (`pnpm test`).

## 2. Promote the comment CTA to a button (MRT)

- [ ] 2.1 In `components/ResultDisplay.tsx`, replace the `<Link style={deepLinkStyle}>` block with an Antd `<Button>` wrapped by Next.js `<Link>` (or use `href` on a custom button). Size: `"large"`, width: `block`. Text and `href` remain driven by `commentCount > 0`. Remove the `deepLinkStyle` declaration once unused.
- [ ] 2.2 Ensure the new button sits directly below the `<ShareableTicket>` container (inside the same `marginTop: 18` wrapper or consistent spacing with share).
- [ ] 2.3 Visually verify in the browser (MRT modal) that both states render correctly: no-comments state → "搶先留下這一站的心得 →" button → `/comment?token=...`; has-comments state → "已有 N 位旅人抽到這站 · 看他們寫了什麼 →" button → `/explore?station_id=...`.

## 3. Promote the comment CTA to a button (TRA)

- [ ] 3.1 In `components/tra/ResultDisplay.tsx`, mirror the MRT change: replace the `<Link style={deepLinkStyle}>` with an Antd `<Button>` at `size="large" block`, preserving the conditional text and target. Remove the now-unused `deepLinkStyle` style object.
- [ ] 3.2 Visually verify in the browser (TRA tab → pick → modal) that both states render correctly.

## 4. Add "未寫心得" badge on active pick-history cards

- [ ] 4.1 In `components/PickHistory.tsx`, inside the active-card branch (the `<Link>` card), add a `<span>` positioned in the same slot currently used by the "已留言" badge on used cards — i.e. within `cardRow`, right-aligned — reading "未寫心得".
- [ ] 4.2 Give the new badge a style similar to `badgeUsed` but with the accent color treatment (subtle, not a pulse/red-dot notification). Keep the existing forward arrow `→` below or alongside the badge, whichever preserves card balance.
- [ ] 4.3 Verify the three card states render correctly:
  - Unknown `commentUsed` (API pending): treat as active → show "未寫心得" badge (consistent with the fallback in the spec scenario)
  - `commentUsed === false`: active card with badge
  - `commentUsed === true`: greyed card with "已留言" badge (unchanged)

## 5. Tests & cleanup

- [ ] 5.1 Run `pnpm test` — suite must be green with three ShareableTicket tests (the two self-reminder tests are gone).
- [ ] 5.2 Run `pnpm lint` (or project equivalent); fix any unused-import or unused-style-object warnings surfaced by the CTA refactor.
- [ ] 5.3 Verify `package.json` has no new dependencies.

## 6. Manual QA

- [ ] 6.1 MRT: abuse the picker → result modal shows share button + comment button (stacked, same size); no "傳連結給自己" visible.
- [ ] 6.2 TRA: same manual walkthrough.
- [ ] 6.3 Homepage `PickHistory`: at least one active card shows "未寫心得" badge; at least one used card still shows "已留言" badge (seed a local state by submitting one review).
- [ ] 6.4 Narrow viewport (iOS Safari 375px): buttons stack cleanly, no overflow, no thumb-reach regression.
