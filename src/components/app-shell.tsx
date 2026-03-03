"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const nav = [
  { href: "/onboarding", label: "Старт" },
  { href: "/home", label: "Афиша" },
  { href: "/post-event", label: "После" },
  { href: "/matches", label: "Мэтчи" },
  { href: "/admin", label: "Админ" },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5 sm:px-5 sm:py-6">
      <section className="rounded-3xl border border-black/10 bg-white/90 p-5 shadow-xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.18em] text-black/50">Плюс один</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-black/70">{subtitle}</p> : null}
      </section>

      <nav className="mt-3 grid grid-cols-5 gap-2 rounded-2xl border border-black/10 bg-white/85 p-2 text-[11px]">
        {nav.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-2 py-2 text-center font-semibold transition ${
                active ? "bg-black text-white" : "bg-black/5 text-black/80"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <section className="mt-3 flex-1 rounded-3xl border border-black/10 bg-white/85 p-5 shadow-sm">{children}</section>
    </main>
  );
}
