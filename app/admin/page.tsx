import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { ADMIN_EVENTS } from "@/src/lib/mock-data";

export default function AdminPage() {
  return (
    <main className="web-admin-root">
      <div className="web-admin-grid">
        <section className="liquidGlass liquidGlassHover col-span-12 p-5 md:col-span-8">
          <span className="glassEdge" />
          <div className="relative z-10">
            <p className="eyebrow">Admin Web</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Панель Плюс Один</h1>
            <p className="mt-2 text-sm text-slate-200/85">Отдельный web-интерфейс для организатора: города, события, оплаты, reserve и matching.</p>
          </div>
        </section>

        <section className="col-span-12 grid grid-cols-1 gap-3 md:col-span-4">
          <LiquidGlassCard>
            <p className="eyebrow">Управление</p>
            <h2 className="mt-2 text-xl font-semibold text-white">События и продажи</h2>
            <div className="mt-3 grid gap-2">
              <LiquidGlassButton variant="accent">Создать событие</LiquidGlassButton>
              <LiquidGlassButton>Открыть продажи</LiquidGlassButton>
              <LiquidGlassButton variant="ghost">Закрыть продажи</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        </section>

        <section className="col-span-12 md:col-span-7">
          <LiquidGlassCard>
            <h2 className="text-2xl font-semibold text-white">События</h2>
            <div className="mt-3 grid gap-2">
              {ADMIN_EVENTS.map((event) => (
                <article key={event.id} className="rounded-xl border border-white/25 bg-white/10 p-3 text-sm text-slate-100">
                  <p className="font-semibold">{event.title}</p>
                  <p className="mt-1 text-slate-200/85">{event.city} · {event.startsAt}</p>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-200/80">
                    <p>Статус: {event.status}</p>
                    <p className="text-right">Оплачено: {event.paid}</p>
                    <p>Резерв: {event.waitlist}</p>
                    <p className="text-right">Осталось мест: {event.spotsLeft}</p>
                  </div>
                </article>
              ))}
            </div>
          </LiquidGlassCard>
        </section>

        <section className="col-span-12 grid grid-cols-1 gap-3 md:col-span-5">
          <LiquidGlassCard>
            <h2 className="text-2xl font-semibold text-white">After Event</h2>
            <p className="mt-2 text-sm text-slate-200/85">attendance: present/no_show, запуск matching_open, ручные действия по участникам.</p>
            <div className="mt-3 grid gap-2">
              <LiquidGlassButton>Отметить attendance</LiquidGlassButton>
              <LiquidGlassButton variant="accent">Открыть matching</LiquidGlassButton>
              <LiquidGlassButton variant="ghost">Экспорт CSV</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        </section>
      </div>
    </main>
  );
}
