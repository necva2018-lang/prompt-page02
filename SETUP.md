# Next.js App Router 專案初始化步驟

## 1. 建立專案

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

或指定資料夾名稱：

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-app
```

依提示選擇：ESLint、Tailwind、`src/` 目錄、App Router、`@/*` 別名。

---

## 2. 目錄結構（本專案）

```
src/
├── app/
│   ├── layout.tsx          # 根 layout（導航）
│   ├── page.tsx            # 首頁
│   ├── globals.css
│   ├── p/
│   │   └── [slug]/
│   │       └── page.tsx    # 詳情頁 /p/:slug
│   └── admin/
│       └── page.tsx        # 管理頁
├── components/
│   ├── PromptCard.tsx
│   ├── Tabs.tsx
│   └── SearchBar.tsx
└── lib/
    └── data.ts             # 假資料與型別
```

---

## 3. 啟動

```bash
npm install
npm run dev
```

瀏覽器開啟：**http://localhost:3002**（或預設 3000）

---

## 4. 路由對照

| 路徑 | 說明 |
|------|------|
| `/` | 首頁：SearchBar + Tabs + PromptCard 列表（假資料 3 筆） |
| `/p/[slug]` | 詳情頁：依 slug 顯示單一 prompt |
| `/admin` | 管理頁：列出假資料（尚未接 LocalStorage） |

目前全部使用 **假資料**（`src/lib/data.ts` 的 `FAKE_PROMPTS`），未使用 LocalStorage。
