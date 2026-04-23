# admin-auth Specification

## Purpose
Admin authentication for the site: a single admin identity sourced from environment variables, server-side credential verification with argon2id, an `iron-session` cookie, and middleware that gates `/admin/*` and `/api/admin/*` routes.
## Requirements
### Requirement: Admin credentials configured via environment variables
The system SHALL derive the single admin identity from environment variables `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH`. The password hash SHALL be an argon2id hash. The raw password SHALL NOT appear in source code, in any client-side bundle, or in logs.

#### Scenario: Required env vars are missing at startup
- **WHEN** the server starts without `ADMIN_USERNAME` or `ADMIN_PASSWORD_HASH` set
- **THEN** the process SHALL fail fast with a clear error message identifying the missing variable
- **AND** the login endpoint SHALL NOT be reachable in a degraded fallback mode

#### Scenario: Password hash is inspected from the client
- **WHEN** any visitor downloads the public JavaScript bundle
- **THEN** neither the admin username nor the password hash SHALL appear in that bundle

### Requirement: Login endpoint verifies credentials server-side
The system SHALL expose `POST /api/auth/login` which accepts `{username, password}`, verifies them server-side against the configured username and argon2id hash, and on success sets an `iron-session` cookie. The cookie SHALL be `httpOnly`, `secure` (in production), `sameSite=lax`, and signed/encrypted with `SESSION_SECRET`.

#### Scenario: Correct credentials
- **WHEN** a client posts the correct username and password to `/api/auth/login`
- **THEN** the response SHALL be 200 with a `Set-Cookie` header establishing an authenticated session
- **AND** subsequent requests carrying that cookie SHALL be treated as authenticated

#### Scenario: Incorrect credentials
- **WHEN** a client posts an incorrect username or password
- **THEN** the response SHALL be 401
- **AND** no session cookie SHALL be set
- **AND** the error message SHALL NOT reveal whether the username or the password was the incorrect field

#### Scenario: Malformed request body
- **WHEN** the request body is missing `username` or `password`, or is not valid JSON
- **THEN** the response SHALL be 400
- **AND** no session cookie SHALL be set

### Requirement: Logout endpoint clears the session
The system SHALL expose `POST /api/auth/logout` which clears the session cookie regardless of prior state.

#### Scenario: Authenticated user logs out
- **WHEN** an authenticated client posts to `/api/auth/logout`
- **THEN** the response SHALL include a `Set-Cookie` header that expires the session cookie
- **AND** subsequent requests using the old cookie SHALL be treated as unauthenticated

#### Scenario: Unauthenticated request to logout
- **WHEN** a client with no session cookie posts to `/api/auth/logout`
- **THEN** the response SHALL be 200 (idempotent)

### Requirement: Middleware protects admin routes and admin API
Next.js middleware SHALL check for a valid session cookie on every request to `/admin/*` and `/api/admin/*`. Unauthenticated requests to `/admin/*` SHALL be redirected to `/admin/login`. Unauthenticated requests to `/api/admin/*` SHALL receive a 401 JSON response.

#### Scenario: Unauthenticated visitor opens an admin page
- **WHEN** a visitor without a session cookie requests `/admin` or any path under `/admin/`
- **THEN** the response SHALL be a redirect to `/admin/login`
- **AND** the original destination SHALL be preserved so login can return to it

#### Scenario: Unauthenticated mutation attempt
- **WHEN** a client without a session cookie sends any request to a path under `/api/admin/`
- **THEN** the response SHALL be 401 with a JSON error body
- **AND** the backing handler SHALL NOT execute any database mutation

#### Scenario: Authenticated request
- **WHEN** a client with a valid session cookie requests `/admin` or `/api/admin/*`
- **THEN** the middleware SHALL pass the request through to the route handler

### Requirement: Session cookie cannot be forged or bypassed client-side
The session SHALL be established only by the server after a successful credential check. Manipulating client-side storage (including `localStorage`, `sessionStorage`, or unsigned cookies) SHALL NOT grant admin access.

#### Scenario: Attacker sets a plausible cookie manually
- **WHEN** a client sets a cookie whose value is not a valid `iron-session` payload signed by `SESSION_SECRET`
- **THEN** middleware SHALL treat the request as unauthenticated

#### Scenario: Session cookie from a prior `SESSION_SECRET`
- **WHEN** `SESSION_SECRET` is rotated and a client presents a cookie signed by the previous secret
- **THEN** middleware SHALL treat the request as unauthenticated

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

