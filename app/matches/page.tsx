import { AppShell } from "@/src/components/app-shell";
import Link from "next/link";

export default function MatchesPage() {
  return (
    <AppShell title="У вас взаимная симпатия" subtitle="Контакт открывается только при взаимном выборе">
      <div className="space-y-3">
        <section className="rounded-2xl bg-black/5 p-4 text-sm text-black/80">
          <p className="font-semibold">Анна, 28</p>
          <p className="mt-2">Тип мэтча: романтическая симпатия</p>
        </section>

        <button className="primary-btn">Открыть контакт</button>

        <Link href="/post-event" className="secondary-btn">
          Вернуться к участникам
        </Link>
      </div>
    </AppShell>
  );
}
