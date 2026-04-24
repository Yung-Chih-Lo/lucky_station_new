## Why

After user testing, three independent reviews (UX/IA, growth, behavioral psych) agreed the result modal has too many overlapping return-to-write paths. The "傳連結給自己" button (added in the previous change) duplicates "搶先留下這一站的心得 →" and frames the action in an engineer's vocabulary, while the real conversion lever — "write now at the motivation peak" — is visually demoted to a tertiary text link. Separately, the pick-history panel already greys out tickets with `comment_used = true` but provides no positive affordance on *unfinished* tickets, missing an easy Zeigarnik win for return rate.

Subsequent discussion surfaced a real gap the previous change did not fix: users who travel to the station and only return to write days later (or on a different device) have no way to recover the comment URL once they leave the site. localStorage covers same-browser same-device only. The simple fix is to put a private QR on the result page and tell users to screenshot it — phones natively recognise QRs inside saved screenshots (iOS 15+ / Android Google Lens), so a screenshot becomes a portable, cross-time, cross-device bookmark without email, accounts, or a new backend.

## What Changes

- Remove the "傳連結給自己" button and its handler/text-builder/tests from `ShareableTicket`. The QR-points-to-root change from the previous iteration stays.
- Promote the comment CTA ("搶先留下這一站的心得 →" in the no-comments state, "看他們寫了什麼 →" in the populated state) from a Next.js `Link` text style to an Antd `Button` rendered at the same size/weight as the share button, stacked directly below it. Applies to both MRT (`components/ResultDisplay.tsx`) and TRA (`components/tra/ResultDisplay.tsx`) result modals.
- Add a small private QR (pointing to `/comment?token=<token>`) plus the caption "📸 截圖保存，之後打開相簿點 QR 寫心得" below the stacked buttons on the result modal. The QR is clickable (same target). This QR is distinct from the QR embedded in the shareable ticket PNG, which still points to the site root.
- Add a positive "未寫心得" tag on active (unfinished) cards in the pick-history panel so unfinished tickets read as "todo" instead of just "hasn't happened yet". Existing `comment_used=true` greyed-out state is unchanged.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `shareable-ticket`: remove the self-reminder copy action requirement introduced in the previous change. The QR-points-to-root requirement from that change stays as-is.
- `pick-history`: existing "Explore page sidebar exposes pick history" requirement gains a scenario for the positive "未寫心得" badge on active cards.
- `tra-station-picker`: existing "Pick result modal displays the station with a reveal animation" requirement gains two scenarios: one constraining the comment CTA to be rendered as a button (not a text link), and one adding the screenshot-save QR with its caption. The same behaviour is mirrored in the MRT result modal as an implementation detail (no MRT-specific spec exists yet; documented in design).

## Impact

- `components/omikuji/ShareableTicket.tsx` — remove `handleCopyReminder`, `buildReminderText`, the `<Button type="link">`, and the wrapping column div. Revert to a single share button.
- `components/omikuji/ShareableTicket.test.tsx` — remove the two self-reminder tests; keep the three existing share tests.
- `components/ResultDisplay.tsx` — replace the `<Link style={deepLinkStyle}>` with an Antd `<Button>` at matching size; add the QR + caption block below it.
- `components/tra/ResultDisplay.tsx` — same as above.
- `components/PickHistory.tsx` — add a "未寫心得" `<span>` to the active-card branch.
- New small client-side helper for QR generation (uses existing `qrcode` dependency via its browser build) — likely co-located in the result display components or `lib/qrCode.ts` if shared.
- No changes to DB, API routes, or `/comment` page. No new npm dependencies.
