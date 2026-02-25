# 部署 Prompt 圖書館到 Zeabur（含資料庫）

## 一、前置

- 專案已推送到 GitHub（例如 `necva2018-lang/prompt-page02`）
- 已安裝 [Zeabur CLI](https://zeabur.com/docs/cli) 或使用 Zeabur 網頁

## 二、在 Zeabur 建立專案與服務

1. 登入 [Zeabur](https://zeabur.com)，點 **Create Project**。
2. **Add Service** → 選 **Deploy from GitHub**，選擇你的 repo（例如 `prompt-page02`）。
3. Zeabur 會偵測為 Next.js 並開始建置。先不要設環境變數。

## 三、加入 PostgreSQL 資料庫

1. 在同一個專案裡點 **Add Service**。
2. 選 **Database** → **PostgreSQL**。
3. 建立後，Zeabur 會提供該資料庫的連線變數（如 `POSTGRES_HOST`、`POSTGRES_USERNAME`、`POSTGRES_PASSWORD`、`POSTGRES_DATABASE`、`POSTGRES_CONNECTION_STRING`）。

## 四、把資料庫連到 Next.js 服務

1. 點你的 **Next.js 服務**（不是資料庫）。
2. 進入 **Variables**（環境變數）。
3. 新增或編輯：
   - **DATABASE_URL**：  
     若 Zeabur 有提供 `POSTGRES_CONNECTION_STRING`，可直接設為：
     ```bash
     ${POSTGRES_CONNECTION_STRING}
     ```
     或手動組：
     ```bash
     postgresql://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}
     ```
   - **NEXT_PUBLIC_USE_API**：設為 **`true`**（前端會改呼叫 API，使用資料庫）。
4. 若 Zeabur 有「連結服務」或「Reference」功能，可改為引用資料庫服務的變數（同上名稱即可）。

## 五、建置與啟動

專案已包含 `zbpack.json`：

- **建置**：`npx prisma generate && npm run build`
- **啟動**：`npx prisma migrate deploy && _startup`（會先跑資料庫 migration 再啟動 Next.js）

首次部署後，Zeabur 會依此執行；若建置或啟動失敗，請到服務的 **Logs** 查看錯誤。

## 六、本機用資料庫（選用）

1. 複製環境變數範例：
   ```bash
   cp .env.example .env
   ```
2. 在 `.env` 填上本機或遠端 PostgreSQL 的 `DATABASE_URL`。
3. 若要本機也用 API（與 Zeabur 行為一致），設：
   ```bash
   NEXT_PUBLIC_USE_API=true
   ```
4. 執行 migration 與開發伺服器：
   ```bash
   npx prisma migrate dev
   npm run dev
   ```

## 七、常見問題

- **建置失敗**：確認 Logs 是否報 Prisma 或 Node 版本問題；Zeabur 通常使用 Node 18+。
- **啟動失敗 / 連不到資料庫**：確認該服務的 `DATABASE_URL` 是否正確、與 Zeabur 上 PostgreSQL 服務的變數一致。
- **前端仍用 localStorage**：確認環境變數 `NEXT_PUBLIC_USE_API=true` 已設在 Zeabur 的 Next.js 服務上，並重新部署。
