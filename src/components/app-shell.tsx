"use client";

import Image from "next/image";
import { MiniTabBar } from "@/src/components/mini-tab-bar";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showTabs?: boolean;
  showHeader?: boolean;
};

const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? "local";

export function AppShell({ title, subtitle, children, showTabs = true, showHeader = false }: AppShellProps) {

  return (
    <main className="app-root">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />

      <Image src="/glass-orb.svg" alt="" width={320} height={320} className="bg-orb bg-orb-left" priority />
      <Image src="/glass-orb.svg" alt="" width={260} height={260} className="bg-orb bg-orb-right" priority />

      <div className="app-frame">
        {showHeader ? (
          <header className="liquidGlass app-header">
            <span className="glassEdge" />
            <Image src="/glass-strip.svg" alt="" width={640} height={140} className="header-strip" />
            <div className="header-top">
              <p className="eyebrow">PLUS ONE CLUB</p>
            </div>
            <h1>{title}</h1>
            {subtitle ? <p className="subtitle">{subtitle}</p> : null}
          </header>
        ) : (
          <div className="build-badge">build: {buildId}</div>
        )}

        <section className="app-content">{children}</section>
      </div>

      {showTabs ? <MiniTabBar /> : null}
    </main>
  );
}
