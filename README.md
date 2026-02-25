# Prompt 圖書館

Next.js 打造的 Prompt 圖書館 MVP，可瀏覽、搜尋、管理與複製 Prompt，支援變數替換與即時預覽。

## 功能

- **首頁**：卡片式列表（4:6 比例、每列 3 張）、搜尋、分頁（Latest / Trending / Popular）
- **卡片**：封面圖（1:1）、分類標籤、複製次數、Copy 按鈕、一鍵複製全文
- **詳情頁**：填入變數、即時預覽、複製渲染結果
- **管理頁**：新增 / 編輯 / 刪除 Prompt，封面圖、標籤、狀態（draft / published）

## 技術棧

- **框架**：Next.js 14（App Router）
- **樣式**：Tailwind CSS、CSS 自訂屬性（企業藍主題）
- **語言**：TypeScript、React 18
- **資料**：目前為前端 LocalStorage（可替換為後端 API）

## 環境需求

- Node.js 18+（建議 LTS）
- npm 或 yarn

## 安裝與執行

### 方式一：指令

```bash
# 安裝依賴
npm install

# 開發模式（預設 port 3002）
npm run dev

# 建置
npm run build

# 正式環境執行
npm start
```

開發時在瀏覽器開啟：**http://localhost:3002**

### 方式二：Windows 一鍵腳本

雙擊 **`setup-and-run.bat`**，會自動檢查 Node.js、安裝依賴並啟動開發伺服器。

## 專案結構（精簡）

```
src/
  app/           # 頁面與 layout（首頁、管理、詳情）
  components/    # PromptCard、SearchBar、Tabs 等
  hooks/         # usePrompts
  lib/            # 型別、儲存、slug、變數解析
```

## 發布到 GitHub

1. 在 GitHub 建立新 repo（例如 `prompt-library`）。
2. 在本機專案目錄執行：

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Prompt 圖書館 MVP"
   git branch -M main
   git remote add origin https://github.com/<你的帳號>/<repo名稱>.git
   git push -u origin main
   ```

3. 若已有遠端，直接 `git push` 即可。

## 授權

MIT License（見 [LICENSE](LICENSE)）。
