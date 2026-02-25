import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prompt } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const r = await prisma.prompt.findUnique({ where: { slug } });
    if (!r) return NextResponse.json(null, { status: 404 });
    const prompt: Prompt = {
      id: r.id,
      title: r.title,
      slug: r.slug,
      content: r.content,
      coverImageUrl: r.coverImageUrl ?? "",
      tags: r.tags ?? [],
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      publishedAt: r.publishedAt ?? undefined,
      status: r.status as Prompt["status"],
    };
    return NextResponse.json(prompt);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get prompt" }, { status: 500 });
  }
}
