import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { LiquidGlassPanel } from "@/src/components/LiquidGlassPanel";
import { EVENTS } from "@/src/lib/mock-data";

export default function HomePage() {
  const city = "Москва";
  const cityEvents = EVENTS.filter((event) => event.city === city);

  return (
    <AppShell title="Встречи в городе" subtitle={`Город: ${city}`}>
      <div className="screen-stack">
        <LiquidGlassPanel>
          <p className="muted">Главный экран</p>
          <p className="mt-2 muted">Подборка ближайших встреч, где можно познакомиться через общий контекст.</p>
        </LiquidGlassPanel>

        <div className="event-grid">
          {cityEvents.map((event) => (
            <LiquidGlassCard key={event.id}>
              <h2 className="event-title">{event.title}</h2>
              <p className="event-meta">{event.shortDescription}</p>
              <div className="details-grid">
                <p className="details-pill">{event.startsAt}</p>
                <p className="details-pill">Возраст: {event.ageLabel}</p>
                <p className="details-pill">Осталось мест: {event.spotsLeft}</p>
                <p className="details-pill">{event.priceLabel}</p>
              </div>
              <Link href={`/events/${event.id}`} className="mt-4 block">
                <LiquidGlassButton variant="accent">Пойти</LiquidGlassButton>
              </Link>
            </LiquidGlassCard>
          ))}
        </div>

        <Link href="/events">
          <LiquidGlassButton variant="ghost">Показать всю афишу</LiquidGlassButton>
        </Link>
      </div>
    </AppShell>
  );
}
