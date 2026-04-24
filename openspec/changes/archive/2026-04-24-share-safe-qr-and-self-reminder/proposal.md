## Why

The shareable ticket PNG embeds a QR code that points to the owner-only comment endpoint (`/comment?token=...`). When a user shares the ticket to Line/Instagram/Notion, anyone who scans the QR can submit a review as the original picker. More importantly, users routinely forget to come back and write their 心得 after visiting the station — the real product risk is low return rate, not review theft. Both issues need the same two small changes.

## What Changes

- Share-image QR now encodes the site root (`{origin}/`) instead of the comment endpoint. Scanning a shared ticket sends viewers to the app's landing page to draw their own station; it no longer grants write access to the owner's review.
- Result page gains a secondary "傳連結給自己" button below the share action. It copies `去「{stationNameZh}」寫心得 → {origin}/comment?token={token}` to the clipboard so the owner can paste the self-reminder into Line/Notes/etc. and return later via that link.
- Existing review submission, `comment_used` locking, and share-image layout are unchanged. The owner still reaches `/comment?token=...` — just via a pasted link rather than a scanned QR.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `shareable-ticket`: QR target changes from the private comment URL to the site root; result modal adds a secondary copy-self-reminder action with specified clipboard text and toast.

## Impact

- `app/api/ticket/[token]/route.tsx` — `qrTarget` computation.
- `components/omikuji/ShareableTicket.tsx` — new secondary button + clipboard text handler + toast.
- `components/omikuji/ShareableTicket.test.tsx` — new regression test for the self-reminder copy; existing share tests stay green.
- No DB, schema, or `/comment` page changes. No new dependencies.
