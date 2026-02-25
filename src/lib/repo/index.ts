import { localStoragePromptsRepo } from "./localStoragePromptsRepo";
import { localStorageEventsRepo } from "./localStorageEventsRepo";
// 接 Prisma/Postgres 時改為：
// import { dbPromptsRepo } from "./dbPromptsRepo";
// import { dbEventsRepo } from "./dbEventsRepo";
// 並將下方 promptsRepo / eventsRepo 改為 db 實例。

export const promptsRepo = localStoragePromptsRepo;
export const eventsRepo = localStorageEventsRepo;
