## Why

The result modal's footer (seal + QR + date row) and the post-result CTAs (ShareableTicket, comment button, relay excerpt block) evolved through three successive changes and now read as a stack of disconnected widgets rather than one composed ticket. The UX design (ref: user-supplied mock) consolidates post-reveal actions into two clear zones — an upper "此站有緣" result card and a lower "SCAN · 心得" continuation card — so the return-to-write intent is unmistakable and the empty-station state earns a proper first-arrival treatment.

## What Changes

- **Replace the seal + date + QR row** (lives inside `RevealRitual`) with a unified "SCAN · 心得" card: QR on the left, eyebrow + 2-line headline + description + "分享給你的好友" button + `No.xxxx · date` on the right. The `SealMark` stamp is retired. **BREAKING** for the visual language of the reveal footer (behavior unchanged).
- **Remove the standalone "搶先留下這一站的心得 →" button** from both `ResultDisplay` components. The scan card IS the write-now CTA; button removal eliminates the dual-CTA split introduced in `focus-comment-cta-and-unfinished-badge`.
- **Restyle the Wiki/Maps action pair** from pill chips to two outlined rectangular buttons (50/50 width, matching the mock).
- **Add a RelayExcerptCard** that replaces the plain relay quote block: masking-tape visual treatment, `— 旅人 #NNNN · 相對時間` footer row, and a `更多 N 則 →` link to `/explore?station_id=<id>`.
- **Add a FirstArrivalCard** shown when the picked station has zero comments: dashed-border frame, italic "此站尚無人留言，你是第一位抵達的旅人。" copy, and `FIRST TO ARRIVE · 彩蛋 ✦` subtext. The ScanCtaCard headline/description swaps to the "成為第一位留言者" variant in this state.
- **Extend `/api/stations/[id]/relay`** to return `{ excerpt, handle, postedAt, count }` so the RelayExcerptCard can render the anonymous handle (`#0417` from `comment_id` zero-padded to 4 digits), relative time, and total comment count.
- **Add a solid-dark variant to ShareableTicket's button** so the label "分享給你的好友" matches the mock's primary visual weight inside the scan card.
- **Convert the TRA county label** from plain text to a single chip in the style of the MRT line chips, using `var(--accent)` as the fill color.
- **Stop rendering `SealMark` inside `RevealRitual`** (the reveal footer no longer needs it). The component stays in the codebase because the standalone `/ticket/[token]` preview page still consumes it; deleting it is out of scope for this change.

## Capabilities

### New Capabilities

None — all changes extend existing capabilities.

### Modified Capabilities

- `omikuji-reveal`: reveal footer swaps from seal-row to the unified SCAN · 心得 card; the standalone comment-CTA button introduced in `focus-comment-cta-and-unfinished-badge` is removed; relay excerpt and first-arrival blocks gain dedicated requirements.
- `shareable-ticket`: button label becomes "分享給你的好友" with a solid-dark visual variant when rendered inside the scan card.
- `tra-station-picker`: county render becomes a chip (was plain text); result card layout mirrors the new two-zone structure.
- `station-relay`: relay API response extends to include `handle`, `postedAt`, and `count` alongside the existing `excerpt`; handle derivation is defined.

## Impact

**Components (front end):**
- Replaced/restructured: `components/omikuji/RevealRitual.tsx`, `components/ResultDisplay.tsx`, `components/tra/ResultDisplay.tsx`, `components/omikuji/ShareableTicket.tsx`.
- Added: `components/omikuji/ScanCtaCard.tsx`, `components/omikuji/RelayExcerptCard.tsx`, `components/omikuji/FirstArrivalCard.tsx`.
- Retained (no change): `components/omikuji/SealMark.tsx` — still consumed by the standalone `/ticket/[token]` page.
- `components/ScreenshotSaveBlock.tsx` size defaults bumped; consumed only by `ScanCtaCard`.

**API:**
- `app/api/stations/[id]/relay/route.ts` extends the SELECT and response shape.

**Tests:**
- New: `ScanCtaCard.test.tsx`, `RelayExcerptCard.test.tsx`, `FirstArrivalCard.test.tsx`.
- Updated: `ShareableTicket.test.tsx` (button label + variant), any snapshot tests touching `RevealRitual`.

**Not affected:**
- Pick flow, `/api/pick`, `pick_history` localStorage schema, comment submission flow, `/comment` page, `PickHistory` badge logic (shipped in the previous change).
