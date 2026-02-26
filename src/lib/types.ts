export type PromptStatus = "draft" | "published";

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  coverImageUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: PromptStatus;
}

export type EventType = "copy" | "view";

export interface Event {
  id: string;
  type: EventType;
  promptId: string;
  createdAt: string;
}
