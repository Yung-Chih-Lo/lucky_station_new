# tra-station-picker Specification

## Purpose
TBD - created by archiving change add-multi-transport-community. Update Purpose after archive.
## Requirements
### Requirement: TRA picker is a distinct UI mode reachable from the home page
The home page SHALL expose a Tab control letting the user switch between MRT mode and TRA mode. The TRA mode SHALL render a dedicated picker layout (county selection sidebar + Taiwan SVG map) instead of the schematic MRT route map.

#### Scenario: Switching to TRA tab
- **WHEN** the user clicks the TRA tab on `/`
- **THEN** the schematic MRT map SHALL be hidden
- **AND** the TRA picker layout (county sidebar + Taiwan SVG map) SHALL render
- **AND** the page SHALL apply the TRA glassmorphism light theme

#### Scenario: Switching back to MRT tab
- **WHEN** the user clicks the MRT tab on `/`
- **THEN** the TRA picker layout SHALL be hidden
- **AND** the schematic MRT map SHALL render
- **AND** the page SHALL revert to the MRT dark indigo theme

#### Scenario: Tab preference persists
- **WHEN** the user has previously selected the TRA tab and reloads `/`
- **THEN** after first paint (which SHALL be MRT to avoid hydration mismatch), the client SHALL read `localStorage.lastTransportTab` and switch to TRA if stored
- **AND** subsequent reloads SHALL continue to start at MRT then switch

### Requirement: County multi-select sidebar with select-all and clear-all
The TRA sidebar SHALL provide a checkbox group of all Taiwan counties present in the `tra` station data. It SHALL provide "全選" and "清除" controls, and SHALL display a primary "抽幸運車站" CTA whose enabled state requires at least one county selected.

#### Scenario: Initial state
- **WHEN** the TRA tab first renders
- **THEN** all county checkboxes SHALL be unchecked
- **AND** the "抽幸運車站" CTA SHALL be disabled
- **AND** a hint such as「請至少選擇一個縣市」SHALL be visible

#### Scenario: Select all
- **WHEN** the user clicks "全選"
- **THEN** every county checkbox SHALL become checked
- **AND** the CTA SHALL become enabled

#### Scenario: Clear all
- **WHEN** at least one county is selected
- **AND** the user clicks "清除"
- **THEN** every county checkbox SHALL become unchecked
- **AND** the CTA SHALL become disabled

#### Scenario: Single county selected
- **WHEN** the user checks exactly one county
- **THEN** the CTA SHALL become enabled
- **AND** clicking the CTA SHALL trigger a pick request whose filter contains only that county

### Requirement: Taiwan SVG map mirrors and controls the county selection
The TRA picker SHALL render an interactive Taiwan SVG map (sourced from `@svg-maps/taiwan.main`). The map SHALL highlight selected counties and SHALL allow the user to toggle a county's selection by clicking its region. Map and sidebar selections SHALL stay synchronized in both directions.

#### Scenario: Sidebar selection highlights the map
- **WHEN** the user checks 「宜蘭縣」 in the sidebar
- **THEN** the 宜蘭縣 region in the SVG map SHALL display the selected-state fill (a brand accent color)
- **AND** unselected regions SHALL display the default fill

#### Scenario: Map click updates the sidebar
- **WHEN** the user clicks the 花蓮縣 region in the SVG map
- **AND** 花蓮縣 was previously unselected
- **THEN** the 花蓮縣 sidebar checkbox SHALL become checked
- **AND** the region fill SHALL switch to the selected state

#### Scenario: Hover affordance
- **WHEN** the user hovers any county region with a mouse
- **THEN** the region SHALL show a hover state (cursor pointer + visual change such as opacity or stroke)
- **AND** a tooltip or label SHALL identify the county name

#### Scenario: Counties without TRA stations
- **WHEN** the data contains no `tra` stations for a county (for example 連江縣)
- **THEN** that region SHALL render as visually disabled (lower opacity)
- **AND** clicks on that region SHALL be ignored
- **AND** no checkbox for that county SHALL appear in the sidebar

### Requirement: Pick result modal displays the station with a reveal animation
After a successful pick, the TRA picker SHALL open a centered modal showing the station name and county. The station name SHALL animate by cycling random station names rapidly for ≤2 seconds and then settling on the actual chosen name with a fade-in. The modal SHALL include external links to a Wikipedia search and a Google Maps search for the station, the county rendered as a single chip, a state-dependent relay card (RelayExcerptCard or FirstArrivalCard), a dashed separator, and a ScanCtaCard in the footer zone containing the screenshot-save QR and the share action labeled `分享給你的好友`.

The standalone "搶先留下這一站的心得 →" / "已有 N 位旅人" Antd button beneath the share button SHALL NOT be rendered; the CTA intent is carried by the ScanCtaCard's copy and the RelayExcerptCard's `更多 N 則 →` link.

#### Scenario: Successful pick reveal
- **WHEN** a pick API call returns successfully
- **THEN** the modal SHALL open centered with a backdrop blur
- **AND** the station name element SHALL cycle through random names for at most 2000ms (interval ~80ms)
- **AND** after cycling, the station name SHALL settle on the real chosen name with a fade-in opacity 0→1 over ≤400ms
- **AND** the county SHALL be rendered as a single chip with fill color `var(--accent)` directly below the station name block

#### Scenario: prefers-reduced-motion
- **WHEN** the user's OS reports `prefers-reduced-motion: reduce`
- **THEN** the cycling animation SHALL be skipped
- **AND** the station name SHALL render in its final state immediately

#### Scenario: External links are rendered as rectangular buttons
- **WHEN** the result modal is open
- **THEN** two outlined rectangular buttons SHALL appear below the county chip, splitting the available width roughly evenly
- **AND** the left button SHALL be labeled `維基百科` and SHALL navigate to `https://zh.wikipedia.org/wiki/Special:Search?search=<station_name>車站`
- **AND** the right button SHALL be labeled `Google Maps` and SHALL navigate to a maps search for the station name
- **AND** both links SHALL open in a new tab

#### Scenario: Relay vs first-arrival state is chosen by the relay API count
- **WHEN** the relay API response returns `count > 0`
- **THEN** the RelayExcerptCard SHALL render between the Wiki/Maps buttons and the dashed separator
- **AND** the ScanCtaCard below the separator SHALL use the `relay` headline variant

#### Scenario: First-arrival state
- **WHEN** the relay API response returns `count === 0`
- **THEN** the FirstArrivalCard SHALL render between the Wiki/Maps buttons and the dashed separator
- **AND** the ScanCtaCard below the separator SHALL use the `first` headline variant

#### Scenario: Standalone comment CTA button is removed
- **WHEN** the result modal is open
- **THEN** no Antd `Button` with the label `搶先留下這一站的心得 →` SHALL be present
- **AND** no Antd `Button` with a label matching `已有 \d+ 位旅人抽到這站` SHALL be present
- **AND** the CTA intent SHALL be carried by the ScanCtaCard copy ("換你寫下此站心得" or "成為此站第一位留言者") and the RelayExcerptCard's `更多 N 則 →` link when present

#### Scenario: Screenshot-save QR lives inside the ScanCtaCard, not the seal row
- **WHEN** the result modal renders its post-reveal footer zone
- **THEN** the screenshot-save QR SHALL render on the left side of the ScanCtaCard (not a separate seal-row element)
- **AND** the QR SHALL encode the absolute URL `${origin}/comment?token=<token>`
- **AND** the QR SHALL render as a static `<img>` with no surrounding link or handler (scanning from a screenshot is the only activation path)
- **AND** the ScanCtaCard caption SHALL include `No.<ticketNo> · <dateLabel>`
- **AND** this QR SHALL remain distinct from the QR embedded in the shareable ticket PNG served by `/api/ticket/<token>` (which continues to point to the site root for public safety)

### Requirement: TRA picker honors the rate limit response from the API
When the pick API returns 429, the TRA picker SHALL display a non-modal toast or inline notice indicating the user is sending requests too quickly, without crashing the picker UI.

#### Scenario: Rate limit hit
- **WHEN** the user presses the CTA
- **AND** the API responds with 429
- **THEN** the picker SHALL show a notice such as「太快了！請稍候再試」using the antd `message` API
- **AND** the modal SHALL NOT open
- **AND** the CTA SHALL remain enabled (no permanent block)

### Requirement: TRA picker uses the shared community API, no separate endpoints
The TRA picker SHALL call the same `POST /api/pick` and `/comment?token=` paths used by the MRT picker, distinguished only by the `transport_type` field in the request body. There SHALL NOT be a separate `/api/tra/*` route family.

#### Scenario: Single pick endpoint
- **WHEN** the TRA picker submits a pick request
- **THEN** the request URL SHALL be `POST /api/pick`
- **AND** the request body SHALL include `transport_type: 'tra'`
- **AND** the response token SHALL link to the same `/comment?token=` page used for MRT picks

