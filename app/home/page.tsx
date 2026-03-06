import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { LiquidGlassPanel } from "@/src/components/LiquidGlassPanel";
import { ResponsivePhoto } from "@/src/components/responsive-photo";
import { getEventsFromDb } from "@/src/lib/server-data";

type HomePageProps = {
  searchParams: Promise<{ city?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const events = await getEventsFromDb();
  const city = params.city && params.city.trim().length > 0 ? params.city : "Москва";
  const cityEvents = events.filter((event) => event.city === city && event.status !== "finished");

  return (
    <AppShell title="Встречи в городе" subtitle={`Город: ${city}`}>
      <div className="screen-stack">
        <LiquidGlassPanel>
          <p className="muted">Главный экран</p>
          <p className="mt-2 muted">Актуальные встречи, живые локации и места в реальном времени из Supabase.</p>
        </LiquidGlassPanel>

        <div className="event-grid">
          {cityEvents.map((event) => (
            <LiquidGlassCard key={event.id}>
              <ResponsivePhoto src={event.coverImageUrl} alt={event.title} />
              <h2 className="event-title">{event.title}</h2>
              <p className="event-meta">{event.description}</p>
              <div className="details-grid">
                <p className="details-pill">{event.startsAt}</p>
                <p className="details-pill">{event.priceLabel}</p>
                <p className="details-pill">Занято: {event.paidCount}</p>
                <p className="details-pill">Осталось: {event.spotsLeft}</p>
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
