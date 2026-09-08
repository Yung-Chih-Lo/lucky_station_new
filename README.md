# 坐火行 (chò-hué kiânn) 🚆

> **專案狀態：公開上線，持續使用中。**

不知道今天去哪？選幾條路線，讓命運決定你的下一站。

「坐火行」是隨機抽站應用程式，支援**台北捷運**與**台鐵**。選擇捷運路線或台鐵縣市，抽出今天的目的地。

## 功能特色

- 捷運路線篩選與路線圖、台鐵縣市篩選與台灣地圖。
- 隨機抽站、抽籤動畫與站點資訊連結。
- PNG 籤紙分享；依裝置與瀏覽器支援，可分享檔案、複製圖片或開啟圖片儲存。
- 抽站紀錄、旅人心得、站點留言接力與排行榜。
- 響應式介面，以及登入後使用的站點管理後台。

## 安裝與設定

使用 Next.js 15 App Router、React、TypeScript、Ant Design、SQLite 與 Drizzle ORM。儲存庫的 Dockerfile 與 .nvmrc 使用 Node.js 20。

### 1. 安裝依賴

```bash
git clone https://github.com/Yung-Chih-Lo/lucky_station_new.git
cd lucky_station_new
npm ci
```

### 2. 環境變數

複製 [.env.example](.env.example) 為 .env.local，填入自己的設定。

| 變數 | 用途 |
| --- | --- |
| DATABASE_PATH | SQLite 路徑，本機預設使用 ./data/metro.db |
| ADMIN_USERNAME | 後台管理員帳號 |
| ADMIN_PASSWORD_HASH | 管理員密碼的 Argon2 hash |
| SESSION_SECRET | Session 加密 secret，至少 32 字元 |
| NEXT_PUBLIC_SITE_URL | 本機可用 http://localhost:3000，正式站填實際 HTTPS 網址 |

```bash
npm run hash-password -- 'your-password'
openssl rand -base64 48
```

第一個指令輸出可直接貼入 .env.local 的完整 ADMIN_PASSWORD_HASH 設定行，已將每個美元符號跳脫，請保留輸出格式。第二個指令可產生 SESSION_SECRET；需有 OpenSSL 可用。

### 3. 初始化資料庫

```bash
npm run migrate
npm run seed
npm run seed:tra
```

migrate 套用既有資料表遷移；seed 匯入捷運資料，seed:tra 匯入台鐵資料，來源位於 scripts/seed-data/。

CLI migration／seed 直接讀取程序的 DATABASE_PATH，不會自動載入 .env.local；未設定時使用 ./data/metro.db。若使用自訂路徑，請先在 shell 設定相同的 DATABASE_PATH。

### 4. 啟動開發伺服器

```bash
npm run dev
```

- 公開頁：<http://localhost:3000>
- 管理後台：<http://localhost:3000/admin>
- 旅人心得與排行榜：/explore、/stats

## Docker 部署

使用根目錄的 [Dockerfile](Dockerfile)，預設監聽 3000 埠，資料庫路徑為 /data/metro.db。[docker-entrypoint.sh](docker-entrypoint.sh) 先套用 migration，再分別執行捷運與台鐵 seed，最後啟動 Next.js。

- 將持久儲存空間掛載到 /data，保留站點、抽站與留言資料。
- 在部署平台設定上述環境變數；正式站使用實際 HTTPS 網址。
- 直接注入平台環境變數時，密碼 hash 使用原始 Argon2 值；.env.local 所需的反斜線跳脫不應原樣放入平台環境變數。
- 啟動會修改資料庫 schema，更新前先備份資料庫；seed 設計為可重複執行。
- 舊版 lucky_station 資料匯入不會自動執行，流程見 [資料遷移文件](docs/migration.md)。匯入前先備份並檢查 dry-run 報告；回復正式資料時使用備份，不要把刪除所有台鐵紀錄當成只撤銷某一次匯入。

## 開發檢查

```bash
npm test
npm run build
```

另有 npm run test:seed 與 npm run test:community，使用獨立測試資料庫。這兩個 npm script 使用 POSIX 環境變數語法，Windows 可透過 WSL／相容 shell 執行。

## 授權與致謝

本專案使用 [MIT License](LICENSE.txt)。

地圖素材致謝：[svg-maps](https://github.com/VictorCazanave/svg-maps)。

## 如何貢獻

歡迎提交 [Issue](https://github.com/Yung-Chih-Lo/lucky_station_new/issues) 或發起 [Pull Request](https://github.com/Yung-Chih-Lo/lucky_station_new/pulls)。
