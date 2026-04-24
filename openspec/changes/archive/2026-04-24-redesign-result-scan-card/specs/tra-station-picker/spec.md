## MODIFIED Requirements

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
