import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { ResponsivePhoto } from "@/src/components/responsive-photo";
import { getEventsFromDb } from "@/src/lib/server-data";

export default async function PostEventPage() {
  const events = await getEventsFromDb();
  const doneEvents = events.filter((event) => event.status === "finished");
  const displayEvents = doneEvents.length > 0 ? doneEvents : events.slice(0, 1);

  return (
    <AppShell title="После мероприятия" subtitle="Здесь открываются участники уже завершённых встреч">
      {doneEvents.length === 0 ? (
        <LiquidGlassCard>
          <h2 className="event-title">Свайпы готовы</h2>
          <p className="event-meta">
            В данных пока нет события со статусом <b>finished</b>, поэтому показываем демо-карточку для проверки механики.
          </p>
        </LiquidGlassCard>
      ) : null}
      <div className="event-grid">
        {displayEvents.map((event) => (
          <LiquidGlassCard key={event.id}>
            <ResponsivePhoto src={event.coverImageUrl} alt={event.title} />
            <h2 className="event-title">{event.title}</h2>
            <p className="event-meta">{event.startsAt}</p>
            <p className="event-meta">matching_open: {event.matchingOpen ? "включено" : "выключено"}</p>
            <Link href={`/post-event/${event.id}`} className="mt-4 block">
              <LiquidGlassButton variant="accent">Участники встречи</LiquidGlassButton>
            </Link>
          </LiquidGlassCard>
        ))}
      </div>
    </AppShell>
  );
}
