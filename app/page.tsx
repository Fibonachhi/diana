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
  openTelegramLink?: (url: string) => void;
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
    return { isTelegram: false, user: null as TelegramUser | null, webApp: null as TelegramWebApp | null };
  }

  const webApp = window.Telegram?.WebApp ?? null;
  if (!webApp) {
    return { isTelegram: false, user: null as TelegramUser | null, webApp: null };
  }

  webApp.ready();
  webApp.expand();

  return {
    isTelegram: true,
    user: webApp.initDataUnsafe?.user ?? null,
    webApp,
  };
}

export default function Home() {
  const { isTelegram, user, webApp } = useMemo(() => getTelegramContext(), []);

  const openChannel = () => {
    const url = "https://t.me/theplus_one_bot";
    if (webApp?.openTelegramLink) {
      webApp.openTelegramLink(url);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
      <section className="rounded-3xl border border-black/10 bg-white/85 p-5 shadow-xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.18em] text-black/50">Diana Listopad</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">Плюс один</h1>
        <p className="mt-3 text-sm text-black/70">
          Мини-приложение для контента, заявок и личной работы с подписчиками.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-black/5 p-3">
            <p className="text-black/50">Платформа</p>
            <p className="font-semibold">Telegram Mini App</p>
          </div>
          <div className="rounded-2xl bg-black/5 p-3">
            <p className="text-black/50">Supabase</p>
            <p className="font-semibold">{isSupabaseConfigured ? "Подключен" : "Не подключен"}</p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-black/10 bg-white/85 p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/60">Профиль</h2>
        <div className="mt-3 space-y-1 text-sm">
          <p><span className="text-black/50">Режим:</span> {isTelegram ? "Telegram" : "Browser"}</p>
          <p><span className="text-black/50">Имя:</span> {user?.first_name ?? "Гость"}</p>
          <p><span className="text-black/50">Username:</span> {user?.username ? `@${user.username}` : "-"}</p>
          <p><span className="text-black/50">ID:</span> {user?.id ?? "-"}</p>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-black/10 bg-white/85 p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/60">Что внутри</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/80">
          <li>Закрытый контент и материалы.</li>
          <li>Заявки на консультации/разборы.</li>
          <li>Быстрый контакт и анонсы запусков.</li>
        </ul>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={openChannel}
          className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          Открыть бота
        </button>
        <a
          href="https://diana-mocha.vercel.app"
          className="rounded-2xl border border-black/20 bg-white px-4 py-3 text-center text-sm font-semibold text-black"
          target="_blank"
          rel="noopener noreferrer"
        >
          Обновить Mini App
        </a>
      </div>
    </main>
  );
}
