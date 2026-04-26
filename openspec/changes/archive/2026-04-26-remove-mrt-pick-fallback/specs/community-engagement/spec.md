## MODIFIED Requirements

### Requirement: Pick API resolves a station from server-side criteria
The `POST /api/pick` endpoint SHALL accept a JSON body of the form `{ transport_type: 'mrt' | 'tra', ... }`. For `transport_type: 'mrt'` the body SHALL include a `station_id` (positive integer); the server SHALL look that station up by id (constrained to `transport_type = 'mrt'`) and SHALL NOT perform a server-side random selection for MRT. For `transport_type: 'tra'` the server SHALL resolve the candidate set entirely from the database from a county filter and randomly select one station from that set.

#### Scenario: Pick by mrt with station_id
- **WHEN** a client posts `{ transport_type: 'mrt', station_id: 42, filter: { line_codes: ['BR', 'R'] } }`
- **THEN** the server SHALL look up the station with `id = 42 AND transport_type = 'mrt'`
- **AND** the response SHALL include `{ token, station: { id: 42, name_zh, name_en, line_codes: [...] } }`
- **AND** the row inserted into `station_picks` SHALL have `station_id = 42`

#### Scenario: Pick by mrt without station_id
- **WHEN** a client posts `{ transport_type: 'mrt', filter: { line_codes: ['BR'] } }` with no `station_id`
- **THEN** the response status SHALL be 400
- **AND** the response body SHALL include `{ error: 'invalid_body' }` (or equivalent zod-validation error)
- **AND** no row SHALL be inserted into `station_picks`

#### Scenario: Pick by mrt with unknown station_id
- **WHEN** a client posts `{ transport_type: 'mrt', station_id: 999999 }` for a station that does not exist or whose `transport_type` is not `'mrt'`
- **THEN** the response status SHALL be 422
- **AND** the response body SHALL include `{ error: 'no_candidates' }`
- **AND** no row SHALL be inserted into `station_picks`

#### Scenario: Pick by tra with county filter
- **WHEN** a client posts `{ transport_type: 'tra', filter: { counties: ['台北市', '宜蘭縣'] } }`
- **THEN** the server SHALL select uniformly at random from stations whose `transport_type = 'tra'` AND `county` is in the listed counties
- **AND** the response SHALL include `{ token, station: { id, name_zh, county } }`

#### Scenario: Empty candidate set (TRA)
- **WHEN** a TRA pick body resolves to zero candidate stations
- **THEN** the response status SHALL be 422
- **AND** the response body SHALL include `{ error: 'no_candidates' }` with no token created

#### Scenario: Invalid transport_type
- **WHEN** the body's `transport_type` is not `mrt` or `tra`
- **THEN** the response status SHALL be 400
- **AND** no row SHALL be inserted into `station_picks`
