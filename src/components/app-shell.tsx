"use client";

import Image from "next/image";
import { MiniTabBar } from "@/src/components/mini-tab-bar";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showTabs?: boolean;
};

export function AppShell({ title, subtitle, children, showTabs = true }: AppShellProps) {
  const { user } = useTelegramProfile();

  return (
    <main className="app-root">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />

      <Image src="/glass-orb.svg" alt="" width={320} height={320} className="bg-orb bg-orb-left" priority />
      <Image src="/glass-orb.svg" alt="" width={260} height={260} className="bg-orb bg-orb-right" priority />

      <div className="app-frame">
        <header className="liquidGlass app-header">
          <span className="glassEdge" />
          <Image src="/glass-strip.svg" alt="" width={640} height={140} className="header-strip" />
          <div className="header-top">
            <p className="eyebrow">PLUS ONE CLUB</p>
          </div>
          <h1>{title}</h1>
          {subtitle ? <p className="subtitle">{subtitle}</p> : null}
          {user?.first_name ? <p className="user-chip">{user.first_name}</p> : null}
        </header>

        <section className="app-content">{children}</section>
      </div>

      {showTabs ? <MiniTabBar /> : null}
    </main>
  );
}
