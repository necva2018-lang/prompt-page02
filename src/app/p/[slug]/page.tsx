"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { getPromptBySlug, addEvent } from "@/lib/storage";
import { parseVariables, renderPrompt } from "@/lib/promptVariables";
import type { Prompt } from "@/lib/types";

export default function PromptDetailPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [prompt, setPrompt] = useState<Prompt | null | undefined>(undefined);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug == null || slug === "") {
      setPrompt(null);
      return;
    }
    setPrompt(getPromptBySlug(slug) ?? null);
  }, [slug]);

  const variables = useMemo(
    () => (prompt ? parseVariables(prompt.content) : []),
    [prompt]
  );

  useEffect(() => {
    if (prompt && variables.length > 0) {
      setVariableValues((prev) => {
        const next = { ...prev };
        for (const v of variables) {
          if (!(v in next)) next[v] = "";
        }
        return next;
      });
    }
  }, [prompt, variables]);

  const renderedPrompt = useMemo(() => {
    if (!prompt) return "";
    return renderPrompt(prompt.content, variableValues, "empty");
  }, [prompt, variableValues]);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(renderedPrompt);
      addEvent({
        id: crypto.randomUUID(),
        type: "copy",
        promptId: prompt.id,
        createdAt: new Date().toISOString(),
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const clearVariables = () => {
    setVariableValues((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) next[k] = "";
      return next;
    });
  };

  if (prompt === undefined) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse rounded-lg bg-secondary p-6 text-text-muted">載入中…</div>
      </main>
    );
  }
  if (prompt === null) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="link-primary mb-4 inline-block text-sm">
        ← 回首頁
      </Link>
      <article className="rounded-lg border border-border bg-bg-page shadow-sm">
        {prompt.coverImageUrl ? (
          <img
            src={prompt.coverImageUrl}
            alt=""
            className="h-40 w-full rounded-t-lg object-cover"
          />
        ) : null}
        <div className="p-6">
          <h1 className="text-xl font-bold text-text-body">{prompt.title}</h1>
          {prompt.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-secondary px-2 py-0.5 text-xs text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* 變數輸入區塊 */}
          {variables.length > 0 && (
            <section className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-body">
                  填入變數（即時預覽下方結果）
                </h2>
                <button
                  type="button"
                  onClick={clearVariables}
                  className="btn-secondary px-2.5 py-1 text-xs"
                >
                  一鍵清空
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {variables.map((name) => (
                  <label key={name} className="block">
                    <span className="mb-1 block text-xs font-medium text-text-muted">
                      {name}
                    </span>
                    <input
                      type="text"
                      value={variableValues[name] ?? ""}
                      onChange={(e) =>
                        setVariableValues((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                      placeholder={`{${name}}`}
                      className="w-full rounded border border-border bg-bg-page px-3 py-2 text-sm text-text-body placeholder-text-muted focus:border-[var(--primary-color)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* 預覽：渲染後的 prompt */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-text-muted">
                {variables.length > 0 ? "預覽（Copy 會複製此內容）" : "內容"}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-primary disabled:opacity-70"
              >
                {copied ? "已複製" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-secondary/30 p-4 text-sm text-text-body">
              {renderedPrompt}
            </pre>
          </div>
        </div>
      </article>
    </main>
  );
}
