## ADDED Requirements

### Requirement: Social nav lives in the top bar, not inside pickers
The entry points to the social surfaces (`/explore` for 旅人心得, `/stats` for 排行榜) SHALL be accessible from a persistent top-bar nav on every `(public)` route. The pickers (`MrtPicker`, `TraPicker`) and their sidebars SHALL NOT render their own `旅人心得` / `排行榜` links. The public top bar SHALL NOT contain a login entry; admin authentication lives at `/admin/login` and is not reachable from public navigation.

#### Scenario: Nav appears on picker page
- **WHEN** a visitor loads `/`
- **THEN** the top bar SHALL contain a text link to `/explore` labeled `旅人心得`
- **AND** a text link to `/stats` labeled `排行榜`

#### Scenario: Nav appears on community pages
- **WHEN** a visitor loads `/explore`, `/stats`, or `/comment`
- **THEN** the top bar SHALL show the same two entries
- **AND** the currently active entry (matching the route) SHALL receive a visible active-state indicator (`--accent` underline or equivalent, ≥2px, contrast ≥3:1)

#### Scenario: Picker sidebars no longer duplicate nav
- **WHEN** either picker (MRT or TRA) renders
- **THEN** its sidebar SHALL NOT contain any link to `/explore` or `/stats`
- **AND** the text "旅人心得" and "排行榜" SHALL NOT appear inside the picker sidebar

### Requirement: Result modal deep-links to station-scoped comments
After a successful pick, the result modal SHALL show a deep link to the station-scoped 旅人心得 thread for that station, alongside the existing "留下心得" action. The deep link SHALL present the count of existing 心得 for that station when known (e.g. "已有 142 位旅人抽到這站 · 看他們寫了什麼 →"); when the count is zero or unknown, the copy SHALL read "搶先留下這一站的心得 →".

#### Scenario: Modal shows count when available
- **WHEN** the result modal renders for a station whose server-provided comment count is `n ≥ 1`
- **THEN** the modal SHALL display a link that includes the number `n`
- **AND** the link SHALL navigate to `/explore?station_id=<id>` (or the equivalent station-filtered URL)

#### Scenario: Modal shows fallback copy on zero
- **WHEN** the result modal renders for a station whose server-provided comment count is `0`
- **THEN** the modal SHALL display a link with fallback copy containing the phrase "搶先"
- **AND** the link SHALL navigate to `/comment?token=<token>` (the user's own comment form)

#### Scenario: "留下心得" remains present
- **WHEN** the result modal renders
- **THEN** the primary "留下心得" CTA SHALL still be present
- **AND** the new deep link SHALL be secondary (smaller or below the CTA)

### Requirement: Pick API returns a station comment count
The `POST /api/pick` response SHALL include a `comment_count` field reporting the number of `comments` rows currently associated with the resolved station. This SHALL be an O(1) lookup or a cheap aggregation; it SHALL NOT block the pick past 50ms under steady-state load.

#### Scenario: Response shape includes comment_count
- **WHEN** a client calls `POST /api/pick` with a valid body
- **THEN** the 200 response body SHALL include a `comment_count` field of type integer (≥0)
- **AND** `comment_count` SHALL equal the count of `comments` rows whose `station_id` matches the resolved station

#### Scenario: comment_count is zero for untouched stations
- **WHEN** a pick resolves to a station that has never received a comment
- **THEN** the `comment_count` field SHALL be exactly `0`
