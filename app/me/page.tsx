"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";

type Profile = {
  first_name: string | null;
  username: string | null;
  bio: string | null;
  photo_urls: string[];
};

export default function MePage() {
  const { telegramUserId } = useTelegramProfile();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function load() {
      if (!telegramUserId) return;
      const res = await fetch(`/api/profile?telegramId=${telegramUserId}`);
      const body = (await res.json()) as { profile?: Profile };
      setProfile(body.profile ?? null);
    }
    void load();
  }, [telegramUserId]);

  return (
    <AppShell title="Профиль" subtitle="Билеты, резерв, история и приватность">
      <div className="screen-stack">
        <LiquidGlassCard>
          {profile?.photo_urls?.[0] ? (
            <figure className="event-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.photo_urls[0]} alt={profile.first_name ?? "profile"} />
            </figure>
          ) : null}
          <h2 className="event-title">{profile?.first_name ?? "Профиль"}</h2>
          <p className="event-meta">@{profile?.username ?? "username"}</p>
          <p className="event-meta">{profile?.bio ?? "Добавьте bio в профиле."}</p>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <h2 className="event-title">Активные записи</h2>
          <p className="event-meta">Книжный клуб знакомств · статус: paid.</p>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <h2 className="event-title">Резерв и история</h2>
          <p className="event-meta">Резерв на кино-встречу и история завершённых мероприятий.</p>
        </LiquidGlassCard>
      </div>
    </AppShell>
  );
}
