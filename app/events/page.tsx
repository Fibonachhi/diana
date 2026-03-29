import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { getEventsFromDb } from "@/src/lib/server-data";

function inferFormatLabel(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("кни")) return "📖 Книги";
  if (lower.includes("кино")) return "🎬 Кино";
  if (lower.includes("шах")) return "♟️ Шахматы";
  if (lower.includes("сыр")) return "🍫 Сырки";
  return "✨ Встреча";
}

export default async function EventsPage() {
  const events = await getEventsFromDb();

  return (
    <AppShell title="Афиша встреч" subtitle="Компактная лента событий: открой карточку и записывайся">
      <section className="section-row">
        <h2>Все события</h2>
        <span className="section-link">{events.length} шт.</span>
      </section>

      <div className="event-grid event-grid-compact">
        {events.map((event) => (
          <LiquidGlassCard key={event.id}>
            <div className="event-chip-row">
              <span className="event-chip">{inferFormatLabel(event.title)}</span>
              <span className="event-chip">{event.city}</span>
            </div>
            <h3 className="event-title mt-2">{event.title}</h3>
            <p className="event-meta">{event.description}</p>
            <div className="details-grid details-grid-compact">
              <p className="details-pill">{event.startsAt}</p>
              <p className="details-pill">{event.priceLabel}</p>
              <p className="details-pill">Мест: {event.capacity}</p>
              <p className="details-pill">Осталось: {event.spotsLeft}</p>
            </div>
            <Link href={`/events/${event.id}`} className="mt-4 block">
              <LiquidGlassButton variant="accent">Подробнее и запись</LiquidGlassButton>
            </Link>
          </LiquidGlassCard>
        ))}
      </div>
    </AppShell>
  );
}
