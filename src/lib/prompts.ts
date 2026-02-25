import type { Prompt } from "./types";

/**
 * 依關鍵字搜尋 prompts（title、description、content、tags）
 * 空白 query 回傳全部
 */
export function searchPrompts(prompts: Prompt[], query: string): Prompt[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...prompts];
  return prompts.filter((p) => {
    const title = (p.title ?? "").toLowerCase();
    const desc = (p.description ?? "").toLowerCase();
    const content = (p.content ?? "").toLowerCase();
    const tags = (p.tags ?? []).join(" ").toLowerCase();
    return (
      title.includes(q) ||
      desc.includes(q) ||
      content.includes(q) ||
      tags.includes(q)
    );
  });
}
