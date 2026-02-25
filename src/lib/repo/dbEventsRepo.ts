import type { EventsRepo } from "./types";

// TODO: 接 Prisma/Postgres 後實作 EventsRepo
// - list(): 從 DB 查全部 (e.g. prisma.event.findMany())
// - add(event): prisma.event.create({ data: event })
// 注意：需在 Server Action 或 API route 內使用（Prisma 依環境變數 DATABASE_URL）

export const dbEventsRepo: EventsRepo = {
  list() {
    throw new Error("DbEventsRepo not implemented: use Prisma in server context");
  },
  add() {
    throw new Error("DbEventsRepo not implemented: use Prisma in server context");
  },
};
