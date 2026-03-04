import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { ResponsivePhoto } from "@/src/components/responsive-photo";
import { getEventsFromDb } from "@/src/lib/server-data";

export default async function AdminPage() {
  const events = await getEventsFromDb();

  return (
    <main className="web-admin-root">
      <div className="web-admin-grid">
        <section className="liquidGlass liquidGlassHover col-span-12 p-5 md:col-span-8">
          <span className="glassEdge" />
          <div className="relative z-10">
            <p className="eyebrow">Admin Web</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Панель Плюс Один</h1>
            <p className="mt-2 text-sm text-slate-200/85">Отдельный web-интерфейс: города, события, оплаты, waitlist, attendance, matching.</p>
          </div>
        </section>

        <section className="col-span-12 grid grid-cols-1 gap-3 md:col-span-4">
          <LiquidGlassCard>
            <p className="eyebrow">Управление</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Операции</h2>
            <div className="mt-3 grid gap-2">
              <LiquidGlassButton variant="accent">Создать событие</LiquidGlassButton>
              <LiquidGlassButton>Открыть/закрыть продажи</LiquidGlassButton>
              <LiquidGlassButton variant="ghost">Экспорт CSV</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        </section>

        <section className="col-span-12 md:col-span-7">
          <LiquidGlassCard>
            <h2 className="text-2xl font-semibold text-white">События из Supabase</h2>
            <div className="mt-3 grid gap-2">
              {events.map((event) => (
                <article key={event.id} className="rounded-xl border border-white/25 bg-white/10 p-3 text-sm text-slate-100">
                  <div className="grid grid-cols-[110px_1fr] gap-3">
                    <ResponsivePhoto src={event.coverImageUrl} alt={event.title} sizes="110px" />
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="mt-1 text-slate-200/85">{event.city} · {event.startsAt}</p>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-200/80">
                        <p>Статус: {event.status}</p>
                        <p className="text-right">Оплачено: {event.paidCount}</p>
                        <p>matching: {event.matchingOpen ? "on" : "off"}</p>
                        <p className="text-right">Осталось: {event.spotsLeft}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </LiquidGlassCard>
        </section>

        <section className="col-span-12 grid grid-cols-1 gap-3 md:col-span-5">
          <LiquidGlassCard>
            <h2 className="text-2xl font-semibold text-white">After Event</h2>
            <p className="mt-2 text-sm text-slate-200/85">Отметки attendance, запуск matching_open и ручное управление списком участников.</p>
            <div className="mt-3 grid gap-2">
              <LiquidGlassButton>Отметить attendance</LiquidGlassButton>
              <LiquidGlassButton variant="accent">Открыть matching</LiquidGlassButton>
              <LiquidGlassButton variant="ghost">Возвраты/отмена билета</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        </section>
      </div>
    </main>
  );
}
