import type { Prompt, Event } from "../types";

export interface PromptsRepo {
  list(): Prompt[];
  getBySlug(slug: string): Prompt | undefined;
  upsert(prompt: Prompt): void;
  delete(id: string): void;
  /** 重置為內建 seed（僅 LocalStorage 實作有意義） */
  resetToSeed?(): void;
}

export interface EventsRepo {
  list(): Event[];
  add(event: Event): void;
}
