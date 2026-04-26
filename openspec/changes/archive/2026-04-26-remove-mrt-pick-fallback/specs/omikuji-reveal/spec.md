## MODIFIED Requirements

### Requirement: Ritual plays in parallel with the pick API call
To hide network latency, the client SHALL begin the `<RevealRitual>` presentation timeline at CTA-press time and fetch the pick result in parallel. If the pick response arrives before phase 3 (station-name typing) is ready to begin, the station name SHALL be revealed on schedule. If the pick response is still pending at the start of phase 3, the ritual SHALL hold at the pre-type-in state and resume as soon as the response arrives.

#### Scenario: API faster than ritual
- **WHEN** `POST /api/pick` resolves in less than 400ms
- **THEN** the ritual SHALL NOT cut phases 1–2 short
- **AND** phase 3 SHALL begin at its scheduled 500ms mark

#### Scenario: API slower than ritual
- **WHEN** `POST /api/pick` has not resolved by 500ms after CTA press
- **THEN** the ritual SHALL pause at the end of phase 2
- **AND** phase 3 SHALL begin within 100ms of the response arriving

#### Scenario: API error during ritual
- **WHEN** `POST /api/pick` returns a non-2xx status
- **THEN** the client SHALL display a user-facing toast containing the phrase "請重新整理頁面"
- **AND** the reveal modal SHALL NOT open
- **AND** no station name SHALL be "revealed"
- **AND** the picker SHALL return to its idle state so the user can pick again
