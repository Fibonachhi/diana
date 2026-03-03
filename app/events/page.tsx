import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { EVENTS } from "@/src/lib/mock-data";

export default function EventsPage() {
  return (
    <AppShell title="Афиша встреч" subtitle="Выберите формат и мероприятие в вашем городе">
      <div className="space-y-3">
        {EVENTS.map((event) => (
          <article key={event.id} className="event-card">
            <p className="text-xs uppercase tracking-[0.14em] text-black/45">{event.city}</p>
            <h3 className="mt-2 text-lg font-semibold leading-tight">{event.title}</h3>
            <p className="mt-2 text-sm text-black/75">{event.shortDescription}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-black/65">
              <p>{event.startsAt}</p>
              <p className="text-right">{event.priceLabel}</p>
              <p>Возраст: {event.ageLabel}</p>
              <p className="text-right">Осталось мест: {event.spotsLeft}</p>
            </div>
            <Link href={`/events/${event.id}`} className="primary-btn mt-4">
              Пойти
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
