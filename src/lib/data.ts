import type { Prompt } from "@/lib/types";

/** 假資料 3 筆，先不接 LocalStorage */
export const FAKE_PROMPTS: Prompt[] = [
  {
    id: "1",
    title: "一頁式產品文案",
    slug: "product-landing-copy",
    content:
      "你是一位資深文案。請為以下產品撰寫一頁式 landing page 文案，包含標題、三大賣點、CTA。\n\n產品：{{產品名稱}}\n目標客群：{{客群}}",
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
      "你是一位資深工程師。請檢視以下程式碼，列出可讀性與效能上的改進建議，並給出重構後的範例。\n\n```\n{{貼上程式碼}}\n```",
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
      "請將以下會議逐字稿整理成：1) 決議事項 2) 待辦與負責人 3) 下次會議時間。\n\n{{逐字稿內容}}",
    coverImageUrl: "",
    tags: ["會議", "整理"],
    createdAt: "2025-02-22T10:00:00.000Z",
    updatedAt: "2025-02-22T10:00:00.000Z",
    publishedAt: "2025-02-22T10:00:00.000Z",
    status: "published",
  },
];

export function getPromptBySlug(slug: string): Prompt | undefined {
  return FAKE_PROMPTS.find((p) => p.slug === slug);
}
