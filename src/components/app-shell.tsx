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
      <section className="rounded-3xl border border-amber-200/30 bg-gradient-to-br from-[#0d1528] via-[#121a2f] to-[#1a1f35] p-5 shadow-2xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">Плюс один</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-[#f9f3e8]">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-[#d5c9b4]">{subtitle}</p> : null}
      </section>

      <nav className="mt-3 grid grid-cols-5 gap-2 rounded-2xl border border-[#2b324b] bg-[#0f1629]/95 p-2 text-[11px] shadow-lg">
        {nav.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-2 py-2 text-center font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-amber-300 to-yellow-500 text-[#1e2334]"
                  : "bg-[#1d253d] text-[#c0c7d9]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <section className="mt-3 flex-1 rounded-3xl border border-[#d8c8a4]/45 bg-[#f8f2e7] p-5 shadow-xl">
        {children}
      </section>
    </main>
  );
}
