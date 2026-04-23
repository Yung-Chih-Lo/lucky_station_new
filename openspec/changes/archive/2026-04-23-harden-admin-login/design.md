## Context

`app/api/auth/login/route.ts` and `app/admin/login/page.tsx` form the entire admin entry surface. The current code works, but two specific lines on each side leak — one leaks credential material into logs, the other turns the login page into an open-redirect gadget. Both were found in a routine security review and verified by reading the files. Neither is a complex behavior change; the design here is mostly about choosing the *narrowest* fix so we do not over-engineer either area (per project rule: bug fixes don't need surrounding cleanup).

## Goals / Non-Goals

**Goals:**
- Stop emitting `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` (or any prefix/length thereof) to logs from the login route.
- Stop letting `?from=<absolute-url>` on `/admin/login` cause a navigation off-origin after a successful login.
- Add regression tests that would have caught both bugs.

**Non-Goals:**
- Adding structured logging or an audit log for login attempts (separate concern; tracked in the broader security audit notes — Medium priority, not Critical).
- Adding rate limiting to the login endpoint (also Medium; will land in a separate change).
- Constant-time username comparison or username-enumeration hardening (Medium; separate change).
- Touching the iron-session cookie config, password hashing, or middleware logic — all currently correct.

## Decisions

**1. Delete the debug logs entirely; do not replace with structured logging.**
Alternatives considered: (a) replace with a `logger.debug()` that's off in production, (b) keep but redact. Both are more code than the bug warrants, and the project has no logging library today. Audit logging is a separate, designed concern — not a side-effect of this fix. Net change: −6 lines.

**2. Validate the `from` redirect on the client (where `router.replace` is called), not in middleware.**
The middleware already constructs the `from` value from the original request URL when redirecting unauthenticated users, so it always produces a same-origin path. The vulnerability is purely that the page trusts whatever the URL says. Fixing it at the consumption point is the smallest correct fix. Putting validation in middleware would also work but spreads the contract across two files for no gain.

**3. Allowlist rule: `from` must start with `/` and not with `//`.**
- Starts with `/`  → relative path, same-origin guaranteed by the browser.
- Starts with `//` → protocol-relative URL (e.g. `//evil.com/x`), which the browser resolves to `https://evil.com/x`. This is the classic bypass for "starts with /" naïve checks; we explicitly reject it.
- Anything else (`http://...`, `https://...`, `javascript:...`, empty) → fall back to `/admin`.

We use a string-prefix check rather than `new URL(from, location.origin)` and origin comparison because the prefix check is two boolean ops, has no edge cases around `URL` parsing differences across runtimes, and matches the pattern documented by OWASP for unvalidated redirects.

**4. Tests**
- Login route test: mount the handler, post valid + invalid credentials, capture `console.log` via a spy, assert no call argument contains `ADMIN_PASSWORD_HASH`, the username, or the substring `password`.
- Login page test: render the page with `?from=https://evil.com` and `?from=//evil.com` (and one positive case `?from=/admin/stations`), trigger a successful login, assert `router.replace` was called with `/admin` for the malicious cases and `/admin/stations` for the benign one.

The project has no test runner configured today (no `test` script in `package.json`). Since this change adds the first tests, the design includes setting up a minimal `vitest` runner in `tasks.md`. If there is a strong preference for `node:test` instead, that's a one-line swap — vitest is chosen because it has zero-config TS support and a React Testing Library integration, both of which we'd need anyway for the page test.

## Risks / Trade-offs

- **[Risk]** A future engineer re-introduces a debug log on the login route → **Mitigation**: the regression test asserts the route makes no `console.log` calls during a login attempt. A new log of any kind breaks the test.
- **[Risk]** A future engineer adds a new redirect site (`router.push(externalUrl)`) elsewhere in the admin UI and re-introduces the open-redirect class of bug → **Mitigation**: not addressed here; would need a lint rule or wider audit. Out of scope for this change.
- **[Risk]** Adding vitest pulls a fairly large dev dep (~30MB) to fix two small bugs → **Mitigation**: dev-only, tree-shaken from production, and is a one-time cost. Future changes (rate limit, LIKE escape, ticket token validation) will reuse it for their regression tests.

## Migration Plan

No migration needed. Both fixes are backwards-compatible:
- Deleting the debug logs cannot break any caller.
- Tightening the redirect allowlist only affects requests where `from` was off-origin — those were never legitimate.

Rollback: standard `git revert`. No data, env, or schema changes.

## Open Questions

None blocking. One nice-to-have to discuss after merge: do we want to lift the `from` validator into a tiny `lib/safe-redirect.ts` helper now, or wait until a second call site appears? Current preference: wait — per project rule, don't build a helper for a single call site.
