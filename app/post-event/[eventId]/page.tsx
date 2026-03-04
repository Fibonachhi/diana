"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { LiquidGlassPanel } from "@/src/components/LiquidGlassPanel";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";
import { logClient } from "@/src/lib/logger";

type DeckUser = {
  id: string;
  telegramId: number;
  name: string;
  username: string | null;
  age: number | null;
  bio: string | null;
  photos: string[];
};

type SwipeType = "romantic" | "friendly" | "skip";

export default function PostEventSwipePage() {
  const router = useRouter();
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const { telegramUserId } = useTelegramProfile();

  const [deck, setDeck] = useState<DeckUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function loadDeck() {
      if (!telegramUserId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/post-event/deck?eventId=${eventId}&telegramId=${telegramUserId}`);
      const body = (await res.json()) as { ok?: boolean; deck?: DeckUser[] };
      setDeck(body.deck ?? []);
      setLoading(false);
      logClient("info", "deck_opened", { eventId, telegramUserId, count: body.deck?.length ?? 0 });
    }

    void loadDeck();
  }, [eventId, telegramUserId]);

  const current = useMemo(() => deck[index], [deck, index]);

  async function handleSwipe(type: SwipeType) {
    if (!current || !telegramUserId) return;

    const res = await fetch("/api/post-event/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        telegramId: telegramUserId,
        toUserId: current.id,
        type,
      }),
    });

    const body = (await res.json()) as { ok?: boolean; matchCreated?: boolean };

    logClient("info", "swipe_action", {
      eventId,
      type,
      toUserId: current.id,
      matchCreated: Boolean(body.matchCreated),
    });

    if (body.matchCreated) {
      router.push("/matches");
      return;
    }

    setIndex((value) => value + 1);
  }

  return (
    <AppShell title="Участники встречи" subtitle="После события выбирайте симпатию">
      {loading ? (
        <LiquidGlassCard>
          <p className="muted">Загружаем участников...</p>
        </LiquidGlassCard>
      ) : !telegramUserId ? (
        <LiquidGlassCard>
          <p className="muted">Откройте мини-апп из Telegram, чтобы видеть участников встречи.</p>
        </LiquidGlassCard>
      ) : !current ? (
        <LiquidGlassPanel>
          <p className="screen-title">Вы всех просмотрели</p>
          <p className="mt-2 muted">Новые карточки появятся, если кто-то завершит профиль позже.</p>
          <Link href="/matches" className="mt-4 block">
            <LiquidGlassButton variant="accent">Перейти к мэтчам</LiquidGlassButton>
          </Link>
        </LiquidGlassPanel>
      ) : (
        <div className="screen-stack">
          <LiquidGlassCard>
            <figure className="event-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.photos[0]} alt={current.name} />
            </figure>
            <p className="eyebrow">Карточка {index + 1}</p>
            <h2 className="screen-title mt-2">
              {current.name}
              {current.age ? `, ${current.age}` : ""}
            </h2>
            <p className="event-meta">{current.bio ?? "Информация появится позже."}</p>
          </LiquidGlassCard>

          <LiquidGlassPanel>
            <p className="muted">После живой встречи можно выбрать только одну реакцию.</p>
            <div className="mt-3 grid gap-2">
              <LiquidGlassButton variant="ghost" onClick={() => handleSwipe("skip")}>Пропустить</LiquidGlassButton>
              <LiquidGlassButton onClick={() => handleSwipe("romantic")}>❤️ Романтическая симпатия</LiquidGlassButton>
              <LiquidGlassButton variant="accent" onClick={() => handleSwipe("friendly")}>🤝 Дружеская симпатия</LiquidGlassButton>
            </div>
          </LiquidGlassPanel>
        </div>
      )}
    </AppShell>
  );
}
