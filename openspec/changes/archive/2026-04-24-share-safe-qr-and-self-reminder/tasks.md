## 1. QR target change

- [x] 1.1 In `app/api/ticket/[token]/route.tsx`, change `qrTarget` from `${baseUrl}/comment?token=${encodeURIComponent(pick.token)}` to `${baseUrl}/`
- [ ] 1.2 Manually verify: generate a ticket locally, scan the QR with a phone, confirm it opens the app landing page and contains no token

## 2. Self-reminder button UI

- [x] 2.1 In `components/omikuji/ShareableTicket.tsx`, add a `handleCopyReminder` handler that builds the text `去「${stationNameZh}」寫心得 → ${origin}/comment?token=${token}` using `window.location.origin` and calls `navigator.clipboard.writeText`
- [x] 2.2 Render a secondary Antd button (`type="link"` or `type="text"`) below the existing share button with label "傳連結給自己"
- [x] 2.3 On success, show a toast via the existing `messageApi` with copy "已複製，貼到 Line 給自己就不會忘"
- [x] 2.4 On `navigator.clipboard.writeText` unavailability or non-`AbortError` failure, fall back to showing the reminder text in a selectable form (Antd `message.info` with the text, or a toast instructing the user to copy manually); do not swallow the error silently
- [x] 2.5 Ensure the new button is keyboard-focusable and visually subordinate to the share button (not the same size/prominence)

## 3. Tests

- [x] 3.1 In `components/omikuji/ShareableTicket.test.tsx`, add a test: render the component, click the self-reminder button, assert `navigator.clipboard.writeText` is called exactly once with a string containing both `去「<stationName>」寫心得` and `/comment?token=<token>`
- [x] 3.2 Add a test: when `navigator.clipboard.writeText` rejects, assert that a user-visible message is shown (via mocked `messageApi`) and no unhandled promise rejection escapes
- [x] 3.3 Confirm existing share tests (desktop single-flavor write, mobile navigator.share, desktop fallback) still pass unchanged
- [x] 3.4 Run `pnpm test` (or the project's test command) and ensure the full suite is green

## 4. Manual QA

- [ ] 4.1 Desktop Chrome: click self-reminder button, paste into Line Desktop and Notion, verify the reminder text appears exactly once with correct station name and URL
- [ ] 4.2 Mobile Safari: tap self-reminder button, paste into Line mobile, verify the reminder text is correct
- [ ] 4.3 Scan the shared ticket QR with a phone camera, confirm it opens the landing page (not the comment page)
- [ ] 4.4 Confirm the existing share button behavior is unchanged on both desktop and mobile

## 5. Docs / cleanup

- [x] 5.1 Verify no references to the old QR target remain in comments, copy, or docs
- [x] 5.2 Confirm there are no new dependencies added to `package.json`
