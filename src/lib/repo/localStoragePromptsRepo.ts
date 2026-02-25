"use client";

import type { Prompt } from "../types";
import type { PromptsRepo } from "./types";

const KEY = "prompts";

function isClient(): boolean {
  return typeof window !== "undefined";
}

function getRaw(): Prompt[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw == null || raw === "") return [];
    const parsed = JSON.parse(raw) as Prompt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setRaw(prompts: Prompt[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(prompts));
  } catch {
    // ignore
  }
}

/** 10 筆案例資料，方便測試首頁／詳情／變數／Admin。部分使用 {variable} 可測詳情頁變數替換。 */
const SEED: Prompt[] = [
  {
    id: "1",
    title: "一頁式產品文案",
    slug: "product-landing-copy",
    content:
      "你是一位資深文案。請為以下產品撰寫一頁式 landing page 文案，包含標題、三大賣點、CTA。\n\n產品：{product}\n目標客群：{audience}",
    coverImageUrl: "",
    tags: ["文案", "行銷"],
    createdAt: "2025-02-20T10:00:00.000Z",
    updatedAt: "2025-02-20T10:00:00.000Z",
    publishedAt: "2025-02-20T10:00:00.000Z",
    status: "published",
  },
  {
    id: "2",
    title: "程式碼重構建議",
    slug: "code-refactor-advice",
    content:
      "你是一位資深工程師。請檢視以下程式碼，列出可讀性與效能上的改進建議，並給出重構後的範例。\n\n```\n{code}\n```",
    coverImageUrl: "",
    tags: ["程式", "重構"],
    createdAt: "2025-02-21T10:00:00.000Z",
    updatedAt: "2025-02-21T10:00:00.000Z",
    publishedAt: "2025-02-21T10:00:00.000Z",
    status: "published",
  },
  {
    id: "3",
    title: "會議紀錄整理",
    slug: "meeting-notes-summary",
    content:
      "請將以下會議逐字稿整理成：1) 決議事項 2) 待辦與負責人 3) 下次會議時間。\n\n{transcript}",
    coverImageUrl: "",
    tags: ["會議", "整理"],
    createdAt: "2025-02-22T10:00:00.000Z",
    updatedAt: "2025-02-22T10:00:00.000Z",
    publishedAt: "2025-02-22T10:00:00.000Z",
    status: "published",
  },
  {
    id: "4",
    title: "英文郵件潤稿",
    slug: "english-email-edit",
    content:
      "你是一位專業英文編輯。請將以下郵件改寫得更正式、簡潔，並保留原意。\n\n{email}",
    coverImageUrl: "",
    tags: ["英文", "郵件"],
    createdAt: "2025-02-23T10:00:00.000Z",
    updatedAt: "2025-02-23T10:00:00.000Z",
    publishedAt: "2025-02-23T10:00:00.000Z",
    status: "published",
  },
  {
    id: "5",
    title: "使用者故事與驗收條件",
    slug: "user-story-ac",
    content:
      "請根據以下功能描述，產出 3～5 條使用者故事（User Story），每條附 2～3 項驗收條件（Acceptance Criteria）。\n\n功能：{feature}",
    coverImageUrl: "",
    tags: ["產品", "敏捷"],
    createdAt: "2025-02-24T10:00:00.000Z",
    updatedAt: "2025-02-24T10:00:00.000Z",
    publishedAt: "2025-02-24T10:00:00.000Z",
    status: "published",
  },
  {
    id: "6",
    title: "FAQ 生成",
    slug: "faq-generator",
    content:
      "請針對以下產品或服務，產出 5～8 個常見問題與簡潔回答。\n\n產品/服務：{description}",
    coverImageUrl: "",
    tags: ["文案", "FAQ"],
    createdAt: "2025-02-25T10:00:00.000Z",
    updatedAt: "2025-02-25T10:00:00.000Z",
    publishedAt: "2025-02-25T10:00:00.000Z",
    status: "published",
  },
  {
    id: "7",
    title: "SQL 查詢優化",
    slug: "sql-query-optimize",
    content:
      "你是一位 DBA。請分析以下 SQL 查詢，說明潛在效能問題並給出優化後的寫法。\n\n```sql\n{sql}\n```",
    coverImageUrl: "",
    tags: ["程式", "SQL"],
    createdAt: "2025-02-26T10:00:00.000Z",
    updatedAt: "2025-02-26T10:00:00.000Z",
    publishedAt: "2025-02-26T10:00:00.000Z",
    status: "published",
  },
  {
    id: "8",
    title: "簡報大綱產出",
    slug: "presentation-outline",
    content:
      "請為以下主題產出 10～15 頁的簡報大綱，每頁標題與 2～3 個 bullet。\n\n主題：{topic}\n對象：{audience}",
    coverImageUrl: "",
    tags: ["簡報", "行銷"],
    createdAt: "2025-02-27T10:00:00.000Z",
    updatedAt: "2025-02-27T10:00:00.000Z",
    publishedAt: "2025-02-27T10:00:00.000Z",
    status: "published",
  },
  {
    id: "9",
    title: "錯誤訊息改寫",
    slug: "error-message-rewrite",
    content:
      "請將以下技術錯誤訊息改寫成使用者能理解、並帶有建議下一步的說明。\n\n錯誤：{error}",
    coverImageUrl: "",
    tags: ["文案", "UX"],
    createdAt: "2025-02-28T10:00:00.000Z",
    updatedAt: "2025-02-28T10:00:00.000Z",
    publishedAt: "2025-02-28T10:00:00.000Z",
    status: "published",
  },
  {
    id: "10",
    title: "Commit 訊息撰寫",
    slug: "commit-message",
    content:
      "請根據以下程式變更，產出簡潔的 commit message（符合 Conventional Commits）。\n\n{diff}",
    coverImageUrl: "",
    tags: ["程式", "Git"],
    createdAt: "2025-03-01T10:00:00.000Z",
    updatedAt: "2025-03-01T10:00:00.000Z",
    publishedAt: "2025-03-01T10:00:00.000Z",
    status: "published",
  },
];

function ensureSeed(): void {
  if (!isClient()) return;
  const raw = localStorage.getItem(KEY);
  if (raw == null || raw === "" || raw === "[]") {
    setRaw(SEED);
  }
}

export const localStoragePromptsRepo: PromptsRepo = {
  list() {
    if (!isClient()) return [];
    ensureSeed();
    return getRaw();
  },
  getBySlug(slug) {
    if (!isClient()) return undefined;
    return this.list().find((p) => p.slug === slug);
  },
  upsert(prompt) {
    if (!isClient()) return;
    const list = this.list();
    const now = new Date().toISOString();
    const id = prompt.id || crypto.randomUUID();
    const base = { ...prompt, id, updatedAt: now };
    const idx = list.findIndex((p) => p.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...base };
    } else {
      list.push({ ...base, createdAt: prompt.createdAt || now });
    }
    setRaw(list);
  },
  delete(id) {
    if (!isClient()) return;
    setRaw(getRaw().filter((p) => p.id !== id));
  },
  resetToSeed() {
    if (!isClient()) return;
    setRaw(SEED);
  },
};
