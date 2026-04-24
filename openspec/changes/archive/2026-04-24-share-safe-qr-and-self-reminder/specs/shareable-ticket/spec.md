## MODIFIED Requirements

### Requirement: Ticket image contains the signature lockup
The generated ticket PNG SHALL contain, at minimum:
- The station name lockup in Noto Serif TC weight 900 (the largest element, occupying ≥30% of the canvas height).
- The English name (if available) in a smaller weight above the Chinese name.
- The 籤號 `No.XXXX` rendered in JetBrains Mono (or a monospace fallback). The 籤號 SHALL be derived from the pick's `station_picks.id` (global cumulative pick count), formatted as `String(id).padStart(4, '0')`. It SHALL NOT be derived from the token hash.
- The pick date in `YYYY.MM.DD` format.
- The seal mark in `--seal` color containing the mode label (`捷運` or `台鐵`).
- The brand wordmark `下一站 · 幸運車站` in small caption type.
- A QR code pointing to the site root so that anyone who scans a shared ticket is routed to the landing page to draw their own station. The QR SHALL NOT embed the pick token or any owner-only comment URL.
- The kerf-edge treatment (dashed top and bottom) so the image reads as a ticket stub.

The ticket SHALL NOT contain any emoji characters.

#### Scenario: Chinese station name is present and dominant
- **WHEN** a ticket is generated for a pick whose station's `nameZh` is "七堵"
- **THEN** the generated PNG SHALL render the text "七堵"
- **AND** that text element SHALL be the largest text on the canvas

#### Scenario: 籤號 reflects the real pick ID
- **WHEN** the pick's `station_picks.id` is `42`
- **THEN** the PNG SHALL contain the text `No.0042`
- **AND** the number SHALL remain constant across multiple requests for the same token

#### Scenario: 籤號 grows beyond 4 digits without truncation
- **WHEN** the pick's `station_picks.id` is `10001`
- **THEN** the PNG SHALL contain the text `No.10001`
- **AND** the number SHALL NOT be truncated or wrapped

#### Scenario: 籤號 and date are present
- **WHEN** a ticket is generated for a pick created on `2026-04-22` with `station_picks.id` = `42`
- **THEN** the PNG SHALL contain the text `No.0042`
- **AND** the PNG SHALL contain the text `2026.04.22`

#### Scenario: Seal mark carries the mode label
- **WHEN** a ticket is generated for a pick whose `transport_type` is `tra`
- **THEN** the seal mark SHALL contain the text `台鐵`
- **AND** the seal fill color SHALL resolve to the `--seal` value

#### Scenario: QR code resolves to the site root
- **WHEN** the QR code in the generated PNG is scanned
- **THEN** it SHALL decode to an absolute HTTPS URL equal to the site origin with a trailing slash (e.g. `https://example.com/`)
- **AND** that URL SHALL NOT contain the pick token as a path segment or query parameter
- **AND** loading that URL SHALL render the app landing page

## ADDED Requirements

### Requirement: Result modal exposes a self-reminder copy action
The picker's result modal SHALL include a secondary action that lets the owner copy a self-reminder containing the comment URL for later use (e.g. pasting to Line-to-self). This action SHALL be visually subordinate to the primary share button and SHALL NOT replace or alter the existing share action.

The copied clipboard payload SHALL be plain text of the form `去「{stationNameZh}」寫心得 → {origin}/comment?token={token}`, where `{stationNameZh}` is the Chinese station name of the pick, `{origin}` is the app's public HTTPS origin, and `{token}` is the pick's token.

After a successful copy, the app SHALL show a visible confirmation indicating the content has been copied and suggesting the Line-to-self use case.

#### Scenario: Self-reminder button is present in the result modal
- **WHEN** the result modal opens after a successful pick
- **THEN** the modal SHALL contain a button labeled with a self-reminder intent (e.g. "傳連結給自己")
- **AND** the button SHALL be visually subordinate to the primary share button (secondary / text-link style)
- **AND** the button SHALL be reachable with keyboard focus

#### Scenario: Activating the button copies the formatted reminder
- **WHEN** the user activates the self-reminder button for a pick where `stationNameZh` is "劍潭" and `token` is `abc-123`
- **THEN** the app SHALL call `navigator.clipboard.writeText` exactly once
- **AND** the argument SHALL contain the substring `去「劍潭」寫心得`
- **AND** the argument SHALL contain the substring `/comment?token=abc-123`
- **AND** the argument SHALL be a single plain-text string (no image clipboard flavor)

#### Scenario: Confirmation is shown after copying
- **WHEN** `navigator.clipboard.writeText` resolves successfully
- **THEN** the app SHALL display a visible confirmation (e.g. toast) whose copy suggests pasting to Line as a self-reminder

#### Scenario: Fallback when clipboard API unavailable
- **WHEN** `navigator.clipboard.writeText` is not available OR throws a non-`AbortError` error
- **THEN** the app SHALL surface the reminder text in a form the user can manually copy (e.g. a selectable field or a toast with the text)
- **AND** the app SHALL NOT silently swallow the failure
