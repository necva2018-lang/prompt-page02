"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPrompts,
  upsertPrompt,
  deletePrompt,
  resetPromptsToSeed,
} from "@/lib/storage";
import { apiClient } from "@/lib/apiClient";
import { USE_API } from "@/lib/useApi";
import { slugify } from "@/lib/slugify";
import type { Prompt, PromptStatus } from "@/lib/types";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  tagsStr: "",
  content: "",
  status: "draft" as PromptStatus,
};

export default function AdminPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    if (USE_API) {
      apiClient.getPrompts().then(setPrompts);
    } else {
      setPrompts(getPrompts());
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selected = selectedId
    ? prompts.find((p) => p.id === selectedId)
    : null;

  const fillForm = (p: Prompt) => {
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      coverImageUrl: p.coverImageUrl || "",
      tagsStr: p.tags.join(", "),
      content: p.content,
      status: p.status,
    });
  };

  const handleNew = () => {
    setSelectedId(null);
    setForm(emptyForm);
  };

  const handleSelect = (p: Prompt) => {
    setSelectedId(p.id);
    fillForm(p);
  };

  const handleSave = async () => {
    const now = new Date().toISOString();
    const slug = (form.slug ?? "").trim() || slugify(form.title ?? "");
    const tags = (form.tagsStr ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const prompt: Prompt = {
      id: selectedId ?? "",
      title: (form.title ?? "").trim(),
      slug,
      description: (form.description ?? "").trim(),
      content: form.content ?? "",
      coverImageUrl: (form.coverImageUrl ?? "").trim(),
      tags,
      createdAt: selected?.createdAt ?? now,
      updatedAt: now,
      publishedAt: form.status === "published" ? now : selected?.publishedAt,
      status: form.status,
    };
    if (USE_API) {
      await apiClient.upsertPrompt(prompt);
      const list = await apiClient.getPrompts();
      const created = list.filter((p) => p.slug === slug).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      load();
      if (created) setSelectedId(created.id);
    } else {
      upsertPrompt(prompt);
      load();
      if (!selectedId) {
        const list = getPrompts().filter((p) => p.slug === slug);
        const created = list.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        if (created) setSelectedId(created.id);
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm("確定要刪除這則 prompt？")) return;
    if (USE_API) {
      await apiClient.deletePrompt(selectedId);
    } else {
      deletePrompt(selectedId);
    }
    load();
    setSelectedId(null);
    setForm(emptyForm);
  };

  const handleResetToSeed = async () => {
    if (!confirm("確定要重置為 10 筆案例？現有資料會被覆蓋。")) return;
    if (USE_API) {
      await apiClient.resetPromptsToSeed();
    } else {
      resetPromptsToSeed();
    }
    load();
    setSelectedId(null);
    setForm(emptyForm);
  };

  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-bg-page px-4 py-3">
        <h1 className="text-xl font-bold text-text-body">管理 Prompt</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToSeed}
            className="btn-secondary rounded px-3 py-1.5 text-sm"
          >
            重置為 10 筆案例
          </button>
          <Link href="/" className="link-primary text-sm">
            ← 回首頁
          </Link>
        </div>
      </div>

      <div className="flex gap-0 md:gap-4">
        {/* 左側列表 */}
        <aside className="w-64 shrink-0 border-r border-border bg-bg-page p-3">
          <button
            type="button"
            onClick={handleNew}
            className="btn-secondary mb-3 w-full py-2"
          >
            ＋ 新增
          </button>
          <ul className="space-y-1">
            {prompts.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(p)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    selectedId === p.id
                      ? "bg-secondary font-medium text-text-body"
                      : "text-text-muted hover:bg-secondary/50"
                  }`}
                >
                  <span className="line-clamp-1">{p.title || "（無標題）"}</span>
                  <span className="mt-0.5 block text-xs text-text-muted">
                    {p.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* 右側表單 */}
        <div className="min-w-0 flex-1 p-4">
          <div className="rounded-lg border border-border bg-bg-page p-4 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-muted">
                  title
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full rounded border border-border px-3 py-2 text-text-body"
                  placeholder="標題"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-muted">
                  slug（可手改）
                </label>
                <div className="flex gap-1">
                  <input
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slug: e.target.value }))
                    }
                    className="flex-1 rounded border border-border px-3 py-2 text-text-body"
                    placeholder="從標題自動產生"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, slug: slugify(f.title) }))
                    }
                    className="btn-secondary shrink-0 px-2 text-xs"
                  >
                    從標題
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-text-muted">
                coverImageUrl
              </label>
              <input
                value={form.coverImageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, coverImageUrl: e.target.value }))
                }
                className="w-full rounded border border-border px-3 py-2 text-text-body"
                placeholder="https://..."
              />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-text-muted">
                description
              </label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full rounded border border-border px-3 py-2 text-text-body"
                placeholder="描述..."
              />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-text-muted">
                tags（逗號分隔）
              </label>
              <input
                value={form.tagsStr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tagsStr: e.target.value }))
                }
                className="w-full rounded border border-border px-3 py-2 text-text-body"
                placeholder="文案, 行銷"
              />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-text-muted">
                content
              </label>
              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                rows={10}
                className="w-full rounded border border-border px-3 py-2 font-mono text-sm text-text-body"
                placeholder="Prompt 內容..."
              />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-muted">
                  status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as PromptStatus,
                    }))
                  }
                  className="rounded border border-border px-3 py-2 text-text-body"
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </div>
              <div className="flex gap-2 pt-6">
<button
                type="button"
                onClick={handleSave}
                className="btn-primary"
              >
                儲存
              </button>
                {selectedId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    刪除
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
