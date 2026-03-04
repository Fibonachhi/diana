"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/home", label: "Встречи", icon: "◉" },
  { href: "/events", label: "Афиша", icon: "◇" },
  { href: "/post-event", label: "Связи", icon: "✦" },
  { href: "/me", label: "Профиль", icon: "◌" },
];

export function MiniTabBar() {
  const pathname = usePathname();

  return (
    <nav className="mini-tabs liquidGlass">
      <span className="glassEdge" />
      <div className="mini-tabs-inner">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link key={tab.href} href={tab.href} className={`mini-tab ${active ? "mini-tab-active" : ""}`}>
              <span className="mini-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
