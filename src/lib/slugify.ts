/** 由 title 產生 slug：小寫、空白改為連字、僅保留英文數字與連字 */
export function slugify(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
  return s.replace(/-+/g, "-").replace(/^-|-$/g, "") || "untitled";
}
