import type { Prompt, Event } from "./types";

const BASE = "";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export const apiClient = {
  async getPrompts(): Promise<Prompt[]> {
    return get<Prompt[]>("/api/prompts");
  },
  async getPromptBySlug(slug: string): Promise<Prompt | null> {
    const res = await fetch(`${BASE}/api/prompts/by-slug/${encodeURIComponent(slug)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async upsertPrompt(prompt: Prompt): Promise<void> {
    await post("/api/prompts", prompt);
  },
  async deletePrompt(id: string): Promise<void> {
    await del(`/api/prompts/${encodeURIComponent(id)}`);
  },
  async resetPromptsToSeed(): Promise<void> {
    const res = await fetch(`${BASE}/api/prompts/seed`, { method: "POST" });
    if (!res.ok) throw new Error(await res.text());
  },
  async getEvents(): Promise<Event[]> {
    return get<Event[]>("/api/events");
  },
  async addEvent(event: Event): Promise<void> {
    await post("/api/events", event);
  },
};

export async function getCopyCountMapFromApi(): Promise<Record<string, number>> {
  const events = await apiClient.getEvents();
  const map: Record<string, number> = {};
  events.forEach((e) => {
    if (e.type === "copy") map[e.promptId] = (map[e.promptId] ?? 0) + 1;
  });
  return map;
}
