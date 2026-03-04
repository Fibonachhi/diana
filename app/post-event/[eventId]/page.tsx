"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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

const SWIPE_THRESHOLD = 105;

function triggerHaptic(type: "light" | "success" | "warning") {
  const haptic = window.Telegram?.WebApp?.HapticFeedback;
  if (!haptic) return;

  if (type === "light") {
    haptic.impactOccurred?.("light");
    return;
  }

  if (type === "success") {
    haptic.notificationOccurred?.("success");
    return;
  }

  haptic.notificationOccurred?.("warning");
}

function getTopPhoto(user?: DeckUser) {
  return user?.photos?.[0] ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=70&auto=format&fit=crop";
}

export default function PostEventSwipePage() {
  const router = useRouter();
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const { telegramUserId } = useTelegramProfile();

  const [deck, setDeck] = useState<DeckUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [exiting, setExiting] = useState<SwipeType | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [matchBanner, setMatchBanner] = useState<{ open: boolean; name: string }>({ open: false, name: "" });

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);
  const loveOpacity = useTransform(x, [20, 120], [0, 1]);
  const friendOpacity = useTransform(x, [-120, -20], [1, 0]);

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
  const next = useMemo(() => deck[index + 1], [deck, index]);

  async function handleSwipe(type: SwipeType, target?: DeckUser) {
    const candidate = target ?? current;
    if (!candidate || !telegramUserId || isSwiping) return;
    setIsSwiping(true);

    try {
      const res = await fetch("/api/post-event/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          telegramId: telegramUserId,
          toUserId: candidate.id,
          type,
        }),
      });

      const body = (await res.json()) as { ok?: boolean; matchCreated?: boolean };

      logClient("info", "swipe_action", {
        eventId,
        type,
        toUserId: candidate.id,
        matchCreated: Boolean(body.matchCreated),
      });

      if (body.matchCreated) {
        triggerHaptic("success");
        setMatchBanner({ open: true, name: candidate.name });
        setTimeout(() => {
          setMatchBanner({ open: false, name: "" });
          router.push("/matches");
        }, 1400);
      }

      setIndex((value) => value + 1);
      setExiting(null);
      x.set(0);
    } finally {
      setIsSwiping(false);
    }
  }

  function swipeWithButtons(type: SwipeType) {
    if (!current) return;
    setExiting(type);
    triggerHaptic(type === "romantic" ? "success" : type === "friendly" ? "light" : "warning");
    void handleSwipe(type);
  }

  function onDragEnd(offsetX: number) {
    if (!current || isSwiping) return;

    if (offsetX > SWIPE_THRESHOLD) {
      setExiting("romantic");
      triggerHaptic("success");
      void handleSwipe("romantic", current);
      return;
    }

    if (offsetX < -SWIPE_THRESHOLD) {
      setExiting("friendly");
      triggerHaptic("light");
      void handleSwipe("friendly", current);
      return;
    }

    x.set(0);
  }

  const exitByType: Record<SwipeType, { x: number; rotate: number }> = {
    romantic: { x: 460, rotate: 26 },
    friendly: { x: -460, rotate: -26 },
    skip: { x: 0, rotate: 0 },
  };

  const preSwipeScreen = (
    <div className="screen-stack">
      <LiquidGlassPanel>
        <p className="eyebrow">ПОСЛЕ ВСТРЕЧИ</p>
        <h2 className="screen-title mt-2">Как работает выбор симпатии</h2>
        <p className="mt-2 muted">
          Сейчас вы увидите участников только этой встречи. Свайп влево - дружеская симпатия, свайп вправо -
          романтическая.
        </p>
      </LiquidGlassPanel>

      <LiquidGlassCard hover={false}>
        <div className="swipe-guide-visual">
          <div className="swipe-guide-chip swipe-guide-left">← Дружба</div>
          <div className="swipe-guide-center">Карточка участника</div>
          <div className="swipe-guide-chip swipe-guide-right">Любовь →</div>
        </div>
      </LiquidGlassCard>

      <LiquidGlassButton
        variant="accent"
        onClick={() => {
          setShowGuide(false);
          window.scrollTo({ top: 0, behavior: "auto" });
        }}
      >
        Начать свайпы
      </LiquidGlassButton>
    </div>
  );

  const swipeScreen = (
    <div className="screen-stack">
      <div className="swipe-deck-wrap">
        {next ? (
          <div className="swipe-card-back liquidGlass">
            <span className="glassEdge" />
            <div className="swipe-photo-wrap">
              <Image
                src={getTopPhoto(next)}
                alt={next.name}
                fill
                sizes="(max-width: 900px) 100vw, 640px"
                quality={62}
                unoptimized
                loading="lazy"
                className="swipe-photo-img"
              />
            </div>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.id}
              className={`swipe-card liquidGlass ${isSwiping ? "swipe-card-busy" : ""}`}
              drag="x"
              dragElastic={0.18}
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x, rotate }}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={
                exiting
                  ? { x: exitByType[exiting].x, rotate: exitByType[exiting].rotate, opacity: 0 }
                  : { opacity: 0 }
              }
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              onDragEnd={(_, info) => onDragEnd(info.offset.x)}
            >
              <span className="glassEdge" />
              <motion.div className="swipe-state swipe-love" style={{ opacity: loveOpacity }}>
                ❤️ романтика
              </motion.div>
              <motion.div className="swipe-state swipe-friend" style={{ opacity: friendOpacity }}>
                🤝 дружба
              </motion.div>

              <div className="swipe-photo-wrap">
                <Image
                  src={getTopPhoto(current)}
                  alt={current.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 640px"
                  quality={64}
                  unoptimized
                  priority
                  className="swipe-photo-img"
                />
              </div>
              <div className="swipe-copy">
                <p className="eyebrow">Участник {index + 1}</p>
                <h2 className="screen-title mt-2">
                  {current.name}
                  {current.age ? `, ${current.age}` : ""}
                </h2>
                <p className="event-meta">{current.bio ?? "Информация появится позже."}</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <LiquidGlassPanel>
        <p className="muted">Свайпай карточку или используй кнопки.</p>
        <div className="swipe-actions-row">
          <LiquidGlassButton variant="ghost" onClick={() => swipeWithButtons("friendly")} disabled={isSwiping}>
            ← Дружба
          </LiquidGlassButton>
          <LiquidGlassButton variant="accent" onClick={() => swipeWithButtons("romantic")} disabled={isSwiping}>
            Любовь →
          </LiquidGlassButton>
        </div>
        <LiquidGlassButton className="mt-2" variant="ghost" onClick={() => swipeWithButtons("skip")} disabled={isSwiping}>
          Пропустить
        </LiquidGlassButton>
      </LiquidGlassPanel>
    </div>
  );

  return (
    <AppShell title="Участники встречи" subtitle="После события выбирайте симпатию">
      <AnimatePresence>
        {matchBanner.open ? (
          <motion.div
            className="match-overlay"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div className="liquidGlass match-modal">
              <span className="glassEdge" />
              <p className="eyebrow">MATCH</p>
              <h2 className="screen-title mt-2">Взаимная симпатия</h2>
              <p className="event-meta">У вас мэтч с {matchBanner.name}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
        <>{showGuide ? preSwipeScreen : swipeScreen}</>
      )}
    </AppShell>
  );
}
