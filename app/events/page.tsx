import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { getEventsFromDb } from "@/src/lib/server-data";

export default async function EventsPage() {
  const events = await getEventsFromDb();

  return (
    <AppShell title="Афиша" subtitle="Форматы встреч в Москве и других городах">
      <div className="event-grid">
        {events.map((event) => (
          <LiquidGlassCard key={event.id}>
            <figure className="event-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.coverImageUrl} alt={event.title} />
            </figure>
            <p className="eyebrow">{event.city}</p>
            <h2 className="event-title mt-2">{event.title}</h2>
            <p className="event-meta">{event.description}</p>
            <div className="details-grid">
              <p className="details-pill">{event.startsAt}</p>
              <p className="details-pill">{event.priceLabel}</p>
              <p className="details-pill">Статус: {event.status}</p>
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
