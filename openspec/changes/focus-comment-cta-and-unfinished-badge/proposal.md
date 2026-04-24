## Why

After user testing, three independent reviews (UX/IA, growth, behavioral psych) agreed the result modal has too many overlapping return-to-write paths. The "傳連結給自己" button (added in the previous change) duplicates "搶先留下這一站的心得 →" and frames the action in an engineer's vocabulary, while the real conversion lever — "write now at the motivation peak" — is visually demoted to a tertiary text link. Separately, the pick-history panel already greys out tickets with `comment_used = true` but provides no positive affordance on *unfinished* tickets, missing an easy Zeigarnik win for return rate.

## What Changes

- Remove the "傳連結給自己" button and its handler/text-builder/tests from `ShareableTicket`. The QR-points-to-root change from the previous iteration stays.
- Promote the comment CTA ("搶先留下這一站的心得 →" in the no-comments state, "看他們寫了什麼 →" in the populated state) from a Next.js `Link` text style to an Antd `Button` rendered at the same size/weight as the share button, stacked directly below it. Applies to both MRT (`components/ResultDisplay.tsx`) and TRA (`components/tra/ResultDisplay.tsx`) result modals.
- Add a positive "未寫心得" tag on active (unfinished) cards in the pick-history panel so unfinished tickets read as "todo" instead of just "hasn't happened yet". Existing `comment_used=true` greyed-out state is unchanged.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `shareable-ticket`: remove the self-reminder copy action requirement introduced in the previous change. The QR-points-to-root requirement from that change stays as-is.
- `pick-history`: existing "Explore page sidebar exposes pick history" requirement gains a scenario for the positive "未寫心得" badge on active cards.
- `tra-station-picker`: existing "Pick result modal displays the station with a reveal animation" requirement gains a scenario constraining the comment CTA to be rendered as a button (not a text link), and makes explicit that the populated-state variant (viewing others' comments) uses the same button treatment.

## Impact

- `components/omikuji/ShareableTicket.tsx` — remove `handleCopyReminder`, `buildReminderText`, the `<Button type="link">`, and the wrapping column div. Revert to a single share button.
- `components/omikuji/ShareableTicket.test.tsx` — remove the two self-reminder tests; keep the three existing share tests.
- `components/ResultDisplay.tsx` — replace the `<Link style={deepLinkStyle}>` with an Antd `<Button>` at matching size.
- `components/tra/ResultDisplay.tsx` — same as above.
- `components/PickHistory.tsx` — add a "未寫心得" `<span>` to the active-card branch.
- No changes to DB, API routes, or `/comment` page. No new dependencies.
