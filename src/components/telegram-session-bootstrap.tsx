"use client";

import { useEffect } from "react";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";
import { logClient } from "@/src/lib/logger";

export function TelegramSessionBootstrap() {
  const { user } = useTelegramProfile();

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp?.initData) return;

    webApp.ready?.();
    webApp.expand?.();

    const initData = webApp.initData;
    if (localStorage.getItem("tg_init_data_hash") === initData) return;

    logClient("info", "telegram_auth_bootstrap_start", {
      telegramId: user?.id ?? null,
      initDataLength: initData.length,
    });

    void fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    })
      .then(async (res) => {
        const payload = (await res.json().catch(() => ({}))) as { ok?: boolean };
        if (res.ok && payload.ok) {
          localStorage.setItem("tg_init_data_hash", initData);
          logClient("info", "telegram_auth_bootstrap_ok", { telegramId: user?.id ?? null });
        }
      })
      .catch(() => {
        logClient("warn", "telegram_auth_bootstrap_failed", { telegramId: user?.id ?? null });
      });
  }, [user?.id]);

  return null;
}
