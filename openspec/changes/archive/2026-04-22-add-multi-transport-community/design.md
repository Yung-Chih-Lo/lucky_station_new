## Context

- 既有 `lucky_taipei_mrt`：Next.js 15 App Router + better-sqlite3 + Drizzle ORM + antd 5 + iron-session admin auth + Docker。Schema 為捷運專用：`stations`、`lines`、`station_lines`、`connections`、`canvas_config`，`stations.name_zh` 為唯一鍵。公開頁透過 React Server Component 直查 DB。視覺識別 spec 已穩定（dark indigo + gold + glassmorphism + Noto Serif/Sans TC）。
- 來源 `lucky_station`：Next.js 15 + JSX + raw SQL + styled-components 玻璃擬態亮色主題。三張社群表（`station_picks`、`comments`、`rate_limits`）以 `station_name + county` 字串作為車站身份。已有運行資料：含使用者抽站紀錄與匿名留言。互動模式為「縣市多選 → 從台灣 SVG 地圖點擊或勾選縣市 → 隨機抽站 → token → 留言」。
- 約束：合併必須在 `lucky_taipei_mrt` 內進行（技術棧成熟），社群資料須遷移而非丟棄，React 維持 18，不引入 styled-components，admin / CSP / Docker 結構不動。

## Goals / Non-Goals

**Goals:**
- 一份 schema 容納捷運 + 台鐵 + 未來其他運輸類型；社群資料用單一 `station_id` FK 串接，排行榜跨類型查詢一行 SQL 解決。
- 既有 `lucky_station.db` 的 picks 與 comments 透過一次性遷移腳本進入新 schema，舊 token URL 仍可解析（保留現有聲量）。
- 兩種運輸類型各保有原生視覺與互動模式：捷運用既有 SchematicMap 深色，台鐵用 lucky_station 的縣市選擇 + Taiwan SVG 玻璃擬態亮色。
- 共用頁面（`/explore`、`/stats`、`/comment`）固定使用捷運深色主題，避免 Tab 切換主題的副作用外溢。
- 零新增 dependency（除 `@svg-maps/taiwan.main`），styled-components 一律改寫為既有 CSS-in-JS / CSS variables。

**Non-Goals:**
- 不做台鐵的路網結構視覺化（沒有 schematic 座標、沒有 connections）。
- 不做台鐵車站的 admin 編輯（station-editor 仍只服務捷運）。
- 不做留言審核、違規檢舉、用戶帳號、留言編輯/刪除。
- 不做 admin 後台的社群資料管理介面（picks/comments 的後台 CRUD 留待後續 change）。
- 不做高鐵、輕軌、客運等其他運輸類型的支援（schema 預留欄位，但 enum 此次只接受 `mrt`/`tra`）。
- 不做 Tab 之間的偏好同步（最多 localStorage 記住上次選的 Tab，無跨裝置同步）。

## Decisions

### D1. 單一 `stations` 表加 `transport_type`，不分表
**選擇：** `stations` 與 `lines` 各自新增 `transport_type TEXT NOT NULL CHECK (transport_type IN ('mrt','tra'))`。`stations` 唯一鍵從單欄 `UNIQUE(name_zh)` 改為**兩個 partial unique index**（見 D13 跨縣市同名問題）：
```sql
CREATE UNIQUE INDEX uniq_mrt_name ON stations(name_zh) WHERE transport_type = 'mrt';
CREATE UNIQUE INDEX uniq_tra_name_county ON stations(name_zh, county) WHERE transport_type = 'tra';
```
`station_lines.line_code` FK 仍指向 `lines.code`，但語意上同一個 station 只會 join 同 type 的 lines（資料層強制不易，靠 seed 與 admin 流程把關）。

**為什麼不分表：** 若拆成 `mrt_stations` / `tra_stations`，`station_picks.station_id` 必須變成 polymorphic FK（station_id + station_type），破壞 FK 完整性，排名查詢需 UNION，社群 API 處處要 switch type。單表 + type 欄位是 SQL 經典反模式 STI（Single Table Inheritance）的合理使用：兩種 station 共用 95% 欄位（name、county、lat/lng），只有 schematic_x/y / label_* 是捷運專用（tra 留 NULL）。

**為什麼用 partial unique index 而非單一複合唯一鍵：** 若用 `UNIQUE(name_zh, transport_type, county)`：mrt rows 的 `county` 為 NULL，SQLite NULL ≠ NULL，兩個 mrt 的「中山」站就不會衝突 → 喪失 mrt 唯一性。Partial index 對 mrt / tra 分別套用不同欄位組合，最乾淨。

**Alternative considered：** Polymorphic association（station_id + station_type pair）— 拒絕，破壞 SQLite FK 機制，且排名 / 留言 / pick 查詢處處要帶 type，每個 join 多一個條件。

### D2. `stations.county` 設為 nullable，但 tra rows 必填（應用層 + partial unique index 保證）
**選擇：** Schema 層面 `county TEXT`（允許 NULL），由 seed 與 admin 流程保證 `transport_type = 'tra'` 的 rows 必有 county。捷運 rows 留 NULL（捷運範圍跨台北市+新北市，county 對選站邏輯無意義）。D1 的 `uniq_tra_name_county` partial index 隱含要求 tra 的 county 非 NULL（否則無法去重）。

**為什麼不在 DB 層加 partial NOT NULL CHECK：** SQLite 不支援 partial CHECK constraint。Drizzle 層用 zod 在 seed / admin / migration 入口驗證即可，違反者直接拒絕寫入。

### D3. `lines` 表也加 `transport_type`，但 tra 此版本不 seed lines
**選擇：** `lines` 新增 `transport_type` 欄位，台鐵 stations 的 `station_lines` 此版本留空。未來若要做台鐵路線篩選（西部幹線/東部幹線），再 seed `lines` + `station_lines`。

**為什麼現在加欄位但不用：** 避免未來再來一次 BREAKING migration。lucky_station 的 pick 邏輯只用 county 不用 line，現在零工作量。

### D4. 社群層三張表的 FK 設計
```ts
station_picks {
  id              INTEGER PK AUTOINCREMENT
  station_id      INTEGER NOT NULL FK → stations.id ON DELETE CASCADE
  transport_type  TEXT NOT NULL CHECK ('mrt','tra')   // 冗欄，加速排名 group by
  token           TEXT NOT NULL UNIQUE
  picked_at       INTEGER NOT NULL                     // unix ms
  comment_used    INTEGER NOT NULL DEFAULT 0          // 0/1
}

comments {
  id          INTEGER PK AUTOINCREMENT
  pick_id     INTEGER NOT NULL FK → station_picks.id ON DELETE CASCADE
  station_id  INTEGER NOT NULL FK → stations.id ON DELETE CASCADE   // 冗欄
  content     TEXT NOT NULL
  created_at  INTEGER NOT NULL
}

rate_limits {
  ip            TEXT NOT NULL
  window_start  TEXT NOT NULL                          // "YYYY-MM-DDTHH:MM" 或 ":HH"
  scope         TEXT NOT NULL CHECK ('pick','comment')  // 取代 lucky_station 的 'comment:' 前綴
  count         INTEGER NOT NULL DEFAULT 1
  PRIMARY KEY (ip, window_start, scope)
}
```

**`comments.station_id` 為什麼冗存：** ranking 查詢 `SELECT station_id, COUNT(*) FROM comments GROUP BY station_id` 不需 join `station_picks`，從 70K 筆留言到查 top 100 站差距明顯。

**`station_picks.transport_type` 為什麼冗存：** 排行榜分捷運 / 台鐵時 `WHERE transport_type = ?` 比 join `stations` 快，且 stations.id 不會跨 type 混淆。

**`rate_limits.scope` 取代字串前綴：** lucky_station 把 `comment:` 拼到 `ip` 欄位裡是 hack。獨立 `scope` 欄位讓主鍵語意清楚，索引更乾淨。

### D5. 一次性既有資料遷移：獨立腳本，非 startup hook
**選擇：** 提供 `scripts/migrate-legacy.ts`（執行 `npm run migrate:legacy -- --src=/path/to/lucky_station.db`），讀來源 SQLite → 對應 `(station_name, county)` 至新 `stations.id` → 寫入新 schema。**不**在 docker-entrypoint 自動執行。

**Mapping 策略：**
1. 從來源 `station_picks` 取 distinct `(station_name, county)` 集合
2. 對每筆查詢 `SELECT id FROM stations WHERE name_zh = ? AND county = ? AND transport_type = 'tra'`（**因 lucky_station 跨縣市同名，必須 county 一起當 join key**，見 D13）
3. 找不到 → 寫入 `migration-report.json` 待人工處理（理論上應該 0 筆，因新 schema 由同份 stations.json seed；若有則代表 lucky_station 有 stations.json 之外的歷史資料）
4. 對應成功後：依序遷移 `station_picks`（保留原 token、picked_at、comment_used）→ `comments`（用 token 反查 pick_id）→ 跳過 `rate_limits`（時效性資料，不遷）
5. 用 transaction 包整個流程，遷完印出 summary。失敗 rollback。

**為什麼不放 entrypoint 自動跑：** 自動化等於風險。一次性遷移應該是「人類確認 backup → 跑命令 → 看 report → 部署」，自動觸發若 report 有 unmatched 行為不可逆。

**Alternative considered：** 把舊 db 路徑寫進環境變數，entrypoint 偵測檔案存在就跑 —— 拒絕，違反 explicit-over-implicit。

### D6. Token 與 honeypot 規格不變
**選擇：** Token 用 `crypto.randomUUID()`（Node.js 原生，無新 dep）。Honeypot 欄位名沿用 `honeypot`。長度限制 10–500 字。一個 token 只能留一次言（`comment_used` flag）。

**為什麼不換 token 格式：** 既有遷入的 token 必須保留可解析，否則舊 URL 失效。新 token 用相同 UUID v4 格式，新舊不可區分（這是好事）。

### D7. Rate limit：固定窗（fixed window），按 IP + scope
**選擇：** 沿用 lucky_station 的 fixed window 算法（不是 sliding）。
- pick scope：每分鐘 5 次，`window_start` 取至分鐘 `YYYY-MM-DDTHH:MM`
- comment scope：每小時 10 次，`window_start` 取至小時 `YYYY-MM-DDTHH`
- IP 取得順序：`cf-connecting-ip` → `x-forwarded-for`（first hop）→ `request.ip`。沒有就用 `unknown`，與其他 unknown 共用配額（保守）。
- 過期清理：每次寫入順手 `DELETE FROM rate_limits WHERE window_start < ?`（cutoff 為 2 個窗之前）。

**為什麼不換 sliding window：** Sliding 需要 redis 或計算成本高。Fixed window + 2 個 unit 容忍誤差對抽站 / 留言的 abuse 場景已夠。

**警告寫進 spec：** 同一辦公室 NAT 後面共用 IP → 整辦公室一分鐘只能抽 5 次。可接受（這不是大型公開服務）。

### D8. Theme 切換：route-aware + Tab-aware ConfigProvider
**選擇：**
- 新增 `lib/theme/index.ts`，匯出 `mrtTheme`、`traTheme` 兩組 brand token + antd ThemeConfig。既有 `lib/theme.ts` 改名 `lib/theme/mrt.ts`。
- 新增 `components/ThemeProvider.tsx`：根據 `mode` prop（`mrt` | `tra`）切換 `<ConfigProvider>` + 在 `<html>` 設 `data-theme="mrt"|"tra"`。
- `app/layout.tsx`：admin 路由維持原樣（無 brand theme）。`app/(public)/layout.tsx` 依 pathname 決策：
  - `/`：交給 `HomeClient` 內部 Tab state 動態切（`<ThemeProvider mode={tab}>`）
  - `/explore`、`/stats`、`/comment`：強制 `mode="mrt"`
- CSS：兩主題的 token 都寫在 `app/globals.css`，用 `[data-theme="tra"] { --brand-bg: ... }` 覆蓋。Noto Serif TC / Noto Sans TC 兩主題共用。

**為什麼共用頁面強制 mrt 主題：**
1. `/stats` 預設總榜混合兩種類型，沒有「正確」的主題色，選一個穩定的避免每次切換閃爍。
2. mrt 深色是既有設計、已通過視覺 spec 驗證，作為 default 風險最低。
3. 留言 token 不知道是 mrt 還是 tra（雖然可查 DB），為簡化 SSR 流程不做動態切換。

**Tab 狀態持久化：** `localStorage.lastTransportTab`，預設 `mrt`。SSR 第一次必為 mrt（避免 hydration mismatch），客戶端 mount 後若 localStorage 有 `tra` 才切。

### D9. Tra picker UI：搬移而非重設計，但去 styled-components
**選擇：**
- `components/tra/Sidebar.tsx`：縣市多選 checkbox + 「抽幸運車站」CTA。從 lucky_station/components/Sidebar.jsx 改寫為 TSX，styled-components 改成 antd Checkbox.Group + 既有 CSS variables 自定樣式（透過 CSS Modules 或 globals.css 加 class）。
- `components/tra/TaiwanSvgMap.tsx`：包裝 `@svg-maps/taiwan.main`，受 `selectedCounties` 控制縣市高亮。styled-components 的 SVG 樣式改寫為 styled JSX 或 globals.css class。
- `components/tra/ResultDisplay.tsx`：抽中後 modal 內容（含車站名稱閃爍動畫 → 揭示）。動畫用 CSS keyframes 寫在 `app/globals.css`，不引入 emotion / framer-motion。

**為什麼不直接在 SchematicMap 加台鐵模式：** 兩者根本不同形（捷運是路網拓撲，台鐵是地理分區）。共用 component 會做出兩邊都妥協的怪東西。獨立 component、共用 ResultDisplay 邏輯（token 生成、跳轉留言頁）即可。

**Glass 主題 CSS（tra-only token）：**
```
[data-theme="tra"] {
  --brand-bg: linear-gradient(...玻璃擬態亮色...);
  --brand-surface: rgba(255,255,255,0.65);
  --brand-text: #1a1a2e;
  --brand-accent: #F97316;  /* lucky_station 原 CTA 橙色 */
  --blur-amount: 15px;
}
```

### D10. API 路由與既有 admin API 並存
**選擇：** 公開社群 API 放 `/api/pick`、`/api/comments`、`/api/comments/[token]`、`/api/stats`（不加 `/community/` 前綴，與 lucky_station 對齊降低遷移風險、舊 URL/分享連結可能依然有人持有）。Admin API 維持 `/api/admin/*` 不變。

**新增 `lib/community/` 模組：**
- `token.ts`：UUID 生成 + 驗證
- `rate-limit.ts`：IP 取得 + fixed window + scope
- `pick.ts`：給定 transport_type / 篩選條件，從 stations 抽一筆
- `validators.ts`：zod schema for pick / comment payloads

### D11. Seed 資料：tra stations 從 lucky_station/constants/stations.json 複製到 scripts/seed-data/tra-stations.json
**選擇：** 把 lucky_station 的 `constants/stations.json`（291 站，含 county + station_name）原樣 copy 到 `scripts/seed-data/tra-stations.json`，新增 `npm run seed:tra` 命令。
- Seed 邏輯：對每筆 `INSERT OR IGNORE INTO stations (name_zh, transport_type, county) VALUES (?, 'tra', ?)`
- 原本的 `npm run seed`（捷運 seed）需在 INSERT 加 `transport_type='mrt'`（既有資料 backfill 由 migration 處理，新 fresh DB 由 seed 寫對）
- 不嘗試從外部 API 取資料（簡單、可離線、可 review diff）

### D12. Migration 順序與 backwards compat
**Drizzle migration 步驟：**
1. `ALTER TABLE stations ADD COLUMN transport_type TEXT`
2. `UPDATE stations SET transport_type = 'mrt'` (backfill)
3. 因 SQLite 無 `ALTER COLUMN`、且要從單欄 UNIQUE 改成 partial index，需 rebuild：`CREATE TABLE stations_new ... (CHECK transport_type IN ('mrt','tra'), 不在表定義 UNIQUE name_zh)` → `INSERT INTO stations_new SELECT ...` → `DROP stations` → `RENAME stations_new TO stations` → `CREATE UNIQUE INDEX uniq_mrt_name ON stations(name_zh) WHERE transport_type='mrt'` → `CREATE UNIQUE INDEX uniq_tra_name_county ON stations(name_zh, county) WHERE transport_type='tra'`
4. 同樣處理 `lines` 加 `transport_type`、backfill `'mrt'`（lines 唯一鍵維持 `code` 主鍵不變，無 partial index 需求）
5. `ALTER TABLE stations ADD COLUMN county TEXT`
6. `CREATE TABLE station_picks (...)` `CREATE TABLE comments (...)` `CREATE TABLE rate_limits (...)`
7. 建 index：`CREATE INDEX idx_station_picks_token ON station_picks(token)`、`idx_comments_station_id`、`idx_station_picks_station_id`、`idx_rate_limits_window` 等

**Drizzle 慣例：** 用 `drizzle-kit generate` 產 SQL migration，手動編輯為上述 rebuild 步驟（drizzle 自動產生對 SQLite 的 ALTER 唯一鍵不可行；partial index 也需手寫）。

### D13. TRA 跨縣市同名站處理
**問題：** 來源 `lucky_station/constants/stations.json` 把邊界車站重複列在多個縣市的清單裡，至少 11 個站名跨縣市重複（七堵、百福、暖暖、池上、後壁、九曲堂、枋山、和平、二水、日南、追分 等）。這不是真的有兩座同名站，而是「使用者選任一邊縣市都能抽到該邊界站」的 UX 設計。

**選擇：** 忠於來源資料行為，把 `(name_zh, county)` 視為 tra 的複合身份。Seed 後實際會有 ~270 筆 unique tra rows（291 - 約 20 重複）。同一物理站若同時屬於兩縣市則存兩 rows，各自獨立 station_id。

**為什麼這樣選：**
- 使用者在 TRA 的「新北市」清單看到「七堵」抽到了，與在「基隆市」清單看到「七堵」抽到了，從 UX 角度是兩個不同事件（雖然物理站一樣），各自累積排行榜次數合理。
- Seed 邏輯最簡單（無需去重判斷哪個縣市才對）。
- Migration 對應 `(station_name, county)` 不會歧義。

**代價：**
- 排行榜中「七堵」會出現兩次（基隆市版 + 新北市版），各算各的 pick_count。可接受，因為使用者本來就是分縣市選的。
- 若未來想合併同物理站的統計，需另立 `physical_station_id` 欄位再做一次正規化（不在本 change 範圍）。

**Alternative considered：**
- Seed 去重只留第一個出現的 county：失真，使用者選新北市抽不到「七堵」。拒絕。
- 引入「物理站」與「使用者站」兩層 schema：過度工程化，違反 user 偏好「最少工作量」。拒絕。

## Risks / Trade-offs

- **遷移 unmatched rows**：lucky_station 的舊資料若有錯字 / 簡繁體不一致 station_name，新 stations 表查不到。→ Migration 腳本輸出 `migration-report.json` 列出 unmatched，人工清理或加映射檔。預期 0 筆（因 seed 用同來源），但要驗證。
- **跨縣市同名站排行榜重複（D13 副作用）**：「七堵」「池上」等站會在排行榜出現兩次（基隆市版 + 新北市版各算各的 pick_count）。視覺上可能混淆，但語意正確（使用者本來就是分縣市選的）。→ Mitigation：UI 顯示時站名後接縣市 tag（如「七堵 [基隆市]」），讓使用者一眼分辨。
- **STI 表結構代價**：tra rows 永遠 NULL 的 schematic_x/y/label_x/label_y/label_anchor 欄位浪費空間（每筆 ~40 bytes），291 筆 × 40 = ~12KB，可忽略。但 schema 讀來不雅。→ 接受，比 polymorphic FK 健康。
- **Tab 切換的視覺跳動**：mrt 深色 ↔ tra 亮色之間切換約 200ms 內背景色巨變，可能刺眼。→ Mitigation：切換時加 `transition: background 200ms ease` 在 `<html>` / `<body>` 上，緩衝對比。Tab 動畫本身可考慮先褪到中間色再進入新主題（追加優化，不在 v1 範圍）。
- **Rate limit 在 NAT/proxy 後失準**：辦公室共用 IP 全員共享配額。→ 接受。社群類流量低，誤殺成本低於引入帳號系統。
- **/stats 總榜效能**：comments 表大時 GROUP BY 慢。→ Mitigation：`station_picks.station_id` 與 `transport_type` 加 composite index，limit 100，初期百萬筆內可接受；之後加 materialized view 或 cache。
- **既有 lucky_station 用戶的舊 URL**：`/comment?token=xxx` 路徑與 query 名稱保持一致 → 舊連結不會壞。但若 lucky_station 部署的 domain 不同，跨 domain redirect 不在本 change 範圍。
- **CSS variables 雙主題的特異性戰爭**：`[data-theme="tra"]` 覆蓋 root 變數時，若 antd ConfigProvider 與 CSS variables 不同步可能視覺撞色。→ Mitigation：兩主題的 antd ThemeConfig 與 CSS variables 都從同一 `lib/theme/index.ts` 匯出，保證源頭一致。

## Migration Plan

**Phase 1：Schema + Seed（不上線）**
1. 寫 Drizzle schema 與 migration（D12）
2. 在 dev 跑 `npm run migrate` + 既有 `npm run seed`（mrt）+ 新增 `npm run seed:tra`，驗證 stations 表有 118 mrt + 291 tra
3. 寫 `scripts/migrate-legacy.ts`，給 lucky_station.db sample 跑 dry-run 驗證 mapping report

**Phase 2：API + UI（feature branch）**
4. 實作 `lib/community/*`、5 個 API endpoints + zod 驗證
5. 實作 `components/tra/*` + ThemeProvider
6. 實作 `app/(public)/explore/`、`stats/`、`comment/` + 修改 `HomeClient.tsx` 加 Tab

**Phase 3：上線部署**
7. PR review + merge to main
8. 部署：`docker compose up -d --build`，新 schema migration 自動跑
9. 手動執行：`docker exec ... npm run seed:tra`（首次填台鐵）
10. 手動執行：`docker exec ... npm run migrate:legacy -- --src=/data/legacy/lucky_station.db`（一次性遷舊資料）→ 看 report
11. 驗證 `/`、`/explore`、`/stats`、`/comment?token=<舊token>` 都正常
12. 把 lucky_station 舊站設 redirect 至新 domain（在本 repo 範圍外）

**Rollback：**
- Phase 1/2 失敗：revert PR、不影響 prod。
- Phase 3 schema migration 失敗：Docker entrypoint 應 fail fast、container 不啟。回上一版 image，DB 因 migration 包在 transaction 應未變動。
- Phase 3 legacy migration 失敗：transaction rollback、無資料寫入、修腳本再跑。
- 已上線後發現 tra 路徑有 bug：可關閉 Tab UI（feature flag 不需，直接 hide tra Tab 即可），mrt 流程不受影響。

## Open Questions

- **Q1（已解決 2026-04-22）：tra stations 的 lat/lng 是否必要 seed？** 答：lucky_station 的 `constants/stations.json` 結構為 `{ "縣市": ["站名", ...] }`，**完全沒有座標**。tra rows 的 `lat`/`lng` 留 NULL；TaiwanSvgMap 只需縣市分區也夠用；Wiki / Google Maps 連結用站名 query 即可。同步發現跨縣市同名站問題，已記入 D13。
- **Q2：Wiki / Google Maps 連結對台鐵站適用嗎？** ResultDisplay 既有兩個外連結 button，捷運站名能 query 到 wiki。台鐵站名（如「七堵」「八堵」）也能但格式可能不同。→ 接受 best-effort，連結壞的話使用者體感不嚴重
- **Q3：admin auth 要不要保護 `/api/stats`、`/api/explore`？** 預設不保護（公開資訊）。但若想避免爬蟲，加 rate limit 即可。→ 預設不保護，等真有問題再說
- **Q4：legacy migration 是否一併把 lucky_station 既有的 `rate_limits` 帶過來？** 預設不帶（時效性資料），以新部署的當下時間為起點。確認無爭議再下決定。→ 預設不遷
