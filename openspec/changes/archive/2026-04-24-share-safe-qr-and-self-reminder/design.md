## Context

The ticket PNG is generated in `app/api/ticket/[token]/route.tsx` via `@vercel/og`. A QR code is rendered server-side with the `qrcode` package at line 62 using `${baseUrl}/comment?token=${pick.token}` as the target. The result modal's share UI lives in `components/omikuji/ShareableTicket.tsx` and already distinguishes touch vs. desktop paths.

The app is anonymous (no accounts, no email). The only owner-recovery mechanism today is `localStorage` `pick_history` (last 3 picks, same-browser only). A prior exploration established that enforcing cross-device ownership would require email/magic-link/short-code — all judged too costly for a hobby project and contrary to the anonymous design.

## Goals / Non-Goals

**Goals:**
- Remove the review-theft attack vector by making the QR in shared images non-privileged.
- Give owners a low-friction way to "save for later" across contexts they already use (Line-to-self is the common Taiwan pattern), without introducing accounts or notifications.
- Ship with the minimum viable surface area — one route change, one new button, one new test.

**Non-Goals:**
- Cross-device/browser recovery for the same user (explicit Tier 3 item; not in this change).
- Calendar `.ics` export, caption templates, watermark, Zeigarnik visual cues (Tier 2; evaluated later after shipping).
- Any modification to `/comment` page, `comment_used` locking, or DB schema.
- Replacing or removing the existing share button. This change is purely additive on the UI side.

## Decisions

**QR target is the site root (`${baseUrl}/`), not an explore page or public ticket page.**
The app has no public per-pick viewer yet, and the home page already lets scanners draw their own station — which is the desired funnel for friends who see a shared image. Building a `/s/:shareId` public ticket view is a larger Tier 2 social-growth experiment and is not this change. Alternatives considered: `/explore` (less aligned with the "scanned ticket → try it yourself" reflex) and dropping the QR entirely (loses the only way QR-scannable-from-paper contexts reach the app).

**Self-reminder is plain-text clipboard, not a QR code, not a share sheet.**
The owner is already on the device with the session; adding another QR on the result page (as an earlier sketch suggested) duplicates the affordance and muddles "which QR is which". Clipboard text is universal — it pastes into Line, Notes, Notion, Calendar descriptions, anywhere. Using `navigator.share` for this would collide with the existing share button semantically ("share to friend" vs "save for self") and would hand the owner's private URL to an OS share sheet that may route through "Copy" with multi-flavor NSPasteboard behavior — the very bug we fixed in the previous change.

**Clipboard payload format: `去「{stationNameZh}」寫心得 → {url}`.**
Plain URL without context has no recall value when the user reviews their Line messages days later. Embedding the station name in the sentence turns it into a self-explanatory reminder. The arrow `→` is a visual cue that the URL follows; it works in Line/Notes/Notion without markdown dependency. No emoji (consistent with the rest of the product copy).

**Button styling: secondary text-link / ghost, positioned below the primary share button.**
The share action remains the primary CTA (growth lever). The self-reminder is a personal utility and should read as secondary — same visual hierarchy as "之後再看" or "略過" would have. Placing it below (not right-of) the share button keeps the layout one-column on narrow viewports and signals "this is a different kind of action".

**Toast copy: "已複製，貼到 Line 給自己就不會忘".**
The toast explicitly suggests the dominant use case (Line-to-self) to reduce the "copied… now what?" gap that happens when users don't know why they'd want this. Short enough for Antd's default toast width.

## Risks / Trade-offs

- **QR on shared image now has lower engagement** → Mitigation: accepted. The primary share surface (Line/IG paste) drives traffic via the image itself being scroll-stopping; the QR was always a weak CTA in digital contexts. If measurable drop-off shows up, revisit with a dedicated public-ticket landing in a follow-up change.
- **Users who expected the QR to bring them back will lose that path** → Mitigation: the self-reminder button replaces it with a more reliable channel (their own messages). Existing `localStorage` `pick_history` remains as the fallback entry point on the homepage.
- **Clipboard text includes the token, which is the same secret as before** → Mitigation: the token was already in the URL path the owner was meant to use; exposing it to the owner's own clipboard does not change the threat model. The change is that it's no longer *also* baked into a shareable image.
- **`navigator.clipboard.writeText` unavailable in some old browsers** → Mitigation: catch and fall back to a visible input the user can long-press to copy (same pattern already used elsewhere in the app for copy flows).

## Migration Plan

Deploy is a single commit touching the route handler and the component. No data migration, no feature flag. Rollback is a git revert — the new button is purely additive, and the QR target change is a one-line swap.

## Open Questions

None. All UI decisions were confirmed by the product owner before writing this doc.
