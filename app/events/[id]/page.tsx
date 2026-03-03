import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/src/components/app-shell";
import { EVENTS } from "@/src/lib/mock-data";

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = await params;
  const event = EVENTS.find((item) => item.id === id);

  if (!event) {
    notFound();
  }

  return (
    <AppShell title={event.title} subtitle={`${event.city} · ${event.startsAt}`}>
      <div className="space-y-4 text-sm text-black/80">
        <section className="rounded-2xl bg-black/5 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-black/45">О мероприятии</p>
          <h2 className="mt-2 text-xl font-semibold text-black">Вечер знакомств через книги</h2>
          <p className="mt-2">10 мужчин, 10 женщин, 3 раунда общения.</p>
          <p className="mt-1">После встречи вы сможете выбрать симпатию.</p>
        </section>

        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Детали</p>
          <ul className="mt-2 space-y-1 text-black/75">
            <li>Дата: {event.startsAt}</li>
            <li>Локация: {event.address}</li>
            <li>Возраст: {event.ageLabel}</li>
            <li>Осталось мест: {event.spotsLeft}</li>
            <li>Стоимость: {event.priceLabel}</li>
          </ul>
        </section>

        <Link href={`/events/${event.id}/success`} className="primary-btn">
          Я иду
        </Link>
      </div>
    </AppShell>
  );
}
