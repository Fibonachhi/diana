"use client";

import { useMemo } from "react";
import { isSupabaseConfigured } from "@/src/lib/supabase";

type TelegramUser = {
  id?: number;
  first_name?: string;
  username?: string;
};

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  colorScheme?: "light" | "dark";
  initDataUnsafe?: {
    user?: TelegramUser;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

function getTelegramContext() {
  if (typeof window === "undefined") {
    return { isTelegram: false, user: null as TelegramUser | null };
  }

  const webApp = window.Telegram?.WebApp;

  if (!webApp) {
    return { isTelegram: false, user: null as TelegramUser | null };
  }

  webApp.ready();
  webApp.expand();

  return {
    isTelegram: true,
    user: webApp.initDataUnsafe?.user ?? null,
  };
}

export default function Home() {
  const { isTelegram, user } = useMemo(() => getTelegramContext(), []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
      <section className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.18em] text-black/50">Diana Listopad</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">Telegram Mini App</h1>
        <p className="mt-3 text-sm text-black/70">
          Базовый каркас готов. Подключены Telegram WebApp context и Supabase env.
        </p>
      </section>

      <section className="mt-4 rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/60">Session</h2>
        <div className="mt-3 space-y-1 text-sm">
          <p>
            <span className="text-black/50">Режим:</span> {isTelegram ? "В Telegram" : "В браузере"}
          </p>
          <p>
            <span className="text-black/50">User:</span> {user?.first_name ?? "guest"}
          </p>
          <p>
            <span className="text-black/50">Username:</span> {user?.username ? `@${user.username}` : "-"}
          </p>
          <p>
            <span className="text-black/50">User ID:</span> {user?.id ?? "-"}
          </p>
          <p>
            <span className="text-black/50">Supabase:</span> {isSupabaseConfigured ? "configured" : "not configured"}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/60">Что дальше</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/80">
          <li>Настроить BotFather кнопку Mini App с URL от Vercel.</li>
          <li>Добавить таблицы в Supabase (users, leads, orders/requests).</li>
          <li>Подключить авторизацию по initData (проверка подписи на сервере).</li>
        </ul>
      </section>
    </main>
  );
}
