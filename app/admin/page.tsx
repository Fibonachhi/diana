import { AppShell } from "@/src/components/app-shell";
import { ADMIN_EVENTS } from "@/src/lib/mock-data";

export default function AdminPage() {
  return (
    <AppShell title="Админка" subtitle="Управление городами, событиями, участниками, оплатами и мэтчингом">
      <div className="space-y-4 text-sm text-black/80">
        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Быстрые действия</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="secondary-btn text-sm">+ Создать город</button>
            <button className="secondary-btn text-sm">+ Создать событие</button>
            <button className="secondary-btn text-sm">Открыть продажи</button>
            <button className="secondary-btn text-sm">Закрыть продажи</button>
            <button className="secondary-btn text-sm">Завершить событие</button>
            <button className="secondary-btn text-sm">Открыть matching</button>
          </div>
        </section>

        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">События</p>
          <div className="mt-3 space-y-2">
            {ADMIN_EVENTS.map((event) => (
              <article key={event.id} className="rounded-xl border border-black/10 bg-white p-3">
                <p className="font-semibold">{event.title}</p>
                <p className="mt-1 text-black/70">{event.city} · {event.startsAt}</p>
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-black/65">
                  <p>Статус: {event.status}</p>
                  <p className="text-right">Оплачено: {event.paid}</p>
                  <p>Резерв: {event.waitlist}</p>
                  <p className="text-right">Осталось мест: {event.spotsLeft}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Участники и attendance</p>
          <p className="mt-1">Отмечайте present / no_show, переводите из резерва и выгружайте CSV.</p>
        </section>
      </div>
    </AppShell>
  );
}
