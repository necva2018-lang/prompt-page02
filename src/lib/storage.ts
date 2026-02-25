"use client";

import { promptsRepo, eventsRepo } from "./repo";
import type { Prompt, Event } from "./types";

export function getPrompts(): Prompt[] {
  return promptsRepo.list();
}

export function getPromptBySlug(slug: string): Prompt | undefined {
  return promptsRepo.getBySlug(slug);
}

export function upsertPrompt(prompt: Prompt): void {
  promptsRepo.upsert(prompt);
}

export function deletePrompt(id: string): void {
  promptsRepo.delete(id);
}

/** 重置 prompts 為內建 10 筆案例（僅 LocalStorage 時有效） */
export function resetPromptsToSeed(): void {
  promptsRepo.resetToSeed?.();
}

export function getEvents(): Event[] {
  return eventsRepo.list();
}

export function addEvent(event: Event): void {
  eventsRepo.add(event);
}

/** 回傳各 prompt 的複製次數 { promptId: count } */
export function getCopyCountMap(): Record<string, number> {
  const events = eventsRepo.list();
  const map: Record<string, number> = {};
  events.forEach((e) => {
    if (e.type === "copy") {
      map[e.promptId] = (map[e.promptId] ?? 0) + 1;
    }
  });
  return map;
}
