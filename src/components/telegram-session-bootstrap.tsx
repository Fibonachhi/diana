"use client";

import { useEffect } from "react";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";
import { logClient } from "@/src/lib/logger";

export function TelegramSessionBootstrap() {
  const { user } = useTelegramProfile();

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.ready?.();
    webApp.expand?.();

    const applyViewportVars = () => {
      const h = webApp.viewportStableHeight ?? webApp.viewportHeight;
      if (h && Number.isFinite(h) && h > 0) {
        document.documentElement.style.setProperty("--tg-viewport-height", `${h}px`);
      }
    };

    applyViewportVars();
    webApp.onEvent?.("viewportChanged", applyViewportVars);

    if (!webApp.initData) {
      return () => {
        webApp.offEvent?.("viewportChanged", applyViewportVars);
      };
    }

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

    return () => {
      webApp.offEvent?.("viewportChanged", applyViewportVars);
    };
  }, [user?.id]);

  return null;
}
