import Link from "next/link";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { EVENTS } from "@/src/lib/mock-data";

export default function PostEventPage() {
  return (
    <AppShell title="После мероприятия" subtitle="Участники встречи становятся доступны после статуса finished">
      <div className="event-grid">
        {EVENTS.map((event) => (
          <LiquidGlassCard key={event.id}>
            <h2 className="event-title">{event.title}</h2>
            <p className="event-meta">{event.startsAt}</p>
            <p className="event-meta">Окно симпатий откроется после завершения встречи админом.</p>
            <Link href={`/post-event/${event.id}`} className="mt-4 block">
              <LiquidGlassButton variant="accent">Участники встречи</LiquidGlassButton>
            </Link>
          </LiquidGlassCard>
        ))}
      </div>
    </AppShell>
  );
}
