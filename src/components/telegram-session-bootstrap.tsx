"use client";

import { useEffect } from "react";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";

export function TelegramSessionBootstrap() {
  const { user } = useTelegramProfile();

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp?.initData) return;

    webApp.ready?.();
    webApp.expand?.();

    const initData = webApp.initData;
    if (localStorage.getItem("tg_init_data_hash") === initData) return;

    void fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    })
      .then(async (res) => {
        const payload = (await res.json().catch(() => ({}))) as { ok?: boolean };
        if (res.ok && payload.ok) {
          localStorage.setItem("tg_init_data_hash", initData);
        }
      })
      .catch(() => {
        // ignore network/auth boot errors here; UI will still render.
      });
  }, [user?.id]);

  return null;
}
