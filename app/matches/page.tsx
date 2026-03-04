import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";

export default function MatchesPage() {
  return (
    <AppShell title="Взаимная симпатия" subtitle="Контакт открывается только при взаимном выборе">
      <div className="screen-stack">
        <LiquidGlassCard>
          <h2 className="screen-title">У вас взаимная симпатия</h2>
          <p className="event-meta">Анна, 28 · романтический мэтч</p>
          <div className="mt-4">
            <LiquidGlassButton variant="accent">Открыть контакт</LiquidGlassButton>
          </div>
        </LiquidGlassCard>

        <Link href="/post-event">
          <LiquidGlassButton variant="ghost">Вернуться к участникам встречи</LiquidGlassButton>
        </Link>
      </div>
    </AppShell>
  );
}
