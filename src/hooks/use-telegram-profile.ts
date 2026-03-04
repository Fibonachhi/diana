"use client";

import { useMemo } from "react";

type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type TelegramWebApp = {
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  ready?: () => void;
  expand?: () => void;
  HapticFeedback?: {
    impactOccurred?: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred?: (type: "error" | "success" | "warning") => void;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

function parseUserFromInitData(rawInitData?: string): TelegramUser | null {
  if (!rawInitData) return null;
  const params = new URLSearchParams(rawInitData);
  const userRaw = params.get("user");
  if (!userRaw) return null;

  try {
    const parsed = JSON.parse(userRaw) as TelegramUser;
    return typeof parsed.id === "number" ? parsed : null;
  } catch {
    return null;
  }
}

export function useTelegramProfile() {
  const user = useMemo(() => {
    if (typeof window === "undefined") return null;

    const webApp = window.Telegram?.WebApp;
    const resolved = webApp?.initDataUnsafe?.user ?? parseUserFromInitData(webApp?.initData);

    if (resolved?.id) {
      localStorage.setItem("plus_one_tg_user_id", String(resolved.id));
      if (resolved.username) localStorage.setItem("plus_one_tg_username", resolved.username);
    }

    return resolved ?? null;
  }, []);

  return {
    user,
    telegramUserId: user?.id ?? null,
  };
}
