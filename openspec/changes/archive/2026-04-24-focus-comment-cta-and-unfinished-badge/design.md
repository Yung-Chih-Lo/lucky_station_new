## Context

The previous change (`share-safe-qr-and-self-reminder`) added a "傳連結給自己" secondary button on the assumption that users wanted to bookmark the comment URL to Line/Notes. Three independent reviews (UX, growth, behavioral psych) argued this was an engineer-framed action that competed with the existing "搶先留下這一站的心得 →" text link. Both paths aim at the same outcome (user returns to write a review); the right move is to drop the copy-link action and promote the write-now action instead.

Follow-up discussion exposed a gap neither the previous change nor the first pass of this change addressed: the app's core loop is "draw station → travel → come back days later and write". Same-device same-browser return is covered by `pick_history` in localStorage. Cross-device or cross-time return (e.g. drew on desktop, rode the train on phone, wrote review a week later) had no mechanism at all. Email was rejected, calendar .ics was rejected. The remaining unasked option — screenshot the result page — leverages a universal user behaviour that costs us almost nothing: every phone already has a screenshot gesture; iOS 15+ Photos and Android Google Lens natively recognise QR codes inside saved images, so a screenshot with an embedded QR is effectively a no-account "save for later" bookmark that survives time, devices (via AirDrop / chat), and even full browser state loss.

The pick-history panel already uses server data (`/api/comments/<token>`) to know `comment_used` and greys out used cards with a "已留言" badge. Active cards only carry a forward arrow — there is no positive cue that reads as "未完成 todo". Adding a small "未寫心得" tag mirrors the existing "已留言" treatment and gives Zeigarnik a foothold at zero cost.

## Goals / Non-Goals

**Goals:**
- Fewer buttons, clearer hierarchy in the result modal. One share action (primary) + one comment action (secondary), both rendered as Antd buttons of the same size class.
- Give unfinished pick-history cards a visible "you haven't written this yet" marker.
- Cover the cross-time / cross-device return case by rendering a private QR on the result page and nudging users to screenshot it.
- Revert cleanly: the change should read as a pure subtraction on the shareable ticket side and pure addition on the result page + pick-history side.

**Non-Goals:**
- Email / Resend integration (explicitly rejected by all three reviews).
- Web Push notifications (Tier 3, revisit when DAU justifies it).
- Calendar .ics export (rejected by product owner in the same discussion).
- Reducing the 維基/Maps buttons to chips or icons — cosmetic, not the bottleneck.
- Introducing a new localStorage key for "commented tokens" — the server check via `/api/comments/<token>` already works and is the source of truth.
- Any spec for the MRT result modal's post-reveal CTA layout beyond what this change needs. The spec gap (MRT has no capability constraining CTA style) is noted but not closed here.
- Printing the comment URL in plain text under the QR as a fallback — product owner opted for a clean layout over extreme-edge-case accessibility.

## Decisions

**Revert the self-reminder button as code subtraction, not a deprecation shim.**
The button shipped days ago, the change has not been archived to main specs yet, and no user workflow depends on the clipboard text format. Removing the handler, the button, the wrapping div, and the two tests is cleaner than leaving a hidden feature flag. Alternatives considered: feature-flag for opt-in, keep it in a "more actions" overflow. Both add surface area for a feature three reviews wanted gone.

**Promote the comment CTA to an Antd `<Button>` of the same size as the share button, stacked directly below.**
The share button uses `size="large" block` inside `<ShareableTicket>`. The comment CTA should match — same height, full width, directly below. This reads as "two primary actions stacked", which matches the two genuine user intents at the motivation peak: share the story, write the story. Alternatives considered:
- Button group side-by-side: bad on narrow viewports, hurts thumb ergonomics.
- Make the share button secondary and the comment button primary: might drive more write-rate but kills the growth loop. Keeping share as the visually dominant action preserves social discovery; promoting comment to a same-class secondary gives it real weight without displacing share.
- Merge both into a single split button: too clever; UX reviewer flagged this pattern as unintuitive in Taiwan market.

**The comment CTA preserves the existing conditional text and target.**
Current logic: when `commentCount > 0`, text is "已有 N 位旅人抽到這站 · 看他們寫了什麼 →" and target is `/explore?station_id=...`; when `commentCount === 0`, text is "搶先留下這一站的心得 →" and target is `/comment?token=...`. Both variants use the same button slot with the same style. This avoids fighting the existing content logic and keeps the "first writer" framing intact.

**Screenshot-QR is integrated into the existing seal footer row, not a standalone block.**
A first pass placed the QR + caption in a bordered card below both CTA buttons. After visual review, the card felt like a third competing element. Final layout integrates the QR into the row that already carries the `<SealMark>` and pick date (rendered by `<RevealRitual>` as the ritual's footer chrome). The QR sits on the left of that row; the seal stays in the middle; the date on the right. Above that row, a single-line caption "📸 截圖保存，之後打開相簿掃 QR Code 就可以寫心得嘍！" and a standalone `↓` arrow communicate intent. Benefits:
- No extra bordered card → the result modal reads as one continuous vertical flow.
- The seal row was already a "meta" zone (籤號, date) — adding a third meta element (QR) fits the same semantic.
- The caption + arrow are visually co-located with the thing they refer to without needing a containing box.
Alternatives considered:
- Keep standalone card with border: feels like a third CTA, competes with buttons.
- QR inside `<ScreenshotSaveBlock>` as a clickable link wrapping QR+caption: dropped; the comment button above already provides the "tap to write now" affordance, making the QR tappability redundant.

**Screenshot QR encodes the private comment URL (`/comment?token=<token>`), distinct from the shareable PNG's QR.**
The shareable ticket PNG (served by `/api/ticket/[token]`) has its QR pointing to the site root — that PNG leaves the owner's session into public contexts. The result-page QR, by contrast, only exists inside the owner's live session and only ends up elsewhere if the owner screenshots and transports it deliberately. Since the owner transports it to themselves, embedding the private token is safe and is the whole point. Two different QRs with two different targets serve two different audiences. This is **not** the "dual QR on ticket" pattern rejected earlier — those two QRs would have lived on the same shareable artifact, with all the confusion that implies. Here, one QR is on the live result page (owner-only), the other is on the shareable PNG (anyone-facing).

**QR is a static image, not a tappable link.**
An earlier version of this change made the QR tappable so same-device users could skip the screenshot step. Review rejected this: the "搶先留下這一站的心得 →" button directly above the seal row already provides the same affordance — tap and jump to the comment page. Making the QR tappable duplicated that action and muddled the QR's semantic role ("this is the thing you screenshot"). The QR now renders as a static `<img>` only; the only intended activation path is the phone's native QR recognition after the user saves a screenshot.

**QR generation runs client-side using the existing `qrcode` dependency.**
The package already ships in the bundle for server-side ticket rendering; its browser build is ~15KB gzipped and exposes the same `toDataURL` / `toString` surface. Alternatives considered: `qrcode.react` (new dep, no benefit), server-side generation via new `/api/qr/<token>` endpoint (adds a round-trip for every result modal mount, zero benefit over running in the browser). Client-side `QRCode.toDataURL(url)` inside a `useEffect` once per pick, stored in component state, rendered as `<img>`.

**The "未寫心得" tag mirrors the "已留言" tag: small, pill-shaped, right-aligned.**
Placing it in the same slot on the card keeps visual symmetry with the used-card treatment. Color should read as "active / pending" — the existing `--accent` (gold) for the arrow already occupies that role, so the tag can reuse the accent color at low opacity, or stay muted with ink-weight matching the existing badge. Going loud (red dot, pulse animation) is tempting for Zeigarnik but risks looking like a notification spam; subtle works better for an anonymous app where the user controls the page.

**MRT result modal mirrors TRA's QR + button treatment without adding a new capability.**
`tra-station-picker` has an existing spec requirement about the result modal, which this change extends with the button and QR scenarios. The MRT result modal (`components/ResultDisplay.tsx`) doesn't live under a capability that constrains its post-reveal layout today. Rather than invent a new capability or stretch `omikuji-reveal` (which is about the ritual, not post-reveal content) to cover it, the MRT code change is driven by the design doc's symmetry requirement, not a spec. A follow-up change can add an `mrt-result-modal` spec if needed; not this change's job.

## Risks / Trade-offs

- **Users don't know iOS/Android auto-scans QR inside screenshots** → Mitigation: the caption text explicitly explains the mechanism ("之後打開相簿點 QR 寫心得"). For users whose phones don't support in-photo QR scanning, the same QR is also tappable on the live page — they can still use it before leaving.
- **Users who had started relying on the self-reminder button (days in the wild) lose the feature.** → Mitigation: usage was likely near zero given the feedback that prompted this change; the screenshot-QR, the promoted comment CTA, and the pick-history badge provide parallel "come back later" paths with less friction and more reach.
- **Two same-size buttons stacked plus a QR block may feel heavy on small viewports.** → Mitigation: the QR block is deliberately smaller (~90px tall including caption) and sits below the buttons; total modal height still fits iOS Safari 375×667 without scroll on standard content. Visual QA during implementation.
- **The pick-history badge adds character density to already small cards.** → Mitigation: tag is placed in the existing right-side slot where "已留言" already lives, no layout reflow.
- **Spec gap for MRT result modal is not closed.** → Mitigation: explicitly called out in the proposal's Capabilities section and design Non-Goals; implementation is symmetric with TRA so a future capability definition can be lifted from either file.

## Migration Plan

Single commit touching four components + one test file. No data migration, no feature flag, no deployment sequencing concerns. Rollback is `git revert` — all changes are UI-only.

## Open Questions

None. All three reviews converged on the subtraction direction; the screenshot-QR addition was proposed and confirmed by the product owner during design.
