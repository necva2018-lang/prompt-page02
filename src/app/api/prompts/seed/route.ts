import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SEED_PROMPTS } from "@/lib/seedPrompts";

export async function POST() {
  try {
    for (const p of SEED_PROMPTS) {
      await prisma.prompt.upsert({
        where: { id: p.id },
        create: {
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description ?? "",
          content: p.content,
          coverImageUrl: p.coverImageUrl ?? "",
          tags: p.tags ?? [],
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          publishedAt: p.publishedAt ?? null,
          status: p.status ?? "draft",
        },
        update: {
          title: p.title,
          slug: p.slug,
          description: p.description ?? "",
          content: p.content,
          coverImageUrl: p.coverImageUrl ?? "",
          tags: p.tags ?? [],
          updatedAt: p.updatedAt,
          publishedAt: p.publishedAt ?? null,
          status: p.status ?? "draft",
        },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
