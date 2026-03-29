import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { getEventsFromDb } from "@/src/lib/server-data";

type HomePageProps = {
  searchParams: Promise<{ city?: string }>;
};

const games = [
  { title: "Кино-квиз", desc: "Угадай героя фильма за 20 секунд", reward: "+25 поинтов", tag: "🎬" },
  { title: "Литературный стиль", desc: "Определи жанр по отрывку", reward: "+20 поинтов", tag: "📖" },
  { title: "Chess Rush", desc: "Найди лучший ход в мини-позиции", reward: "+30 поинтов", tag: "♟️" },
  { title: "Охота на сырок", desc: "Найди сырок среди объектов", reward: "+15 поинтов", tag: "🍫" },
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const city = params.city && params.city.trim().length > 0 ? params.city : "Москва";
  const events = await getEventsFromDb();
  const cityEvents = events.filter((event) => event.city === city && event.status !== "finished").slice(0, 2);

  return (
    <AppShell title="Игровой клуб знакомств" subtitle={`Город: ${city} · Ежедневные активности и живые встречи`}>
      <section className="hub-grid">
        <LiquidGlassCard>
          <div className="hub-headline">
            <p className="eyebrow">Сегодняшний прогресс</p>
            <h2>Уровень 4: киноман-стратег</h2>
            <p className="event-meta">Сыграйте 2 мини-игры и получите скидку 12% на следующий билет.</p>
          </div>
          <div className="hub-metrics">
            <div className="hub-metric">
              <span>Поинты</span>
              <strong>740</strong>
            </div>
            <div className="hub-metric">
              <span>Серия дней</span>
              <strong>6</strong>
            </div>
            <div className="hub-metric">
              <span>Скидка</span>
              <strong>12%</strong>
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <p className="eyebrow">Карта людей рядом</p>
          <h3 className="event-title mt-2">City Radar</h3>
          <p className="event-meta">Разрешите геопозицию и увидите участников, готовых к встречам сейчас.</p>
          <div className="map-preview" aria-hidden>
            <span className="map-dot map-dot-a" />
            <span className="map-dot map-dot-b" />
            <span className="map-dot map-dot-c" />
            <span className="map-dot map-dot-you" />
          </div>
          <LiquidGlassButton variant="accent">Открыть карту</LiquidGlassButton>
        </LiquidGlassCard>
      </section>

      <section className="games-strip">
        <div className="section-row">
          <h2>Игры дня</h2>
          <Link href="/me" className="section-link">Рейтинг</Link>
        </div>
        <div className="games-scroll">
          {games.map((game) => (
            <article key={game.title} className="game-card liquidGlass">
              <span className="glassEdge" />
              <p className="game-emoji">{game.tag}</p>
              <h3>{game.title}</h3>
              <p>{game.desc}</p>
              <strong>{game.reward}</strong>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-row">
          <h2>Ближайшие встречи</h2>
          <Link href="/events" className="section-link">Вся афиша</Link>
        </div>
        <div className="event-grid event-grid-compact">
          {cityEvents.map((event) => (
            <LiquidGlassCard key={event.id}>
              <p className="eyebrow">{event.city}</p>
              <h3 className="event-title mt-2">{event.title}</h3>
              <div className="details-grid details-grid-compact">
                <p className="details-pill">{event.startsAt}</p>
                <p className="details-pill">{event.priceLabel}</p>
                <p className="details-pill">Осталось: {event.spotsLeft}</p>
              </div>
              <Link href={`/events/${event.id}`} className="mt-4 block">
                <LiquidGlassButton variant="accent">Открыть событие</LiquidGlassButton>
              </Link>
            </LiquidGlassCard>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
