## ADDED Requirements

### Requirement: Login endpoint does not log credential material

The login route handler at `POST /api/auth/login` SHALL NOT emit the submitted username, the submitted password (or its length), the configured `ADMIN_USERNAME`, or any 4-character-or-longer substring of `ADMIN_PASSWORD_HASH` (including its length) to any log sink — `console`, `stdout`, `stderr`, or any future logger. This applies to all code paths through the handler: successful logins, failed logins, malformed requests, and unexpected errors.

#### Scenario: Successful login attempt

- **WHEN** a client posts a valid username and password to `/api/auth/login` and receives 200
- **THEN** no log line emitted during that request SHALL contain the value of `ADMIN_USERNAME`, the submitted password, the substring `password`, or any 4-character-or-longer substring of `ADMIN_PASSWORD_HASH`

#### Scenario: Failed login attempt

- **WHEN** a client posts an incorrect username or password to `/api/auth/login` and receives 401
- **THEN** no log line emitted during that request SHALL contain the submitted username, the submitted password, or any 4-character-or-longer substring of `ADMIN_PASSWORD_HASH`

#### Scenario: Malformed login request

- **WHEN** a client posts a body that fails JSON parsing or schema validation to `/api/auth/login`
- **THEN** the handler SHALL return 400 without logging the request body or any environment-derived credential material

### Requirement: Post-login redirect is restricted to same-origin paths

The admin login page at `/admin/login` SHALL accept a `from` query parameter to remember the original destination, but SHALL navigate after a successful login only when `from` is a same-origin path. A value is considered same-origin only if it begins with a single `/` character and does not begin with `//`. Any other value (absolute URL, protocol-relative URL, `javascript:` URL, empty string, or missing parameter) SHALL fall back to `/admin`.

#### Scenario: Login with a safe relative from

- **WHEN** a user opens `/admin/login?from=/admin/stations` and successfully submits credentials
- **THEN** the page SHALL navigate to `/admin/stations`

#### Scenario: Login with an absolute external URL as from

- **WHEN** a user opens `/admin/login?from=https://evil.example` and successfully submits credentials
- **THEN** the page SHALL navigate to `/admin` and SHALL NOT navigate to `evil.example`

#### Scenario: Login with a protocol-relative URL as from

- **WHEN** a user opens `/admin/login?from=//evil.example/admin` and successfully submits credentials
- **THEN** the page SHALL navigate to `/admin` and SHALL NOT navigate to `evil.example`

#### Scenario: Login with no from parameter

- **WHEN** a user opens `/admin/login` (no `from`) and successfully submits credentials
- **THEN** the page SHALL navigate to `/admin`

#### Scenario: Login with a non-path scheme as from

- **WHEN** a user opens `/admin/login?from=javascript:alert(1)` and successfully submits credentials
- **THEN** the page SHALL navigate to `/admin` and SHALL NOT execute the `javascript:` URL
