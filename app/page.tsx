import { AppShell } from "@/src/components/app-shell";
import { TelegramAuthBootstrap } from "@/src/components/telegram-auth-bootstrap";

export default function HomePage() {
  return (
    <AppShell
      title="Mini App"
      subtitle="Кастомная платформа для офлайн-встреч, оплат и пост-ивент мэтчинга"
    >
      <div className="space-y-4 text-sm text-black/80">
        <div className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Статус запуска</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Telegram WebApp подключен</li>
            <li>Supabase проект подключен</li>
            <li>Vercel production развернут</li>
          </ul>
          <TelegramAuthBootstrap />
        </div>

        <div className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">MVP поток</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Онбординг и профиль</li>
            <li>Выбор города и запись на событие</li>
            <li>Оплата и подтверждение участия</li>
            <li>После события: свайпы и мэтчи</li>
          </ol>
        </div>
      </div>
    </AppShell>
  );
}
