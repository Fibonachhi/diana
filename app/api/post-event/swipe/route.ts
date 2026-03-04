import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/src/lib/supabase/admin";
import { getProfileByTelegramId } from "@/src/lib/server-data";
import { logServer } from "@/src/lib/logger";

export const runtime = "nodejs";

type SwipeBody = {
  eventId?: string;
  telegramId?: number;
  toUserId?: string;
  type?: "skip" | "romantic" | "friendly";
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SwipeBody;
  const eventId = body.eventId;
  const telegramId = body.telegramId;
  const toUserId = body.toUserId;
  const type = body.type;

  if (!eventId || !telegramId || !toUserId || !type) {
    return NextResponse.json({ ok: false, error: "eventId, telegramId, toUserId, type required" }, { status: 400 });
  }

  const me = await getProfileByTelegramId(telegramId);
  if (!me) {
    return NextResponse.json({ ok: false, error: "profile not found" }, { status: 404 });
  }

  const supabase = createAdminSupabaseClient();

  const { error: swipeError } = await supabase.from("swipes").upsert(
    {
      event_id: eventId,
      from_user_id: me.id,
      to_user_id: toUserId,
      type,
    },
    { onConflict: "event_id,from_user_id,to_user_id" },
  );

  if (swipeError) {
    logServer("error", "swipe_upsert_failed", { message: swipeError.message });
    return NextResponse.json({ ok: false, error: swipeError.message }, { status: 500 });
  }

  let matchCreated = false;

  if (type !== "skip") {
    const { data: reverseSwipe } = await supabase
      .from("swipes")
      .select("id")
      .eq("event_id", eventId)
      .eq("from_user_id", toUserId)
      .eq("to_user_id", me.id)
      .eq("type", type)
      .maybeSingle();

    if (reverseSwipe) {
      const userA = me.id < toUserId ? me.id : toUserId;
      const userB = me.id < toUserId ? toUserId : me.id;

      const { error: matchError } = await supabase.from("matches").upsert(
        {
          event_id: eventId,
          user_a: userA,
          user_b: userB,
          type,
        },
        { onConflict: "event_id,user_a,user_b,type" },
      );

      if (!matchError) {
        matchCreated = true;
      }
    }
  }

  logServer("info", "swipe_created", { eventId, from: me.id, toUserId, type, matchCreated });

  return NextResponse.json({ ok: true, matchCreated });
}
