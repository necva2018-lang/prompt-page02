# Prompt 圖書館 MVP — 檔案結構與開發順序

## 一、LocalStorage 資料模型

```ts
// 單一 prompt
interface Prompt {
  id: string;           // 例如 uuid 或 nanoid
  title: string;
  content: string;
  description?: string;
  tags?: string[];
  createdAt: string;    // ISO 8601
  updatedAt: string;
}

// 單次 copy 事件（用於 Trending）
interface CopyEvent {
  promptId: string;
  copiedAt: string;     // ISO 8601
}
```

**Storage keys：**
- `prompts` → `Prompt[]`
- `copyEvents` → `CopyEvent[]`

---

## 二、檔案結構

```
prompt-page-02/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根 layout（導航、footer）
│   │   ├── page.tsx                # 首頁
│   │   ├── globals.css
│   │   ├── prompts/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Prompt 詳情頁
│   │   └── admin/
│   │       └── page.tsx            # Admin 新增/編輯/刪除
│   ├── components/
│   │   ├── PromptCard.tsx          # 首頁與列表用卡片
│   │   ├── PromptList.tsx          # 列表 + Load more
│   │   ├── SearchBar.tsx           # 搜尋框
│   │   ├── TabNav.tsx              # Latest / Trending / Popular
│   │   ├── CopyButton.tsx          # 複製按鈕 + 紀錄 event
│   │   └── admin/
│   │       ├── PromptForm.tsx      # 新增/編輯表單
│   │       └── PromptTable.tsx     # 列表與刪除
│   ├── lib/
│   │   ├── storage.ts              # LocalStorage 讀寫（prompts + copyEvents）
│   │   ├── prompts.ts              # 取得 Latest/Trending/Popular、搜尋
│   │   └── types.ts                # Prompt, CopyEvent 等型別
│   └── hooks/
│       └── usePrompts.ts           # 可選：封裝資料與 Load more 邏輯
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 三、開發順序（由小到大，每步可跑）

### Step 0：專案初始化
- 在專案目錄執行（二擇一）：
  - **新專案：** `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - **或** 先 `npx create-next-app@latest prompt-library --ts --tailwind --eslint --app --src-dir`，再把本 repo 的 `src/lib`、`src/components` 等複製進去。
- 安裝完成後：`npm install` → `npm run dev`，開 http://localhost:3000。
- **可跑標準：** 首頁出現 Next.js 預設頁面。

---

### Step 1：型別與 LocalStorage 基礎
- 新增 `src/lib/types.ts`（`Prompt`, `CopyEvent`）。
- 新增 `src/lib/storage.ts`：
  - `getPrompts()`, `setPrompts()`
  - `getCopyEvents()`, `addCopyEvent()`
- 在 `storage.ts` 內做 **client-only** 判斷（`typeof window !== 'undefined'`），避免 SSR 讀 LocalStorage 報錯。
- 此步不接 UI，可寫一個簡單的 test 頁或 console 驗證讀寫。

**可跑標準：** 建一個臨時 route 或 component 在 mount 時讀寫 LocalStorage，無報錯。

---

### Step 2：首頁骨架 + 假資料
- 在 `storage.ts` 加 `seedPrompts()`：若 LocalStorage 無資料就寫入 5–10 筆假 prompt。
- 首頁 `app/page.tsx`：
  - 用 `useEffect` 在 client 呼叫 `getPrompts()` 並 `seedPrompts()` 若為空。
  - 先簡單列出標題（`<ul>` 或 div 列表即可）。
- 確保首頁只在 client 讀資料，避免 hydration 錯誤。

**可跑標準：** 開首頁看到假資料列表。

---

### Step 3：SearchBar + 搜尋邏輯
- `lib/prompts.ts`：`searchPrompts(prompts, query)`，依 title/description/content/tags 過濾。
- `components/SearchBar.tsx`：受控 input，onChange 回傳 query。
- 首頁接上 SearchBar，搜尋結果即時更新列表（仍用簡單列表即可）。

**可跑標準：** 輸入關鍵字後列表會過濾。

---

### Step 4：TabNav（Latest / Trending / Popular）
- `lib/prompts.ts`：
  - **Latest**：依 `createdAt` 排序。
  - **Trending**：依「最近 N 天內 copy 次數」排序（用 `copyEvents` 算）。
  - **Popular**：依「全部 copy 次數」排序。
- `components/TabNav.tsx`：三個 tab，點擊切換 active，回傳當前 tab。
- 首頁接上 TabNav，依 tab 選用對應的排序/篩選結果。

**可跑標準：** 切換 tab 會改變列表順序。

---

### Step 5：PromptCard + PromptList + Load more
- `components/PromptCard.tsx`：顯示 title、簡短 description、tags，點擊可連到 `/prompts/[id]`。
- `components/PromptList.tsx`：
  - 接收 `prompts`、`hasMore`、`onLoadMore`。
  - 顯示卡片列表，底部「Load more」按鈕，點擊呼叫 `onLoadMore`（例如每次多 10 筆）。
- 首頁改用 PromptList，實作分頁（例如 slice 0~pageSize*page，Load more 時 page+1）。

**可跑標準：** 首頁為卡片列表，可 Load more。

---

### Step 6：Prompt 詳情頁 + Copy 按鈕
- `app/prompts/[id]/page.tsx`：依 `id` 從 LocalStorage 取單一 prompt，顯示完整 content + title。
- `components/CopyButton.tsx`：
  - 點擊複製 content 到剪貼簿（`navigator.clipboard.writeText`）。
  - 複製成功後呼叫 `addCopyEvent(promptId)`，並可顯示「已複製」toast 或文字。
- 詳情頁放 CopyButton，傳入 `promptId` 與 `content`。

**可跑標準：** 進入詳情頁可複製，且 LocalStorage 的 `copyEvents` 會多一筆。

---

### Step 7：Admin 頁（新增/編輯/刪除）
- `app/admin/page.tsx`：僅 client 渲染，讀取 prompts 列表。
- `components/admin/PromptForm.tsx`：表單欄位 title、content、description、tags；送出時呼叫 `setPrompts()`（新增用 nanoid/uuid 生 id，編輯依 id 覆寫）。
- `components/admin/PromptTable.tsx`：表格列出所有 prompt，每行有「編輯」「刪除」；刪除時從陣列移除後 `setPrompts()`。
- 編輯：可導向 `/admin?edit=id` 或同一頁開 modal，表單預填該筆資料。

**可跑標準：** 可新增、編輯、刪除 prompt，重新整理或回首頁仍看到正確資料。

---

### Step 8：導航與收尾
- 在 `layout.tsx` 加簡單導航：首頁、Admin。
- 確認 Trending 使用 copyEvents、Latest 用 createdAt、Popular 用總 copy 次數。
- 可加簡單 404（找不到 prompt 時導回首頁或顯示訊息）。

---

## 四、注意事項

| 項目 | 說明 |
|------|------|
| SSR / hydration | 所有讀寫 LocalStorage 的邏輯放在 `useEffect` 或 client component，不要在 server component 直接讀。 |
| 初始資料 | 第一次造訪用 `seedPrompts()` 寫入假資料，之後以 LocalStorage 為準。 |
| Trending 視窗 | 例如「最近 7 天」的 copy 次數，常數可放在 `lib/prompts.ts` 頂部。 |
| ID 產生 | 可用 `crypto.randomUUID()` 或套件 `nanoid`。 |

---

## 五、建議實作順序總覽

```
Step 0 → 專案可跑
Step 1 → 型別 + storage 可讀寫
Step 2 → 首頁 + 假資料
Step 3 → 搜尋
Step 4 → Tabs (Latest / Trending / Popular)
Step 5 → 卡片列表 + Load more
Step 6 → 詳情頁 + Copy + 事件紀錄
Step 7 → Admin CRUD
Step 8 → 導航與收尾
```

依照此順序，每一步都可以單獨跑起來並驗證，再往下疊加。
