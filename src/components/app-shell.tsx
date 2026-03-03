import Link from "next/link";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const nav = [
  { href: "/", label: "Главная" },
  { href: "/events", label: "События" },
  { href: "/me", label: "Профиль" },
  { href: "/admin", label: "Админ" },
];

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
      <section className="rounded-3xl border border-black/10 bg-white/90 p-5 shadow-xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.18em] text-black/50">Плюс один</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-black/70">{subtitle}</p> : null}
      </section>

      <nav className="mt-3 grid grid-cols-4 gap-2 rounded-2xl border border-black/10 bg-white/85 p-2 text-xs">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl bg-black/5 px-2 py-2 text-center font-medium text-black/80"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="mt-3 flex-1 rounded-3xl border border-black/10 bg-white/85 p-5 shadow-sm">{children}</section>
    </main>
  );
}
