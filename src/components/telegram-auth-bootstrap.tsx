"use client";

import { useEffect, useState } from "react";

type AuthStatus = "idle" | "authenticating" | "ok" | "error";

type TelegramWebApp = {
  initData: string;
  ready: () => void;
  expand: () => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function TelegramAuthBootstrap() {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [message, setMessage] = useState<string>("Запусти приложение из Telegram, чтобы пройти авторизацию.");

  useEffect(() => {
    const run = async () => {
      const webApp = window.Telegram?.WebApp;
      if (!webApp?.initData) {
        return;
      }

      webApp.ready();
      webApp.expand();

      const initData = webApp.initData;
      const alreadyDone = localStorage.getItem("tg_init_data_hash") === initData;

      if (alreadyDone) {
        setStatus("ok");
        setMessage("Telegram-сессия активна.");
        return;
      }

      setStatus("authenticating");
      setMessage("Проверяю Telegram подпись...");

      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initData }),
        });

        const body = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !body.ok) {
          throw new Error(body.error ?? "Auth failed");
        }

        localStorage.setItem("tg_init_data_hash", initData);
        setStatus("ok");
        setMessage("Авторизация прошла успешно.");
      } catch (err: unknown) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Ошибка авторизации");
      }
    };

    void run();
  }, []);

  const statusColor = {
    idle: "text-black/60",
    authenticating: "text-amber-700",
    ok: "text-emerald-700",
    error: "text-red-700",
  }[status];

  return <p className={`mt-2 text-sm ${statusColor}`}>{message}</p>;
}
