import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { getEventByIdFromDb } from "@/src/lib/server-data";

type EventSuccessPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventSuccessPage({ params }: EventSuccessPageProps) {
  const { id } = await params;
  const event = await getEventByIdFromDb(id);

  if (!event) notFound();

  return (
    <AppShell title="Вы записаны" subtitle="Место закреплено за вами">
      <div className="screen-stack">
        <LiquidGlassCard>
          <figure className="event-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.venueImageUrl} alt={event.title} />
          </figure>
          <h2 className="event-title">{event.title}</h2>
          <p className="event-meta">Дата: {event.startsAt}</p>
          <p className="event-meta">Адрес: {event.location}</p>
          <p className="event-meta">Дресс-код: smart casual</p>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <h2 className="event-title">Что дальше</h2>
          <p className="event-meta">После завершения встречи откроется раздел «Участники встречи» со взаимными симпатиями.</p>
        </LiquidGlassCard>

        <Link href="/post-event">
          <LiquidGlassButton>Открыть раздел после встречи</LiquidGlassButton>
        </Link>
      </div>
    </AppShell>
  );
}
