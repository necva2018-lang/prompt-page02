import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Event } from "@/lib/types";

export async function GET() {
  try {
    const rows = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
    const events: Event[] = rows.map((r) => ({
      id: r.id,
      type: r.type as Event["type"],
      promptId: r.promptId,
      createdAt: r.createdAt,
    }));
    return NextResponse.json(events);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Event;
    await prisma.event.create({
      data: {
        id: body.id,
        type: body.type,
        promptId: body.promptId,
        createdAt: body.createdAt,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}
