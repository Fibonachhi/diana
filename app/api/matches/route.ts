import { NextResponse } from "next/server";
import { getMatchesForTelegramId } from "@/src/lib/server-data";
import { logServer } from "@/src/lib/logger";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const telegramId = Number(url.searchParams.get("telegramId") ?? "0");

  if (!telegramId) {
    return NextResponse.json({ ok: false, error: "telegramId required" }, { status: 400 });
  }

  const matches = await getMatchesForTelegramId(telegramId);
  logServer("info", "matches_loaded", { telegramId, count: matches.length });

  return NextResponse.json({ ok: true, matches });
}
