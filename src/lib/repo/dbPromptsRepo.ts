import type { PromptsRepo } from "./types";

// TODO: 接 Prisma/Postgres 後實作 PromptsRepo
// - list(): 從 DB 查全部 (e.g. prisma.prompt.findMany())
// - getBySlug(slug): prisma.prompt.findUnique({ where: { slug } })
// - upsert(prompt): prisma.prompt.upsert(...)
// - delete(id): prisma.prompt.delete({ where: { id } })
// 注意：需在 Server Action 或 API route 內使用（Prisma 依環境變數 DATABASE_URL）

export const dbPromptsRepo: PromptsRepo = {
  list() {
    throw new Error("DbPromptsRepo not implemented: use Prisma in server context");
  },
  getBySlug() {
    throw new Error("DbPromptsRepo not implemented: use Prisma in server context");
  },
  upsert() {
    throw new Error("DbPromptsRepo not implemented: use Prisma in server context");
  },
  delete() {
    throw new Error("DbPromptsRepo not implemented: use Prisma in server context");
  },
};
