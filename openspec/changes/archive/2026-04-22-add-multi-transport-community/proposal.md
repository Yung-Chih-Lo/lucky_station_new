## Why

目前專案只支援台北捷運抽站，但姊妹專案 `lucky_station` 已累積全台鐵 291 站的資料、既有匿名留言與排行榜社群。各自維運會分散使用者聲量、重複維護兩套技術棧（一邊 TS+Drizzle、一邊 JSX+raw SQL）。將兩者合併並引入多運輸類型抽象，能集中社群活動、減半維運成本，並為未來擴展（高鐵、輕軌）預留結構。

## What Changes

- **BREAKING**：`stations` 與 `lines` 表新增 `transport_type` 欄位（`mrt` | `tra`），唯一鍵從 `name_zh` 改為複合 `(name_zh, transport_type)`
- 新增 291 筆台鐵車站資料（來自 `lucky_station` 的 `stations.json`），含 `county` 欄位
- 新增社群層三張表：`station_picks`（抽站紀錄 + token）、`comments`（綁定 token 的匿名留言）、`rate_limits`（IP 級時間窗節流）
- 新增 5 個 API endpoint：`POST /api/pick`、`GET /api/comments`、`GET|POST /api/comments/[token]`、`GET /api/stats`
- 新增首頁 Tab 切換：捷運模式（既有 SchematicMap 深色）/ 台鐵模式（搬移 lucky_station 的縣市選擇 + 台灣 SVG 地圖，玻璃擬態亮色）
- 新增 3 個共用頁面：`/explore`（留言列表，可篩選運輸類型）、`/stats`（排行榜，預設總榜，可切換捷運/台鐵）、`/comment?token=xxx`（一次性留言表單）
- 一次性遷移既有 `lucky_station.db` 的 picks 與 comments 至新 schema（透過 `station_name + county` 對應到新 `station_id`），保留現有社群聲量
- 沿用既有 admin auth、Drizzle migration、CSP/HSTS、Docker entrypoint，不引入新基礎設施

## Capabilities

### New Capabilities

- `community-engagement`：跨運輸類型共用的社群層 — token 化抽站、一次性匿名留言、IP rate limit、車站熱度排行榜
- `tra-station-picker`：台鐵專屬的選站互動模式 — 縣市多選 + 台灣 SVG 地圖、從選定縣市內隨機抽站、玻璃擬態主題

### Modified Capabilities

- `metro-data-layer`：從捷運專用擴展為多運輸類型資料層 — stations / lines 加 `transport_type` 與 `county`，唯一鍵改為複合鍵，sed 種子流程支援 mrt + tra 兩來源
- `visual-identity`：新增第二套主題（台鐵玻璃擬態亮色）與 Tab 切換時的主題切換機制；共用頁面（explore / stats / comment）固定使用既有捷運深色主題

## Impact

**Schema / Migration**
- `lib/db/schema.ts`：擴展 stations / lines、新增三張表
- 新增 Drizzle migration 與一次性資料遷移腳本（讀取 `lucky_station.db`）
- 既有捷運站資料需 backfill `transport_type='mrt'`

**Code**
- 新增 `lib/community/`（token 生成、rate limit、pick 邏輯）
- 新增 `app/api/pick/`、`app/api/comments/`、`app/api/comments/[token]/`、`app/api/stats/`
- 新增 `app/explore/`、`app/stats/`、`app/comment/`
- 新增 `components/tra/`（Sidebar、TaiwanSvgMap、ResultDisplay 從 lucky_station TSX 化）
- 既有 `components/HomeClient.tsx` 加入 Tab 切換邏輯
- 既有 `lib/theme.ts` 擴展為支援雙主題

**Dependencies**
- 新增 `@svg-maps/taiwan.main`（台灣縣市 SVG）
- React 維持 18，**不**升級至 19
- 不引入 styled-components（lucky_station 的 styled-components 一律改寫為既有 CSS-in-JS / globals.css）

**Infrastructure**
- Dockerfile 與 docker-entrypoint.sh：DB 初始化新增資料遷移步驟（首次啟動偵測 `lucky_station.db` 並匯入）
- CSP headers：若引入新外部資源需評估
- Admin 後台：未在本 change 範圍內新增 picks/comments 管理介面（後續 change 處理）

**Out of Scope**
- 台鐵的路網結構視覺化（schematic rendering 僅捷運）
- 台鐵車站的 admin 編輯器（station-editor 僅捷運）
- 高鐵、輕軌、客運等其他運輸類型
- 留言審核 / 違規檢舉 / 用戶帳號系統
