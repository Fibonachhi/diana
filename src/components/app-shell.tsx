"use client";

import Image from "next/image";
import { MiniTabBar } from "@/src/components/mini-tab-bar";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showTabs?: boolean;
};

const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? "local";

export function AppShell({ title, subtitle, children, showTabs = true }: AppShellProps) {

  return (
    <main className="app-root">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />

      <Image src="/glass-orb.svg" alt="" width={320} height={320} className="bg-orb bg-orb-left" priority />
      <Image src="/glass-orb.svg" alt="" width={260} height={260} className="bg-orb bg-orb-right" priority />

      <div className="app-frame">
        <header className="liquidGlass app-header app-header-v2">
          <span className="glassEdge" />
          <div className="header-brand">
            <Image src="/brand/logo-plus-odin.png" alt="Плюс Один" width={56} height={56} className="header-brand-logo" />
            <div>
              <p className="eyebrow">PLUS ONE WORLD</p>
              <h1>{title}</h1>
            </div>
          </div>
          {subtitle ? <p className="subtitle">{subtitle}</p> : null}
          <div className="build-badge">build: {buildId}</div>
        </header>

        <section className="app-content">{children}</section>
      </div>

      {showTabs ? <MiniTabBar /> : null}
    </main>
  );
}
