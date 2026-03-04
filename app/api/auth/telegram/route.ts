import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/src/lib/supabase/admin";
import { verifyTelegramInitData } from "@/src/lib/telegram/verify";
import { logServer } from "@/src/lib/logger";

type TelegramAuthBody = {
  initData?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TelegramAuthBody;
    const initData = body.initData;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!initData) {
      return NextResponse.json({ ok: false, error: "initData is required" }, { status: 400 });
    }

    if (!botToken) {
      return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN is missing" }, { status: 500 });
    }

    const verified = verifyTelegramInitData(initData, botToken);
    const user = verified.user;
    logServer("info", "telegram_auth_verified", { telegramId: user.id });

    const supabase = createAdminSupabaseClient();

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("telegram_id", user.id)
      .maybeSingle();

    const profileId = existingProfile?.id ?? randomUUID();

    const { error: upsertError } = await supabase.from("profiles").upsert(
      {
        id: profileId,
        telegram_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
        photo_urls: user.photo_url ? [user.photo_url] : [],
      },
      { onConflict: "telegram_id" },
    );

    if (upsertError) {
      logServer("error", "telegram_auth_upsert_failed", { telegramId: user.id, message: upsertError.message });
      return NextResponse.json({ ok: false, error: upsertError.message }, { status: 500 });
    }

    logServer("info", "telegram_auth_ok", { telegramId: user.id, profileId });
    return NextResponse.json({ ok: true, profileId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Auth error";
    logServer("warn", "telegram_auth_failed", { message });
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
