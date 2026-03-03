import { AppShell } from "@/src/components/app-shell";

export default function MePage() {
  return (
    <AppShell title="Профиль" subtitle="Личные данные, билеты, резерв и история посещений">
      <div className="space-y-3 text-sm">
        <div className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Профиль</p>
          <p className="mt-1 text-black/70">Имя, город, возраст, фото и приватность контактов.</p>
        </div>
        <div className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Мои записи</p>
          <p className="mt-1 text-black/70">Активные события, оплаты, резерв и посещенные мероприятия.</p>
        </div>
        <div className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Мэтчи</p>
          <p className="mt-1 text-black/70">Romantic и Friendly мэтчи после завершенных встреч.</p>
        </div>
      </div>
    </AppShell>
  );
}
