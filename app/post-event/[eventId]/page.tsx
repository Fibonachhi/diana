"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { LiquidGlassPanel } from "@/src/components/LiquidGlassPanel";
import { EVENTS, PARTICIPANTS } from "@/src/lib/mock-data";

type SwipeType = "romantic" | "friendly" | "skip";

export default function PostEventSwipePage() {
  const router = useRouter();
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  const event = useMemo(() => EVENTS.find((item) => item.id === eventId), [eventId]);
  const deck = useMemo(() => PARTICIPANTS.filter((item) => item.eventId === eventId), [eventId]);
  const [index, setIndex] = useState(0);

  const current = deck[index];

  function handleSwipe(type: SwipeType) {
    if (!current) return;

    if (type === "romantic" && current.id === "anna") {
      router.push("/matches?new=anna&type=romantic");
      return;
    }

    if (type === "friendly" && current.id === "maria") {
      router.push("/matches?new=maria&type=friendly");
      return;
    }

    setIndex((value) => value + 1);
  }

  if (!event) {
    return (
      <AppShell title="Участники встречи" subtitle="Событие не найдено">
        <LiquidGlassCard>
          <p className="muted">Проверьте ссылку события.</p>
        </LiquidGlassCard>
      </AppShell>
    );
  }

  if (!current) {
    return (
      <AppShell title="Участники встречи" subtitle={event.title}>
        <LiquidGlassPanel>
          <p className="screen-title">Вы всех просмотрели</p>
          <p className="mt-2 muted">Новые карточки появятся, если кто-то завершит профиль позже.</p>
          <Link href="/matches" className="mt-4 block">
            <LiquidGlassButton variant="accent">Перейти к мэтчам</LiquidGlassButton>
          </Link>
        </LiquidGlassPanel>
      </AppShell>
    );
  }

  return (
    <AppShell title="Участники встречи" subtitle={event.title}>
      <div className="screen-stack">
        <LiquidGlassCard>
          <p className="eyebrow">Карточка {index + 1}</p>
          <h2 className="screen-title mt-2">{current.name}, {current.age}</h2>
          <p className="event-meta">{current.job}</p>
          <p className="mt-2 muted">{current.bio}</p>
        </LiquidGlassCard>

        <LiquidGlassPanel>
          <p className="muted">После реальной встречи можно выбрать только 1 из 3 реакций:</p>
          <div className="mt-3 grid gap-2">
            <LiquidGlassButton variant="ghost" onClick={() => handleSwipe("skip")}>Пропустить</LiquidGlassButton>
            <LiquidGlassButton onClick={() => handleSwipe("romantic")}>❤️ Романтическая симпатия</LiquidGlassButton>
            <LiquidGlassButton variant="accent" onClick={() => handleSwipe("friendly")}>🤝 Дружеская симпатия</LiquidGlassButton>
          </div>
        </LiquidGlassPanel>
      </div>
    </AppShell>
  );
}
