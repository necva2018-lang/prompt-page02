"use client";

import { useState, useEffect, useMemo } from "react";
import { getPrompts, getEvents } from "@/lib/storage";
import type { Prompt, Event } from "@/lib/types";
import type { TabId } from "@/components/Tabs";

const PAGE_SIZE = 12;
const TRENDING_DAYS = 7;

function filterByQuery(prompts: Prompt[], query: string): Prompt[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...prompts];
  return prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

function sortByLatest(prompts: Prompt[]): Prompt[] {
  return [...prompts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function sortByPopular(prompts: Prompt[], events: Event[]): Prompt[] {
  const copyCount: Record<string, number> = {};
  for (const e of events) {
    if (e.type !== "copy") continue;
    copyCount[e.promptId] = (copyCount[e.promptId] ?? 0) + 1;
  }
  return [...prompts].sort((a, b) => (copyCount[b.id] ?? 0) - (copyCount[a.id] ?? 0));
}

function sortByTrending(prompts: Prompt[], events: Event[]): Prompt[] {
  const cutoff = Date.now() - TRENDING_DAYS * 24 * 60 * 60 * 1000;
  const score: Record<string, number> = {};
  for (const e of events) {
    if (new Date(e.createdAt).getTime() < cutoff) continue;
    const id = e.promptId;
    if (!score[id]) score[id] = 0;
    if (e.type === "copy") score[id] += 3;
    else if (e.type === "view") score[id] += 1;
  }
  return [...prompts].sort((a, b) => (score[b.id] ?? 0) - (score[a.id] ?? 0));
}

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabId>("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const all = getPrompts();
    setPrompts(all.filter((p) => p.status === "published"));
    setEvents(getEvents());
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, tab]);

  const filteredAndSorted = useMemo(() => {
    const filtered = filterByQuery(prompts, query);
    if (tab === "latest") return sortByLatest(filtered);
    if (tab === "popular") return sortByPopular(filtered, events);
    return sortByTrending(filtered, events);
  }, [prompts, events, query, tab]);

  const visible = useMemo(
    () => filteredAndSorted.slice(0, page * PAGE_SIZE),
    [filteredAndSorted, page]
  );
  const hasMore = visible.length < filteredAndSorted.length;

  const loadMore = () => setPage((p) => p + 1);

  return {
    prompts: visible,
    hasMore,
    loadMore,
    query,
    setQuery,
    tab,
    setTab,
    isEmpty: filteredAndSorted.length === 0,
  };
}
