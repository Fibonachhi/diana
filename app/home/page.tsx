import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { EVENTS } from "@/src/lib/mock-data";

export default function HomePage() {
  const primaryCity = "Москва";
  const cityEvents = EVENTS.filter((event) => event.city === primaryCity);

  return (
    <AppShell title="Ближайшие встречи" subtitle={`Город: ${primaryCity}`}>
      <div className="space-y-3">
        {cityEvents.map((event) => (
          <article key={event.id} className="event-card">
            <h3 className="text-lg font-semibold leading-tight">{event.title}</h3>
            <p className="mt-2 text-sm text-black/70">{event.startsAt}</p>
            <p className="mt-1 text-sm text-black/65">Возраст: {event.ageLabel}</p>
            <p className="mt-1 text-sm text-black/65">Осталось мест: {event.spotsLeft}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-base font-semibold">{event.priceLabel}</span>
              <Link href={`/events/${event.id}`} className="primary-btn inline-flex w-auto px-4 py-2 text-sm">
                Пойти
              </Link>
            </div>
          </article>
        ))}

        <Link href="/events" className="secondary-btn">
          Посмотреть все события
        </Link>
      </div>
    </AppShell>
  );
}
