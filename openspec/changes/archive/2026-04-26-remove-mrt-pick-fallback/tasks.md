## 1. Backend: tighten `/api/pick` for MRT

- [x] 1.1 In `lib/community/validators.ts`, change the `mrtPick` discriminant so `station_id: z.number().int().positive()` is required (drop `.optional()`).
- [x] 1.2 In `app/api/pick/route.ts`, remove the `else` branch that falls back to `pickMrt()` for MRT. After validation passes, MRT requests SHALL only call `lookupMrtStation`.
- [x] 1.3 Remove the now-unused `pickMrt` import from `app/api/pick/route.ts`.
- [x] 1.4 Delete `pickMrt` from `lib/community/pick.ts` (already verified no other callers).

## 2. Backend: regression tests

- [x] 2.1 Create `app/api/pick/route.test.ts` with the same `vi.mock('@/db/client', ...)` pattern used in `app/api/stations/[id]/relay/route.test.ts`.
- [x] 2.2 Add test: MRT POST with `station_id: 42` calls the `lookupMrtStation` SQL path, and the returned/inserted station is exactly id 42.
- [x] 2.3 Add test: MRT POST with no `station_id` returns 400 and does not insert into `station_picks`.
- [x] 2.4 Add test: MRT POST with `station_id` for a non-existent station returns 422 with `{ error: 'no_candidates' }`.
- [x] 2.5 Add test: TRA POST with `counties` still uses the random-pick path (sanity check that we didn't regress TRA).

## 3. Frontend: toast on `/api/pick` failure

- [x] 3.1 In `components/mrt/MrtPicker.tsx`, import `message` from `antd` and create `messageApi`/`contextHolder` via `message.useMessage()` (mirror the pattern in `app/(public)/comment/CommentClient.tsx`).
- [x] 3.2 Render `{contextHolder}` inside the picker's root JSX so toasts attach to this subtree.
- [x] 3.3 In the `request` IIFE inside `handleRandomPick`, on `!res.ok` (or fetch reject) call `messageApi.error('請重新整理頁面')` and have the promise reject so callers can branch on it.
- [x] 3.4 Change the modal-open paths so the modal SHALL NOT open when the request rejected: in the `prefersReduced` branch, only open the modal on resolved-success; in `handleAnimationEnd`, check the request outcome before `setModalOpen(true)` (e.g. by storing a `requestSucceeded` ref or awaiting the promise).
- [x] 3.5 Verify locally: throttle `/api/pick` to return 400, click pick — toast appears, modal does NOT open, animation finishes, button returns to enabled.

## 4. Verify

- [x] 4.1 Run `npm test` (or the project's test command) — all new and existing tests pass.  *(46/46 pass)*
- [x] 4.2 Manual smoke test in dev: pick MRT (success), pick MRT after manually editing the FE to drop `station_id` (toast + no modal), pick TRA (still works).
- [x] 4.3 Run `openspec verify --change remove-mrt-pick-fallback` (if the project uses it) before archiving.  *(used `openspec validate` — change is valid)*
