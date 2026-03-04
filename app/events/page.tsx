import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { EVENTS } from "@/src/lib/mock-data";

export default function EventsPage() {
  return (
    <AppShell title="Афиша" subtitle="Выбирайте формат и день встречи">
      <div className="event-grid">
        {EVENTS.map((event) => (
          <LiquidGlassCard key={event.id}>
            <p className="eyebrow">{event.city}</p>
            <h2 className="event-title mt-2">{event.title}</h2>
            <p className="event-meta">{event.shortDescription}</p>
            <div className="details-grid">
              <p className="details-pill">{event.startsAt}</p>
              <p className="details-pill">{event.priceLabel}</p>
              <p className="details-pill">Возраст: {event.ageLabel}</p>
              <p className="details-pill">Мест: {event.spotsLeft}</p>
            </div>
            <Link href={`/events/${event.id}`} className="mt-4 block">
              <LiquidGlassButton variant="accent">Пойти</LiquidGlassButton>
            </Link>
          </LiquidGlassCard>
        ))}
      </div>
    </AppShell>
  );
}
