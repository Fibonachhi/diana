import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { LiquidGlassPanel } from "@/src/components/LiquidGlassPanel";
import { getEventByIdFromDb } from "@/src/lib/server-data";

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = await params;
  const event = await getEventByIdFromDb(id);

  if (!event) notFound();

  return (
    <AppShell title="Детали встречи" subtitle={event.title}>
      <div className="screen-stack">
        <LiquidGlassCard>
          <figure className="event-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.coverImageUrl} alt={event.title} />
          </figure>
          <p className="eyebrow">Сценарий встречи</p>
          <h2 className="screen-title mt-2">Вечер знакомств через книги</h2>
          <p className="mt-3 muted">10 мужчин, 10 женщин, 3 раунда общения и мягкая модерация.</p>
          <p className="mt-2 muted">После встречи вы сможете выбрать симпатию в разделе участников.</p>
          <div className="details-grid">
            <p className="details-pill">Дата: {event.startsAt}</p>
            <p className="details-pill">Формат: офлайн</p>
            <p className="details-pill">Мест: {event.spotsLeft}</p>
            <p className="details-pill">Вход: {event.priceLabel}</p>
          </div>
        </LiquidGlassCard>

        <LiquidGlassPanel>
          <figure className="event-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.venueImageUrl} alt="Локация" />
          </figure>
          <p className="muted">Локация: {event.location}</p>
          <p className="mt-2 muted">Дресс-код: smart casual.</p>
        </LiquidGlassPanel>

        <Link href={`/events/${event.id}/success`}>
          <LiquidGlassButton variant="accent">Я иду</LiquidGlassButton>
        </Link>
      </div>
    </AppShell>
  );
}
