"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { ResponsivePhoto } from "@/src/components/responsive-photo";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";

type MatchRow = {
  id: string;
  type: "romantic" | "friendly";
  createdAt: string;
  partnerName: string;
  partnerUsername: string | null;
  partnerPhoto: string;
};

export default function MatchesPage() {
  const { telegramUserId } = useTelegramProfile();
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!telegramUserId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/matches?telegramId=${telegramUserId}`);
      const body = (await res.json()) as { matches?: MatchRow[] };
      setRows(body.matches ?? []);
      setLoading(false);
    }

    void load();
  }, [telegramUserId]);

  return (
    <AppShell title="Ваши мэтчи" subtitle="Контакт открывается только при взаимной симпатии">
      {loading ? (
        <LiquidGlassCard>
          <p className="muted">Загружаем мэтчи...</p>
        </LiquidGlassCard>
      ) : rows.length === 0 ? (
        <LiquidGlassCard>
          <h2 className="screen-title">Пока без мэтчей</h2>
          <p className="mt-2 muted">После завершённых встреч и взаимного выбора здесь появятся контакты.</p>
          <Link href="/post-event" className="mt-4 block">
            <LiquidGlassButton variant="accent">Перейти к участникам встречи</LiquidGlassButton>
          </Link>
        </LiquidGlassCard>
      ) : (
        <div className="event-grid">
          {rows.map((row) => (
            <LiquidGlassCard key={row.id}>
              <ResponsivePhoto src={row.partnerPhoto} alt={row.partnerName} />
              <h2 className="event-title">{row.partnerName}</h2>
              <p className="event-meta">Тип: {row.type === "romantic" ? "романтический" : "дружеский"} мэтч</p>
              {row.partnerUsername ? <p className="event-meta">Контакт: @{row.partnerUsername}</p> : null}
              <div className="mt-4">
                <LiquidGlassButton variant="accent">Открыть контакт</LiquidGlassButton>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      )}
    </AppShell>
  );
}
