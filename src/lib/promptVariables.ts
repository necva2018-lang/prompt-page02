/**
 * 從 prompt 內容中解析出所有 {variable}，去重、排序。
 * 僅匹配 { 與 } 之間的英文/數字/底線（不含空白）。
 */
export function parseVariables(content: string): string[] {
  const re = /\{([a-zA-Z0-9_]+)\}/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    set.add(m[1]);
  }
  return Array.from(set).sort();
}

export type UnfilledStrategy = "empty" | "keep";

/**
 * 將 content 內所有 {var} 替換成 values[var]。
 * - empty：沒填的變數替換成空字串（預設）
 * - keep：沒填的變數保留原樣 {var}
 */
export function renderPrompt(
  content: string,
  values: Record<string, string>,
  strategy: UnfilledStrategy = "empty"
): string {
  const re = /\{([a-zA-Z0-9_]+)\}/g;
  return content.replace(re, (_, name) => {
    const v = values[name]?.trim();
    if (v !== undefined && v !== "") return v;
    return strategy === "keep" ? `{${name}}` : "";
  });
}
