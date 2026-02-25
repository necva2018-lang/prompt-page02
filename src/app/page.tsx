"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Tabs from "@/components/Tabs";
import PromptCard from "@/components/PromptCard";
import { usePrompts } from "@/hooks/usePrompts";
import { getCopyCountMap } from "@/lib/storage";
import { getCopyCountMapFromApi } from "@/lib/apiClient";
import { USE_API } from "@/lib/useApi";

export default function HomePage() {
  const {
    prompts,
    hasMore,
    loadMore,
    query,
    setQuery,
    tab,
    setTab,
    isEmpty,
  } = usePrompts();
  const [copyRefresh, setCopyRefresh] = useState(0);
  const [copyCountMap, setCopyCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (USE_API) {
      getCopyCountMapFromApi().then(setCopyCountMap);
    } else {
      setCopyCountMap(getCopyCountMap());
    }
  }, [prompts, copyRefresh]);
  const onCopy = useCallback(() => setCopyRefresh((r) => r + 1), []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text-body">Prompt 圖書館</h1>
      <div className="mb-4">
        <SearchBar value={query} onChange={setQuery} />
      </div>
      <div className="mb-6">
        <Tabs active={tab} onChange={setTab} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isEmpty ? (
          <li className="col-span-full rounded-lg border border-border bg-bg-page p-6 text-center text-text-muted">
            沒有符合的 prompt
          </li>
        ) : (
          prompts.map((p) => (
            <li key={p.id} className="flex">
              <PromptCard prompt={p} copyCount={copyCountMap[p.id] ?? 0} onCopy={onCopy} />
            </li>
          ))
        )}
      </ul>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="btn-primary"
          >
            Load more
          </button>
        </div>
      )}
    </main>
  );
}
