## Context

The previous change (`share-safe-qr-and-self-reminder`) added a "傳連結給自己" secondary button on the assumption that users wanted to bookmark the comment URL to Line/Notes. Three independent reviews (UX, growth, behavioral psych) argued this was an engineer-framed action that competed with the existing "搶先留下這一站的心得 →" text link. Both paths aim at the same outcome (user returns to write a review); the right move is to drop the copy-link action and promote the write-now action instead.

The pick-history panel already uses server data (`/api/comments/<token>`) to know `comment_used` and greys out used cards with a "已留言" badge. Active cards only carry a forward arrow — there is no positive cue that reads as "未完成 todo". Adding a small "未寫心得" tag mirrors the existing "已留言" treatment and gives Zeigarnik a foothold at zero cost.

## Goals / Non-Goals

**Goals:**
- Fewer buttons, clearer hierarchy in the result modal. One share action (primary) + one comment action (secondary), both rendered as Antd buttons of the same size class.
- Give unfinished pick-history cards a visible "you haven't written this yet" marker.
- Revert cleanly: the change should read as a pure subtraction on the shareable ticket side and pure addition on the pick-history side.

**Non-Goals:**
- Email / Resend integration (explicitly rejected by all three reviews).
- Web Push notifications (Tier 3, revisit when DAU justifies it).
- Reducing the 維基/Maps buttons to chips or icons — cosmetic, not the bottleneck, and risks destabilising an already-shipping layout.
- Introducing a new localStorage key for "commented tokens" — the server check via `/api/comments/<token>` already works and is the source of truth.
- Any spec for the MRT result modal's post-reveal CTA layout beyond what this change needs. The spec gap (MRT has no `omikuji-reveal` scenario constraining CTA style) is noted but not closed here.

## Decisions

**Revert the self-reminder button as code subtraction, not a deprecation shim.**
The button shipped days ago, the change has not been archived to main specs yet, and no user workflow depends on the clipboard text format. Removing the handler, the button, the wrapping div, and the two tests is cleaner than leaving a hidden feature flag. Alternatives considered: feature-flag for opt-in, keep it in a "more actions" overflow. Both add surface area for a feature three reviews wanted gone.

**Promote the comment CTA to an Antd `<Button>` of the same size as the share button, stacked directly below.**
The share button uses `size="large" block` inside `<ShareableTicket>`. The comment CTA should match — same height, full width, directly below. This reads as "two primary actions stacked", which matches the two genuine user intents at the motivation peak: share the story, write the story. Alternatives considered:
- Button group side-by-side: bad on narrow viewports, hurts thumb ergonomics.
- Make the share button secondary and the comment button primary: might drive more write-rate but kills the growth loop. Keeping share as the visually dominant action preserves social discovery; promoting comment to a same-class secondary gives it real weight without displacing share.
- Merge both into a single split button: too clever, UX reviewer flagged this pattern as unintuitive in Taiwan market.

**The comment CTA preserves the existing conditional text and target.**
Current logic: when `commentCount > 0`, text is "已有 N 位旅人抽到這站 · 看他們寫了什麼 →" and target is `/explore?station_id=...`; when `commentCount === 0`, text is "搶先留下這一站的心得 →" and target is `/comment?token=...`. Both variants use the same button slot with the same style. This avoids fighting the existing content logic and keeps the "first writer" framing intact.

**The "未寫心得" tag mirrors the "已留言" tag: small, pill-shaped, right-aligned.**
Placing it in the same slot on the card keeps visual symmetry with the used-card treatment. Color should read as "active / pending" — the existing `--accent` (gold) for the arrow already occupies that role, so the tag can reuse the accent color at low opacity, or stay muted with ink-weight matching the existing badge. Going loud (red dot, pulse animation) is tempting for Zeigarnik but risks looking like a notification spam; subtle works better for an anonymous app where the user controls the page.

**MRT result modal mirrors TRA's button treatment without adding a new capability.**
`tra-station-picker` has an existing spec requirement about the result modal, which this change extends with the button scenario. The MRT result modal (`components/ResultDisplay.tsx`) doesn't live under a capability that constrains its CTA style today. Rather than invent a new capability or stretch `omikuji-reveal` (which is about the ritual, not post-reveal layout) to cover it, the MRT code change is driven by the design doc's symmetry requirement, not a spec. A follow-up change can add an `mrt-result-modal` spec if needed; not this change's job.

## Risks / Trade-offs

- **Users who had started relying on the self-reminder button (5 days in the wild) lose the feature.** → Mitigation: usage was likely near zero given the feedback that prompted this change; the promoted comment CTA and pick-history badge provide the same "come back later" path with less friction.
- **Two same-size buttons stacked may feel heavy on small viewports.** → Mitigation: both are already full-width block buttons; vertical stacking is standard on mobile. Visual QA on iOS Safari viewport 375px during implementation.
- **The pick-history badge adds character density to already small cards.** → Mitigation: tag is placed in the existing right-side slot where "已留言" already lives, no layout reflow.
- **Spec gap for MRT result modal CTA is not closed.** → Mitigation: explicitly called out in the proposal's Capabilities section and design Non-Goals; implementation is symmetric with TRA so a future capability definition can be lifted from either file.

## Migration Plan

Single commit touching four components + one test file. No data migration, no feature flag, no deployment sequencing concerns. Rollback is `git revert` — all changes are UI-only.

## Open Questions

None. All three reviews converged on the same direction and the user explicitly chose to bundle them.
