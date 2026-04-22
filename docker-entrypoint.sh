#!/bin/sh
set -e

# DATABASE_PATH is expected to point at a file inside the mounted volume
# (e.g. /data/metro.db). Ensure the directory exists before anything
# touches the DB.
mkdir -p "$(dirname "$DATABASE_PATH")"

echo "[entrypoint] Applying migrations to $DATABASE_PATH ..."
npx drizzle-kit migrate

# Seeds are idempotent (INSERT OR IGNORE on natural keys). On first boot they
# populate the empty DB. On subsequent boots they're no-ops, so nothing gets
# overwritten even though the volume already has data.
echo "[entrypoint] Running MRT seed (idempotent) ..."
npx tsx scripts/seed.ts

echo "[entrypoint] Running TRA seed (idempotent) ..."
npx tsx scripts/seed-tra.ts

# NOTE: legacy data migration (migrate-legacy.ts) is intentionally NOT
# auto-run. It is a one-time operation that requires a source DB path and
# human review of migration-report.json. Run it manually:
#   docker exec <container> npx tsx scripts/migrate-legacy.ts \
#     --src=/data/legacy/lucky_station.db --dry-run

echo "[entrypoint] Starting Next.js on port ${PORT:-3000} ..."
exec node_modules/.bin/next start -p "${PORT:-3000}"
