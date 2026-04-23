## 1. Test infrastructure

- [x] 1.1 Add `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` to `devDependencies` (also added `@vitejs/plugin-react` + `@testing-library/user-event`, both needed for React+Next JSX testing)
- [x] 1.2 Add `vitest.config.ts` at repo root configured for `jsdom` environment, path alias `@/*` matching `tsconfig.json`, and a `setup-tests.ts` that registers `@testing-library/jest-dom`
- [x] 1.3 Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
- [x] 1.4 Verify the runner boots: run `npm test` — config loads, glob `**/*.{test,spec}.{ts,tsx}` resolves, 0 tests found (vitest 4 exits 1 on empty suite, becomes moot once tests exist)

## 2. Fix #1 — Login route credential leak

- [x] 2.1 Delete the five `console.log('[login debug] ...')` statements at `app/api/auth/login/route.ts:24-29` and the one at line 32 (`verifyAdminCredentials result`) — 6 lines removed
- [x] 2.2 Confirm by re-reading the file that no `console.*` call remains in the handler — `grep "console\." app/api/auth/login/route.ts` returns nothing
- [x] 2.3 Add `app/api/auth/login/route.test.ts` with three scenarios from the spec: successful login (mock `verifyAdminCredentials` to return true), failed login (returns false), malformed JSON body. Each test installs a `vi.spyOn(console, 'log')` (and `console.error`, `console.warn`) and asserts no call argument, when stringified, contains `process.env.ADMIN_USERNAME`, the submitted password, the substring `password`, or any 4+ char prefix of `ADMIN_PASSWORD_HASH`
- [x] 2.4 Run `npm test app/api/auth/login` and confirm all three pass — 3/3 passed

## 3. Fix #2 — Admin login open redirect

- [x] 3.1 In `app/admin/login/page.tsx`, replace `const from = searchParams?.get('from') || '/admin'` (line 12) and the `router.replace(from)` call (line 27) with: read the raw `from`, compute `isSafeFrom = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')`, then call `router.replace(isSafeFrom ? from : '/admin')`. Inline — no new file, no helper
- [x] 3.2 Add `app/admin/login/page.test.tsx` with the four redirect scenarios from the spec: `from=/admin/stations` (allowed), `from=https://evil.example` (rejected → `/admin`), `from=//evil.example/admin` (rejected → `/admin`), `from=javascript:alert(1)` (rejected → `/admin`), and one with no `from` (defaults to `/admin`). Mock `next/navigation`'s `useRouter` and `useSearchParams`; mock `fetch` to return a 200 for `/api/auth/login`; trigger the form submit; assert `router.replace` was called with the expected path. Implementation notes: needed `window.matchMedia` polyfill in `setup-tests.ts` for antd, used `document.querySelector('button[type="submit"]')` instead of `getByRole('button', {name: '登入'})` (antd renders multiple buttons + nested span), called `cleanup()` in afterEach to prevent state leakage between tests
- [x] 3.3 Run `npm test app/admin/login` and confirm all five pass — 5/5 passed

## 4. Spec sync and verification

- [x] 4.1 Run `npm test` end-to-end and confirm zero failures — 8/8 tests pass across 2 files
- [~] 4.2 Run `npm run lint` — **skipped**: this repo has no `.eslintrc*` or `eslint.config.*`, so `next lint` triggers an interactive setup wizard. Pre-existing project state, unrelated to this change. Setting up ESLint is out of scope (rule 5.5)
- [x] 4.3 Run `npm run build` to confirm the production bundle still builds — build passed, all 11 routes generated
- [~] 4.4 Manual smoke test — **partial**: cannot run interactive browser login from this environment (no admin credentials, no browser). The redirect logic is fully exercised by 3.2's automated tests using the same `LoginInner` component. User should run this manually before merging
- [x] 4.5 Run `openspec validate --strict harden-admin-login` — change is valid

## 5. Out of scope (do NOT do in this change)

- [x] 5.1 Do NOT add structured logging, audit logging, or any replacement for the deleted debug logs — confirmed: `route.ts` has zero `console.*` calls
- [x] 5.2 Do NOT add rate limiting to `/api/auth/login` (separate change) — confirmed: handler unchanged except for log deletion
- [x] 5.3 Do NOT introduce a `lib/safe-redirect.ts` helper — single call site, inline is correct — confirmed: validation is 3 inline lines in `page.tsx`
- [x] 5.4 Do NOT modify middleware, `lib/auth.ts`, `lib/session.ts`, or the iron-session config — confirmed: `git status` shows none of these files touched
- [x] 5.5 Do NOT touch any other admin route, public route, or unrelated security finding from the audit — confirmed: only `app/api/auth/login/route.ts` and `app/admin/login/page.tsx` modified (plus new test files and test infra)
