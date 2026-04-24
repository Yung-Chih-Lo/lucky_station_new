## MODIFIED Requirements

### Requirement: Explore page sidebar exposes pick history
Explore 頁面左側 SHALL 在有歷史紀錄時顯示最多 3 筆抽籤卡片。無歷史時側欄 SHALL 不顯示。每筆卡片顯示車站名稱、抽籤時間，以及 `comment_used` 狀態。

- 尚未留言的卡片 SHALL 連結至 `/comment?token={token}`
- 尚未留言的卡片 SHALL 顯示一個「未寫心得」的 badge，用以視覺化未完成狀態（Zeigarnik cue）
- 已留言的卡片 SHALL 置灰並顯示「已留言」badge，不可點擊
- 側欄 SHALL 顯示「僅限此瀏覽器，最多保留 3 筆」警語

#### Scenario: Panel is hidden when history is empty
- **WHEN** 使用者進入 Explore 頁面，`pick_history` 不存在或為空
- **THEN** 側欄 SHALL NOT 顯示抽籤紀錄 panel

#### Scenario: Panel shows active pick with link
- **WHEN** 使用者有一筆尚未留言的歷史紀錄
- **THEN** 側欄 SHALL 顯示該站名稱與抽籤時間
- **AND** 點擊後 SHALL 導向 `/comment?token={token}`

#### Scenario: Active card shows unfinished badge
- **WHEN** 一筆歷史紀錄的 token 的 `comment_used` 為 false（或尚未從 API 確認）
- **THEN** 對應卡片 SHALL 顯示一個標記為「未寫心得」的 badge
- **AND** 該 badge SHALL 與已留言卡片上的「已留言」badge 視覺對稱（同區塊、同形狀）
- **AND** 該 badge SHALL NOT 使用高飽和或動態效果（避免誤認為系統通知）

#### Scenario: Used pick is greyed out
- **WHEN** 一筆歷史紀錄的 token 的 `comment_used` 為 true
- **THEN** 對應卡片 SHALL 呈置灰樣式
- **AND** 卡片 SHALL 顯示「已留言」badge
- **AND** 卡片 SHALL 不可點擊
