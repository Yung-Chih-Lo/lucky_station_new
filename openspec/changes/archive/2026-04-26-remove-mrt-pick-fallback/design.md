## Context

The MRT pick flow used to be entirely server-driven (BE picked the station from a filter), which caused the original "displayed station ≠ QR-bound station" bug because the FE also picked one for the train animation, and the two random draws diverged. Commit `4c6d309` made the flow client-driven for MRT only: the FE picks for the animation and sends `station_id`; the BE looks the station up by ID. But the BE still kept its old random-pick branch as a fallback for when `station_id` is missing — and that silent fallback is the suspected source of the intermittent post-deploy reports, because clients running stale cached JS still POST without `station_id` and the BE happily picks a different station for them.

TRA is unrelated and stays server-picked (counties → random station).

## Goals / Non-Goals

**Goals:**
- Remove the silent BE random-pick fallback for MRT so a missing `station_id` is a hard 400 instead of a wrong-station token.
- Surface 4xx/5xx pick failures to the user with a "請重新整理頁面" toast so a stale client can recover by reloading.
- Add a regression test that pins both behaviours.

**Non-Goals:**
- Changing TRA pick behaviour (still BE-picked).
- Changing the existing animation timing or `RevealRitual` phases.
- Cache-busting or versioning the JS bundle (Next.js build hashes already handle that for fresh loads — the issue is users with long-lived tabs).
- Adding telemetry / logging for the failure case.

## Decisions

**Decision 1 — Make `station_id` required for MRT, not just preferred.**
The validator's `mrtPick` discriminant changes `station_id: z.number().int().positive().optional()` to required. The route handler removes the `else` branch entirely. Alternative considered: keep `station_id` optional but log a warning when it's missing — rejected because the silent-fallback bug is exactly what we're trying to make impossible, and "warn but proceed" preserves the bug. We pick the loudest failure mode the spec allows.

**Decision 2 — Toast + skip-modal on non-2xx, not retry.**
The FE already swallows non-OK responses (`if (res.ok) {…}` with no `else`) and opens a broken modal with `'----'` ticket and no QR. We change it to call `messageApi.error('請重新整理頁面')` and skip `setModalOpen(true)`. Animation has already played by then, which is mildly wasteful but acceptable — the ritual happens entirely client-side and burns no server resources. Alternative considered: retry once with a fresh `station_id` — rejected because if the client sent a bad `station_id`, retrying with the same id won't help, and silently re-picking would just be a different flavor of the same silent-fallback bug we're removing.

**Decision 3 — Delete `pickMrt()` if and only if no other caller exists.**
If the function turns out to be referenced elsewhere (e.g. an admin tool), keep it but no longer wire it from `/api/pick`. A grep before deletion is part of the task list, not a runtime check.

**Decision 4 — Animation rolls back gracefully when the request fails.**
The `RevealRitual` modal never opens on failure, but `result`, `animationStations`, and `isAnimating` may have advanced. The toast appears, and the next click resets state via the existing `handleRandomPick` flow. We don't bother resetting `result` to null on failure — it's only consumed inside the modal, which we don't open.

## Risks / Trade-offs

- **Risk**: Stale clients now see an error toast instead of a silently-broken QR. → **Mitigation**: That's the point. The toast text tells them to refresh; refreshing pulls the new bundle.
- **Risk**: The animation still plays even when the request 400s, wasting ~2.5s of user attention before the toast appears. → **Mitigation**: Acceptable — failures are expected to be rare (only stale clients), and aborting the animation mid-flight would require plumbing a cancel signal through `SchematicMap`'s `TrainMarker` for a path that almost never triggers.
- **Trade-off**: We're tightening the public API contract (`station_id` becomes required for MRT). Any third party hitting `/api/pick` directly would break. → No such consumer exists; this is a single-app endpoint.
