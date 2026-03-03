// Supabase Edge Function scaffold.
// Mirrors /app/api/auth/telegram route behavior for future migration.

import { createClient } from "npm:@supabase/supabase-js@2";

type Payload = { initData?: string };

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRole) {
    return new Response(JSON.stringify({ ok: false, error: "Missing env" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = (await req.json()) as Payload;
  if (!body.initData) {
    return new Response(JSON.stringify({ ok: false, error: "initData is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRole);

  // TODO: add Telegram HMAC verification for production on Edge Functions path.
  const { error } = await supabase.from("analytics_events").insert({
    name: "telegram_auth_edge_called",
    payload: { hasInitData: true },
  });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
