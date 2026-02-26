import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prompt } from "@/lib/types";

export async function GET() {
  try {
    const rows = await prisma.prompt.findMany({ orderBy: { updatedAt: "desc" } });
    const prompts: Prompt[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      description: r.description ?? undefined,
      content: r.content,
      coverImageUrl: r.coverImageUrl ?? "",
      tags: r.tags ?? [],
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      publishedAt: r.publishedAt ?? undefined,
      status: r.status as Prompt["status"],
    }));
    return NextResponse.json(prompts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list prompts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Prompt;
    const now = new Date().toISOString();
    const id = body.id || crypto.randomUUID();
    await prisma.prompt.upsert({
      where: { id },
      create: {
        id,
        title: body.title,
        slug: body.slug,
        description: (body.description ?? "").trim(),
        content: body.content,
        coverImageUrl: body.coverImageUrl ?? "",
        tags: body.tags ?? [],
        createdAt: body.createdAt || now,
        updatedAt: now,
        publishedAt: body.publishedAt ?? null,
        status: body.status ?? "draft",
      },
      update: {
        title: body.title,
        slug: body.slug,
        description: (body.description ?? "").trim(),
        content: body.content,
        coverImageUrl: body.coverImageUrl ?? "",
        tags: body.tags ?? [],
        updatedAt: now,
        publishedAt: body.publishedAt ?? null,
        status: body.status ?? "draft",
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to upsert prompt" }, { status: 500 });
  }
}
