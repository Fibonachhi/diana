"use client";

import { AppShell } from "@/src/components/app-shell";
import { EVENTS, PARTICIPANTS } from "@/src/lib/mock-data";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type SwipeType = "romantic" | "friendly" | "skip";

export default function PostEventSwipePage() {
  const router = useRouter();
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  const event = useMemo(() => EVENTS.find((item) => item.id === eventId), [eventId]);
  const deck = useMemo(() => PARTICIPANTS.filter((item) => item.eventId === eventId), [eventId]);
  const [index, setIndex] = useState(0);

  const current = deck[index];
  const isDone = index >= deck.length;

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
      <AppShell title="После мероприятия" subtitle="Событие не найдено">
        <p className="text-sm text-black/70">Проверьте ссылку на событие.</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Участники встречи" subtitle={event.title}>
      {isDone ? (
        <div className="space-y-4">
          <section className="rounded-2xl bg-black/5 p-4 text-sm text-black/75">
            Вы всех просмотрели. Новые карточки появятся, если кто-то завершит профиль позже.
          </section>
          <Link href="/matches" className="primary-btn">
            Перейти к мэтчам
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <section className="rounded-3xl border border-black/10 bg-white p-5 shadow">
            <p className="text-xs uppercase tracking-[0.14em] text-black/45">Карточка {index + 1}</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {current.name}, {current.age}
            </h2>
            <p className="mt-2 text-sm text-black/70">{current.job}</p>
            <p className="mt-2 text-sm text-black/75">{current.bio}</p>
          </section>

          <div className="grid grid-cols-1 gap-2">
            <button className="secondary-btn" onClick={() => handleSwipe("skip")}>
              Пропустить
            </button>
            <button className="primary-btn" onClick={() => handleSwipe("romantic")}>
              ❤️ Романтическая симпатия
            </button>
            <button className="primary-btn bg-emerald-600 hover:bg-emerald-500" onClick={() => handleSwipe("friendly")}>
              🤝 Дружеская симпатия
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
