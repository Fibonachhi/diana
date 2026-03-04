import { NextResponse } from "next/server";
import { getDeckForEvent } from "@/src/lib/server-data";
import { logServer } from "@/src/lib/logger";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const eventId = url.searchParams.get("eventId") ?? "";
  const telegramId = Number(url.searchParams.get("telegramId") ?? "0");

  if (!eventId || !telegramId) {
    return NextResponse.json({ ok: false, error: "eventId and telegramId are required" }, { status: 400 });
  }

  const deck = await getDeckForEvent(eventId, telegramId);
  logServer("info", "deck_loaded", { eventId, telegramId, count: deck.length });

  return NextResponse.json({ ok: true, deck });
}
