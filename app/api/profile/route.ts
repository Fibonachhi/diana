import { NextResponse } from "next/server";
import { getProfileByTelegramId } from "@/src/lib/server-data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const telegramId = Number(url.searchParams.get("telegramId") ?? "0");

  if (!telegramId) {
    return NextResponse.json({ ok: false, error: "telegramId required" }, { status: 400 });
  }

  const profile = await getProfileByTelegramId(telegramId);
  return NextResponse.json({ ok: true, profile });
}
