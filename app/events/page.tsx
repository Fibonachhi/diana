import { AppShell } from "@/src/components/app-shell";

const mockEvents = [
  {
    id: "1",
    title: "Книжный клуб: современная проза",
    city: "Москва",
    date: "2026-03-14 19:00",
    price: "3500 ₽",
    status: "sales_open",
  },
  {
    id: "2",
    title: "Киноужин: разбор фильма",
    city: "Москва",
    date: "2026-03-20 20:00",
    price: "4500 ₽",
    status: "scheduled",
  },
];

export default function EventsPage() {
  return (
    <AppShell title="События" subtitle="Ближайшие мероприятия в выбранном городе">
      <div className="space-y-3">
        {mockEvents.map((event) => (
          <article key={event.id} className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-black/50">{event.city}</p>
            <h3 className="mt-1 text-base font-semibold">{event.title}</h3>
            <p className="mt-2 text-sm text-black/70">{event.date}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold">{event.price}</span>
              <span className="rounded-lg bg-black/10 px-2 py-1 text-xs">{event.status}</span>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
