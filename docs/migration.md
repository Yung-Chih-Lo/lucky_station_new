# Legacy data migration (lucky_station → lucky_taipei_mrt)

One-time import of `station_picks` + `comments` from a legacy `lucky_station.db`.
`rate_limits` are not migrated (time-sensitive).

Mapping key: `(station_name, county)` → `stations.id WHERE transport_type='tra'`.
Cross-county duplicate station names (e.g. 七堵 in 基隆市 vs 新北市) resolve to
distinct target rows per design D13.

## Local dry-run

```sh
DATABASE_PATH=./data/metro.db npm run migrate:legacy -- \
  --src=/path/to/lucky_station.db --dry-run
```

Outputs `./data/migration-report.json` with matched/unmatched counts. Review
`unmatched_picks` — expected 0 when target is seeded from the same
`stations.json` source.

## Production (Docker)

1. Mount the legacy DB read-only inside the running container, e.g.
   `-v /host/path/lucky_station.db:/data/legacy/lucky_station.db:ro`.
2. Dry-run first, then real run:
   ```sh
   docker exec <container> npx tsx scripts/migrate-legacy.ts \
     --src=/data/legacy/lucky_station.db --dry-run
   docker exec <container> npx tsx scripts/migrate-legacy.ts \
     --src=/data/legacy/lucky_station.db
   ```
3. The migration is idempotent on `station_picks.token` (UNIQUE). Re-running
   against an already-migrated target DB is safe and skips existing rows.

## Flags

- `--src=<path>` (required): path to source SQLite file
- `--dry-run`: report only, no writes
- `--allow-unmatched=<n>`: proceed even if up to N picks cannot be mapped
  (default 0, i.e. abort on any mismatch)

## Rollback

The migration writes inside a single transaction. If it fails or is aborted,
no rows are written. To undo a successful migration manually:

```sql
DELETE FROM comments
  WHERE pick_id IN (SELECT id FROM station_picks WHERE transport_type='tra');
DELETE FROM station_picks WHERE transport_type='tra';
```
