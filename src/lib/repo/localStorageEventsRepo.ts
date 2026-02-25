"use client";

import type { Event } from "../types";
import type { EventsRepo } from "./types";

const KEY = "events";

function isClient(): boolean {
  return typeof window !== "undefined";
}

function getRaw(): Event[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw == null || raw === "") return [];
    const parsed = JSON.parse(raw) as Event[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setRaw(events: Event[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

export const localStorageEventsRepo: EventsRepo = {
  list() {
    return getRaw();
  },
  add(event) {
    if (!isClient()) return;
    const events = getRaw();
    events.push(event);
    setRaw(events);
  },
};
