"use client";

import { MiniTabBar } from "@/src/components/mini-tab-bar";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showTabs?: boolean;
};

export function AppShell({ title, subtitle, children, showTabs = true }: AppShellProps) {
  const { user, telegramUserId } = useTelegramProfile();

  return (
    <main className="app-root">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />

      <div className="app-frame">
        <header className="liquidGlass app-header">
          <span className="glassEdge" />
          <div className="header-top">
            <p className="eyebrow">PLUS ONE</p>
            {telegramUserId ? <p className="tg-id">tg:{telegramUserId}</p> : null}
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
