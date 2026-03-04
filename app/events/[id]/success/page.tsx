import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { EVENTS } from "@/src/lib/mock-data";

type EventSuccessPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventSuccessPage({ params }: EventSuccessPageProps) {
  const { id } = await params;
  const event = EVENTS.find((item) => item.id === id);

  if (!event) notFound();

  return (
    <AppShell title="Вы записаны" subtitle="Место закреплено за вами">
      <div className="screen-stack">
        <LiquidGlassCard>
          <h2 className="event-title">{event.title}</h2>
          <p className="event-meta">Дата: {event.startsAt}</p>
          <p className="event-meta">Адрес: {event.address}</p>
          <p className="event-meta">Дресс-код: {event.dressCode}</p>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <h2 className="event-title">Что дальше</h2>
          <p className="event-meta">После завершения встречи откроется раздел «Участники встречи» со взаимными симпатиями.</p>
        </LiquidGlassCard>

        <Link href="/post-event">
          <LiquidGlassButton>Перейти в раздел после встречи</LiquidGlassButton>
        </Link>
      </div>
    </AppShell>
  );
}
