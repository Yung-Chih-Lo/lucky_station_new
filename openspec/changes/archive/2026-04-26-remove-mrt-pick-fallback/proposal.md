## Why

A previous fix (`4c6d309`) made the MRT pick flow client-driven: the FE picks the station for the train animation, then sends `station_id` so the BE looks it up instead of re-randomising. But the BE kept its old random-pick branch as a silent fallback when `station_id` is missing. Production users have intermittently hit the original "QR-scanned comment lands on a different station" bug — most plausibly because their browsers still hold a cached pre-fix bundle that sends no `station_id`, so the BE silently falls back to its own random pick and the resulting token is bound to a different station than the one the FE displays.

The fallback exists for no real reason — every shipped FE codepath sends `station_id` — and its only effect is to silently produce a wrong-station token whenever a stale client (or any future bug) drops the field. Failing loud is safer than failing wrong.

## What Changes

- **BREAKING (server contract)**: `POST /api/pick` for `transport_type: 'mrt'` SHALL require a `station_id`. The Zod validator drops `.optional()`; the route handler removes the `else` fallback to `pickMrt()`. Missing/invalid `station_id` returns `400` instead of silently picking a random station.
- Remove `pickMrt()` from `lib/community/pick.ts` once nothing else references it (TRA is unaffected — it stays server-picked).
- FE `MrtPicker` shows a toast ("請重新整理頁面") when `POST /api/pick` returns a non-2xx response, and skips opening the modal in that case.
- Add a regression test covering: MRT pick without `station_id` returns 400; MRT pick with `station_id` always binds the token to that exact station.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `community-engagement`: the "Pick API resolves a station from server-side criteria" requirement changes for MRT — the server SHALL trust the client-supplied `station_id` and SHALL reject MRT pick requests that omit it. TRA behaviour is unchanged.
- `omikuji-reveal`: the "Ritual plays in parallel with the pick API call" requirement gains a stricter error path — on non-2xx the client SHALL surface a toast prompting the user to refresh, and SHALL NOT open the reveal modal.

## Impact

- `app/api/pick/route.ts` — remove the MRT `else` branch, return 400 when `station_id` is missing.
- `lib/community/validators.ts` — `station_id` becomes required for the MRT discriminant.
- `lib/community/pick.ts` — delete `pickMrt()` (verify no other callers first).
- `components/mrt/MrtPicker.tsx` — handle non-OK `/api/pick` responses by toasting and skipping `setModalOpen(true)`.
- Tests: `app/api/pick/route.test.ts` (or new file) — cover the missing-`station_id` 400 case and the lookup-binds-correct-station case.
- No DB migration. No new dependencies (`antd`'s `message` is already used in `CommentClient`).
- Stale-client users will start seeing the toast on their next pick instead of a silently-wrong QR; refreshing loads the new bundle and they're fine.
