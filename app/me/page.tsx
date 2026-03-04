import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";

export default function MePage() {
  return (
    <AppShell title="Профиль" subtitle="Билеты, резерв, история и приватность">
      <div className="screen-stack">
        <LiquidGlassCard>
          <h2 className="event-title">Мой профиль</h2>
          <p className="event-meta">Имя, город, возраст, интересы, настройки показа username после мэтча.</p>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <h2 className="event-title">Активные записи</h2>
          <p className="event-meta">Книжный клуб знакомств · 14 марта · статус: paid.</p>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <h2 className="event-title">Резерв</h2>
          <p className="event-meta">Кино-встреча · оффер откроется при освобождении места.</p>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <h2 className="event-title">История</h2>
          <p className="event-meta">2 завершённые встречи, 1 открытый пост-ивент мэтчинг.</p>
        </LiquidGlassCard>
      </div>
    </AppShell>
  );
}
