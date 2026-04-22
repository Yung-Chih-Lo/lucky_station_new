## MODIFIED Requirements

### Requirement: SQLite schema for metro data
The system SHALL persist transport data in a SQLite database accessed via Drizzle ORM. The schema SHALL include tables `stations`, `lines`, `station_lines`, `connections`, `canvas_config`, `station_picks`, `comments`, and `rate_limits` as specified in the design document.

The `stations` and `lines` tables SHALL each include a `transport_type TEXT NOT NULL` column constrained by `CHECK (transport_type IN ('mrt','tra'))`. The `stations` table SHALL include a `county TEXT` column (nullable at the schema level; required by the application layer for all `tra` rows).

The previous single-column unique key `UNIQUE(name_zh)` on `stations` SHALL be removed and replaced by two partial unique indexes:
- `uniq_mrt_name`: `UNIQUE(name_zh) WHERE transport_type = 'mrt'`
- `uniq_tra_name_county`: `UNIQUE(name_zh, county) WHERE transport_type = 'tra'`

This split is required because `lucky_station`'s source data lists border-area TRA stations (e.g. 七堵, 池上, 後壁) under multiple counties, and the application treats each `(name_zh, county)` pair as an independently selectable station (see `design.md` Decision D13).

#### Scenario: Fresh database migration
- **WHEN** migrations run against an empty database
- **THEN** all eight tables SHALL exist with the columns, primary keys, foreign keys, and CHECK constraints described in `design.md` Decisions D1, D4, D7
- **AND** `canvas_config` SHALL enforce singleton via `CHECK (id = 1)`
- **AND** `stations.transport_type` SHALL be `NOT NULL` and constrained by `CHECK (transport_type IN ('mrt','tra'))`
- **AND** `lines.transport_type` SHALL be `NOT NULL` and constrained by the same CHECK
- **AND** the partial unique index `uniq_mrt_name` SHALL exist on `stations(name_zh) WHERE transport_type = 'mrt'`
- **AND** the partial unique index `uniq_tra_name_county` SHALL exist on `stations(name_zh, county) WHERE transport_type = 'tra'`
- **AND** no unconditional `UNIQUE(name_zh)` constraint SHALL remain on `stations`

#### Scenario: MRT station name uniqueness within MRT
- **WHEN** an insert attempts to create a station with `transport_type = 'mrt'` whose `name_zh` matches an existing MRT row
- **THEN** the insert SHALL fail with a uniqueness constraint error

#### Scenario: Same name_zh across transport types is allowed
- **WHEN** an insert creates a station with `name_zh = '台北', transport_type = 'tra', county = '台北市'`
- **AND** an existing row already has `name_zh = '台北', transport_type = 'mrt', county = NULL`
- **THEN** the insert SHALL succeed
- **AND** both rows SHALL coexist with distinct `id` values

#### Scenario: Same TRA name_zh across different counties is allowed
- **WHEN** an insert creates a station with `name_zh = '七堵', transport_type = 'tra', county = '基隆市'`
- **AND** an existing row already has `name_zh = '七堵', transport_type = 'tra', county = '新北市'`
- **THEN** the insert SHALL succeed
- **AND** both rows SHALL coexist with distinct `id` values

#### Scenario: Same TRA name_zh in the same county is rejected
- **WHEN** an insert attempts to create a station with `name_zh = '七堵', transport_type = 'tra', county = '基隆市'`
- **AND** an existing row already has the identical `(name_zh, county)` for `transport_type = 'tra'`
- **THEN** the insert SHALL fail with a uniqueness constraint error

#### Scenario: TRA insert with NULL county is rejected by the application layer
- **WHEN** the seed script or admin API attempts to insert a `transport_type = 'tra'` station with `county` unset or NULL
- **THEN** the application SHALL reject the write before it reaches the database (zod validation)
- **AND** the database SHALL NOT contain any TRA row with NULL `county`

#### Scenario: Station deletion cascades to associations and picks
- **WHEN** a station row is deleted
- **THEN** all `station_lines` rows referencing that station SHALL be deleted
- **AND** all `connections` rows referencing that station as `from_station_id` or `to_station_id` SHALL be deleted
- **AND** all `station_picks` rows referencing that `station_id` SHALL be deleted
- **AND** all `comments` rows referencing that `station_id` SHALL be deleted

#### Scenario: Migration backfills transport_type for existing rows
- **WHEN** the migration adding `transport_type` runs against a database that already contains MRT data from a prior version
- **THEN** every existing row in `stations` and `lines` SHALL be backfilled with `transport_type = 'mrt'`
- **AND** the migration SHALL fail fast if any row remains NULL after backfill

### Requirement: One-time seed script imports existing JSON
The system SHALL provide standalone seed scripts. `npm run seed` SHALL import `src/data/metroData.json` (or a path passed as an argument) into the configured SQLite database, writing all imported `stations` and `lines` rows with `transport_type = 'mrt'`. `npm run seed:tra` SHALL import `scripts/seed-data/tra-stations.json` into the configured database, writing all imported `stations` rows with `transport_type = 'tra'` and populating `county` from the JSON. Both scripts SHALL be idempotent: re-running against an already-seeded database SHALL NOT duplicate rows and SHALL NOT fail.

#### Scenario: First MRT seed run against empty database
- **WHEN** `npm run seed` runs against an empty database
- **THEN** all stations, lines, station-line memberships, and connections from the JSON SHALL be inserted with `transport_type = 'mrt'`
- **AND** `canvas_config` SHALL be populated from the JSON's top-level `size` field
- **AND** each station's `schematic_x`/`schematic_y` SHALL be sourced from the JSON's `center.x`/`center.y`
- **AND** each station's `label_x`/`label_y`/`label_anchor` SHALL be sourced from the JSON's `name.pos.x`/`name.pos.y`/`name.pos.anchor`
- **AND** each station's `lat`/`lng` SHALL be populated when present in the JSON
- **AND** each station's `county` SHALL remain NULL

#### Scenario: First TRA seed run against MRT-seeded database
- **WHEN** `npm run seed:tra` runs against a database that contains MRT data
- **THEN** every TRA station in the JSON SHALL be inserted with `transport_type = 'tra'` and a non-NULL `county`
- **AND** any TRA station whose `name_zh` matches an existing MRT station SHALL coexist as a separate row (composite uniqueness)
- **AND** no MRT row SHALL be modified

#### Scenario: Re-run against populated database
- **WHEN** `npm run seed` or `npm run seed:tra` runs against a database that already contains the same data
- **THEN** no duplicate rows SHALL be created
- **AND** the script SHALL exit successfully

### Requirement: Public read access uses server components, not a REST endpoint
The public picker pages (`/`) SHALL query the database directly from React Server Components using Drizzle, scoped by `transport_type` to the active picker mode. A public `/api/stations` GET endpoint SHALL NOT exist in this iteration. Public community endpoints (`/api/pick`, `/api/comments`, `/api/comments/[token]`, `/api/stats`) are out of scope of this requirement and are governed by the `community-engagement` capability.

#### Scenario: Visitor loads the public page
- **WHEN** a visitor requests `/`
- **THEN** the HTML sent by the server SHALL already contain the MRT station data needed for the initial render
- **AND** no client-side fetch SHALL be issued to load station data on first paint
- **AND** the server-side query SHALL filter by `transport_type = 'mrt'`

#### Scenario: TRA mode loads tra stations on demand
- **WHEN** the visitor switches to the TRA tab
- **THEN** the TRA county list and station data SHALL be fetched (either prefetched at server-render or lazily fetched once on first switch)
- **AND** all returned stations SHALL have `transport_type = 'tra'`
