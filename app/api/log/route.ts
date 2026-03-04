import { NextResponse } from "next/server";
import { logServer } from "@/src/lib/logger";

export const runtime = "nodejs";

type Body = {
  level?: "info" | "warn" | "error";
  message?: string;
  context?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const level = body.level ?? "info";
  const message = body.message ?? "client-log";

  logServer(level, message, body.context);

  return NextResponse.json({ ok: true });
}
