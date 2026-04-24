## MODIFIED Requirements

### Requirement: Pick result modal displays the station with a reveal animation
After a successful pick, the TRA picker SHALL open a centered modal showing the station name and county. The station name SHALL animate by cycling random station names rapidly for ≤2 seconds and then settling on the actual chosen name with a fade-in. The modal SHALL include external links to a Wikipedia search and a Google Maps search for the station, plus a primary CTA to navigate to the comment form rendered as a button (not a text link), and a private screenshot-save QR for save-for-later use.

#### Scenario: Successful pick reveal
- **WHEN** a pick API call returns successfully
- **THEN** the modal SHALL open centered with a backdrop blur
- **AND** the station name element SHALL cycle through random names for at most 2000ms (interval ~80ms)
- **AND** after cycling, the station name SHALL settle on the real chosen name with a fade-in opacity 0→1 over ≤400ms
- **AND** the county SHALL be displayed below the name
- **AND** a "留下心得" CTA SHALL be visible

#### Scenario: prefers-reduced-motion
- **WHEN** the user's OS reports `prefers-reduced-motion: reduce`
- **THEN** the cycling animation SHALL be skipped
- **AND** the station name SHALL render in its final state immediately

#### Scenario: External links
- **WHEN** the result modal is open
- **THEN** a Wikipedia link button SHALL navigate to `https://zh.wikipedia.org/wiki/Special:Search?search=<station_name>車站`
- **AND** a Google Maps link button SHALL navigate to a maps search for the station name
- **AND** both links SHALL open in a new tab

#### Scenario: Comment CTA navigates with token
- **WHEN** the user clicks the "留下心得" CTA
- **THEN** the browser SHALL navigate to `/comment?token=<token>`

#### Scenario: Comment CTA is rendered as a button of the same size class as the share button
- **WHEN** the result modal renders its post-reveal actions
- **THEN** the comment CTA SHALL be rendered as an Antd `Button` (not a bare text link)
- **AND** its visual weight (size, width) SHALL match the share button stacked above it
- **AND** it SHALL sit directly below the share button in the vertical stack
- **AND** its label SHALL vary with the server-reported comment count for that station: when no comments exist it SHALL read "搶先留下這一站的心得 →" and link to `/comment?token=<token>`; when comments exist it SHALL read "已有 N 位旅人抽到這站 · 看他們寫了什麼 →" and link to `/explore?station_id=<id>`

#### Scenario: Screenshot-save QR is integrated into the footer seal row
- **WHEN** the result modal renders its post-reveal actions
- **THEN** a QR code SHALL be rendered on the left side of the same horizontal row that contains the seal mark and pick date (the ritual footer row)
- **AND** the QR SHALL encode the absolute URL `{origin}/comment?token=<token>`
- **AND** a caption SHALL appear on its own line above that row reading "📸 截圖保存，之後打開相簿掃 QR Code 就可以寫心得嘍！"
- **AND** a downward arrow `↓` SHALL appear between the caption and the footer row, horizontally aligned so it visually points toward the QR
- **AND** the caption + arrow + QR SHALL read as a utility note (muted typography), clearly subordinate to the two CTA buttons above
- **AND** the QR SHALL render as a static image only and SHALL NOT be wrapped in a link, button, or other click/tap handler; scanning from a screenshot is the only intended activation path
- **AND** this QR SHALL be distinct from and SHALL NOT replace the QR embedded in the shareable ticket PNG served by `/api/ticket/<token>` (which continues to point to the site root for public safety)
