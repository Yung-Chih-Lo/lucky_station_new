## MODIFIED Requirements

### Requirement: Result modal exposes a share action
The picker's result modal SHALL include a share action rendered inside the scan-cta card in the reveal footer. The action SHALL be labeled `分享給你的好友` regardless of device capability, and SHALL be styled as a solid-dark (primary-weight) Antd `Button`.

The action's *behavior* SHALL depend on whether the user's device is touch-capable:

- On touch-capable devices (`navigator.maxTouchPoints > 0`), activating the button SHALL invoke the Web Share API with the generated ticket PNG.
- On non-touch devices (desktop), activating the button SHALL write the ticket PNG to the system clipboard as a single `image/png` flavor, then show a confirmation toast.
- When neither path is available (missing API or runtime error that is not an `AbortError`), the app SHALL fall back to opening the ticket PNG URL in a new tab.

#### Scenario: Share button is present in modal and uses the unified label
- **WHEN** the result modal opens after a successful pick
- **THEN** the modal SHALL contain a visible share/copy button inside the scan-cta card
- **AND** the button label SHALL read `分享給你的好友`
- **AND** the button SHALL be reachable with keyboard focus
- **AND** the button SHALL render with a solid-dark background and light text (primary visual weight)

#### Scenario: Touch device uses native share
- **WHEN** the user activates the button on a device where `navigator.maxTouchPoints > 0` AND the browser supports `navigator.share` with file support
- **THEN** the app SHALL call `navigator.share({ files: [<png>], title, text })` with the generated ticket PNG
- **AND** it SHALL NOT write to the system clipboard
- **AND** it SHALL NOT open a new tab as a fallback

#### Scenario: Desktop copies a single PNG to the clipboard
- **WHEN** the user activates the button on a device where `navigator.maxTouchPoints === 0` AND the browser supports `navigator.clipboard.write` with `ClipboardItem`
- **THEN** the app SHALL call `navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])` with exactly one flavor
- **AND** the app SHALL show a visible confirmation (e.g. toast) that the image was copied
- **AND** it SHALL NOT call `navigator.share`

#### Scenario: Desktop paste targets receive exactly one image
- **WHEN** a desktop user has used the copy action and pastes into an application that inspects multiple clipboard flavors (e.g. Line Desktop, Notion)
- **THEN** exactly one ticket image SHALL be inserted into that application

#### Scenario: Fallback on unsupported browsers
- **WHEN** the selected path's API is unavailable (no `navigator.share`/`canShare` on touch, no `navigator.clipboard.write`/`ClipboardItem` on desktop), OR the call throws an error that is not an `AbortError`
- **THEN** the app SHALL open the ticket PNG URL in a new tab
- **AND** it SHALL provide a visible hint (e.g. copy text or keyboard instruction) for saving the image

#### Scenario: User cancels the native share sheet
- **WHEN** the user activates the button on a touch device and dismisses the share sheet, causing `navigator.share` to reject with an `AbortError`
- **THEN** the app SHALL NOT open a new tab
- **AND** the app SHALL NOT show an error toast
