"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { addEvent } from "@/lib/storage";
import { apiClient } from "@/lib/apiClient";
import { USE_API } from "@/lib/useApi";
import type { Prompt } from "@/lib/types";

type PromptCardProps = {
  prompt: Prompt;
  copyCount?: number;
  onCopy?: () => void;
};

function CopyIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default function PromptCard({ prompt, copyCount = 0, onCopy: onCopyCallback }: PromptCardProps) {
  const excerpt = prompt.content.split("\n")[0];
  const categoryLabel = prompt.tags[0]?.toUpperCase() ?? "PROMPT";
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(prompt.content).then(async () => {
        if (USE_API) {
          await apiClient.addEvent({
            id: crypto.randomUUID(),
            type: "copy",
            promptId: prompt.id,
            createdAt: new Date().toISOString(),
          });
        } else {
          addEvent({
            id: crypto.randomUUID(),
            type: "copy",
            promptId: prompt.id,
            createdAt: new Date().toISOString(),
          });
        }
        setJustCopied(true);
        setTimeout(() => setJustCopied(false), 2000);
        onCopyCallback?.();
      });
    },
    [prompt.id, prompt.content, onCopyCallback]
  );

  return (
    <article className="card-prompt flex w-full flex-col overflow-hidden rounded-2xl bg-[#1a1d21] shadow-lg transition hover:shadow-xl aspect-[4/6]">
      <Link href={`/p/${prompt.slug}`} className="flex min-h-0 flex-1 flex-col">
        {/* 圖片區：固定 1:1 正方形 */}
        <div className="relative w-full flex-shrink-0 aspect-square bg-[#0d0f11]">
          {prompt.coverImageUrl ? (
            <img
              src={prompt.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#5e6c84] text-sm">
              無封面
            </div>
          )}
          {/* 左上：分類藥丸 */}
          <span className="card-pill absolute left-3 top-3">
            {categoryLabel}
          </span>
          {/* 右上：愛心 + 次數 */}
          <span className="card-pill absolute right-3 top-3 flex items-center gap-1.5">
            <HeartIcon />
            <span>{copyCount}</span>
          </span>
        </div>

        {/* 文字描述區（原本訊息樣式） */}
        <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
          <h3 className="font-medium text-white">{prompt.title}</h3>
          {excerpt ? (
            <p className="mt-1 line-clamp-2 text-sm text-[#b0b8c1]">
              {excerpt}
            </p>
          ) : null}
        </div>
      </Link>

      {/* 底部操作區：Copy 鈕 + By 來源 */}
      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={handleCopy}
          className="card-btn-outline inline-flex items-center gap-2"
          aria-label="複製內容"
        >
          <CopyIcon />
          <span>{justCopied ? "已複製" : "Copy"}</span>
        </button>
        <span className="card-pill card-pill-outline text-xs">
          By Prompt 圖書館
        </span>
      </div>
    </article>
  );
}
