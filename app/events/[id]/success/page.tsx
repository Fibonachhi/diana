import { notFound } from "next/navigation";
import { AppShell } from "@/src/components/app-shell";
import { EVENTS } from "@/src/lib/mock-data";

type EventSuccessPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventSuccessPage({ params }: EventSuccessPageProps) {
  const { id } = await params;
  const event = EVENTS.find((item) => item.id === id);

  if (!event) {
    notFound();
  }

  return (
    <AppShell title="Вы записаны на встречу" subtitle="Оплата подтверждена, место за вами закреплено">
      <div className="space-y-3 text-sm text-black/80">
        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">{event.title}</p>
          <p className="mt-2">Дата: {event.startsAt}</p>
          <p className="mt-1">Адрес: {event.address}</p>
          <p className="mt-1">Дресс-код: {event.dressCode}</p>
        </section>

        <section className="rounded-2xl bg-black/5 p-4">
          <p>После завершения мероприятия откроется раздел «Участники встречи» для взаимных симпатий.</p>
        </section>
      </div>
    </AppShell>
  );
}
