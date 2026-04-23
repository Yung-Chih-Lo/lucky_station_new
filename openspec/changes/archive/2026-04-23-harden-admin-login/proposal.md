## Why

Two critical security gaps in the admin login flow surfaced during a multi-agent security review:

1. `app/api/auth/login/route.ts` contains five `console.log` statements left over from debugging that emit the configured `ADMIN_USERNAME`, the length of `ADMIN_PASSWORD_HASH`, and its first 20 characters to server logs on every login attempt. Anyone with log access — log aggregator users, ops staff, accidental log exports — gets enough material to fingerprint or attack the single admin credential.
2. `app/admin/login/page.tsx` reads `?from=` from the URL and passes it directly to `router.replace(from)` after a successful login. An attacker can craft `https://<site>/admin/login?from=https://evil.com` and use a real admin credential to redirect a logged-in admin to a phishing page that mimics our admin UI.

Both are low-effort fixes. The debug logs were already marked `// TEMP DEBUG` and forgotten; the redirect was never validated against an allowlist.

## What Changes

- Remove all `console.log('[login debug] ...')` statements from the login route handler. No replacement logging — the route stays silent on success and returns the same generic 401 on failure as today.
- Validate the `from` query parameter on the admin login page before passing it to `router.replace`. Only accept paths that begin with a single `/` (and are not protocol-relative `//...`). Fall back to `/admin` for anything else.
- Add regression tests for both fixes (per the project's testing rules: every bug fix ships with a test that would have caught it).

No new dependencies. No env-var changes. No DB changes. No user-visible behavior change for legitimate flows.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `admin-auth`: Add two new requirements that constrain (a) what the login endpoint may emit to logs and (b) what destinations the post-login redirect on `/admin/login` may navigate to. Both tighten existing behavior without breaking any documented contract.

## Impact

- **Code touched**: `app/api/auth/login/route.ts` (delete 6 `console.log` lines), `app/admin/login/page.tsx` (add validation around the `from` param).
- **Tests added**: regression test for the login route asserting no credential material is logged; regression test for the login page asserting that `from=https://evil.com` and `from=//evil.com` both redirect to `/admin` instead of the attacker URL.
- **Specs updated**: `openspec/specs/admin-auth/spec.md` gains two requirements (log hygiene, post-login redirect safety).
- **APIs / dependencies**: unchanged.
- **Risk**: very low. No behavior change for legitimate admins (who land at `/admin` or a relative `from` path); only same-origin paths beginning with `/` continue to work.
