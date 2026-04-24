## MODIFIED Requirements

### Requirement: Relay API returns latest comment excerpt for a station
系統 SHALL 提供 `GET /api/stations/[id]/relay` endpoint，回傳該站最新一則已通過的留言資料與總留言數，以支援 result modal 的「前旅人隨筆」卡片與「首旅人」彩蛋狀態切換。

回應格式：
```json
{
  "excerpt": string | null,
  "handle": string | null,
  "postedAt": string | null,
  "count": number
}
```

欄位語意：
- `excerpt`：最新一則留言 `content` 的前 50 個字元（UTF-16 codeunit），若原文超過 50 字則結尾加 `…`。若該站尚無留言，值為 `null`。
- `handle`：最新一則留言的 `comments.id`，以 `String(id).padStart(4, '0')` 格式化（例如 `"0417"`）。該欄位用於 UI 組字成 `#0417` 呈現。若無留言，值為 `null`。
- `postedAt`：最新一則留言的 `created_at`，以 ISO 8601 字串表示。若無留言，值為 `null`。
- `count`：該 station 的留言總數（`COUNT(*)`），型別為整數；若無留言則為 `0`。

若 `station_id` 不存在於 `stations` 表，回應 SHALL 為 404（與先前行為一致）。

#### Scenario: Station has at least one comment
- **WHEN** `GET /api/stations/42/relay` 且 station 42 有至少一則留言
- **THEN** 回應 SHALL 為 200
- **AND** `excerpt` SHALL 等於最新留言 `content` 的前 50 字元（含 `…` 若有截斷）
- **AND** `handle` SHALL 等於該最新留言 `id` 以 `padStart(4, '0')` 格式化後的字串
- **AND** `postedAt` SHALL 等於該最新留言的 `created_at`，以 ISO 8601 字串格式
- **AND** `count` SHALL 等於 station 42 的留言總數（≥ 1 的整數）

#### Scenario: Station has no comments
- **WHEN** `GET /api/stations/42/relay` 且 station 42 無任何留言
- **THEN** 回應 SHALL 為 200
- **AND** `excerpt` SHALL 為 `null`
- **AND** `handle` SHALL 為 `null`
- **AND** `postedAt` SHALL 為 `null`
- **AND** `count` SHALL 為 `0`

#### Scenario: Station does not exist
- **WHEN** `GET /api/stations/99999/relay` 且 99999 不存在於 stations 表
- **THEN** 回應 SHALL 為 404

### Requirement: Result page displays relay excerpt when available
捷運與台鐵的 result modal SHALL 在 station id 已知後透過 `<RevealRitual>` 發起 relay API request。UI 根據回應中的 `count` 欄位切換兩種卡片：

- 當 `count > 0`：SHALL 顯示 `<RelayExcerptCard>`，包含 `前 旅 人 隨 筆` eyebrow、excerpt 引文、`— 旅人 #<handle> · <relative time>` footer、以及 `更多 <count - 1> 則 →` 連結（當 `count >= 2` 時）。
- 當 `count === 0`：SHALL 顯示 `<FirstArrivalCard>`（彩蛋狀態）。

若 fetch 失敗或回傳非 2xx，result modal SHALL NOT 顯示任何上半區卡片，不影響既有 UI 佈局（下半區 ScanCtaCard 仍會以保守預設文案呈現）。

#### Scenario: Relay card appears when count > 0
- **WHEN** 使用者抽到車站，且該站有留言
- **THEN** modal 的上半區 SHALL 顯示 `<RelayExcerptCard>` 含 `excerpt`、`#<handle>`、相對時間
- **AND** 當 `count >= 2`，card 內 SHALL 包含 `更多 <count - 1> 則 →` 連結
- **AND** 下半區 `<ScanCtaCard>` SHALL 使用 `relay` headline 變體（`換你 / 寫下此站心得`）

#### Scenario: First-arrival card appears when count === 0
- **WHEN** 使用者抽到車站，且該站無留言
- **THEN** modal 的上半區 SHALL 顯示 `<FirstArrivalCard>` 含虛線框與彩蛋文案
- **AND** 下半區 `<ScanCtaCard>` SHALL 使用 `first` headline 變體（`成為此站 / 第一位留言者`）

#### Scenario: Relay fetch failure leaves upper zone empty
- **WHEN** relay API 請求逾時或回傳非 2xx
- **THEN** modal 上半區 SHALL NOT 顯示任何卡片
- **AND** 下半區 `<ScanCtaCard>` SHALL 顯示但使用保守文案（預設 `first` 變體）
- **AND** SHALL NOT 顯示錯誤訊息

## ADDED Requirements

### Requirement: Relay API response shape is backward compatible with prior excerpt-only consumers
The extended response shape SHALL be additive only: existing fields SHALL retain their current types and semantics, and new fields (`handle`, `postedAt`, `count`) SHALL be added alongside without renaming or removing `excerpt`.

#### Scenario: Excerpt field retains prior type and semantics
- **WHEN** a legacy consumer reads only `excerpt` from the response
- **THEN** the field SHALL have type `string | null`
- **AND** the value SHALL be derived from the latest comment with the same 50-character truncation rule previously in effect
