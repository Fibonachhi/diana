import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { EVENTS } from "@/src/lib/mock-data";

export default function PostEventPage() {
  return (
    <AppShell title="После мероприятия" subtitle="Раздел с участниками открывается после завершения встречи">
      <div className="space-y-3">
        {EVENTS.map((event) => (
          <article key={event.id} className="event-card">
            <h3 className="text-lg font-semibold leading-tight">{event.title}</h3>
            <p className="mt-2 text-sm text-black/70">{event.startsAt}</p>
            <p className="mt-1 text-sm text-black/70">Участники встречи: доступно после статуса finished</p>
            <Link href={`/post-event/${event.id}`} className="primary-btn mt-4">
              Участники встречи
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
