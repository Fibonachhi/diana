import { AppShell } from "@/src/components/app-shell";

export default function MePage() {
  return (
    <AppShell title="Мой профиль" subtitle="Профиль, билеты, резерв, история и приватность контактов">
      <div className="space-y-3 text-sm text-black/80">
        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Профиль</p>
          <p className="mt-1">Имя, возраст, город, фото, bio и интересы.</p>
          <p className="mt-1">Настройка: показывать username только после мэтча.</p>
        </section>

        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Активные записи</p>
          <p className="mt-1">Книжный клуб знакомств · 14 марта · статус: paid.</p>
        </section>

        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">Резерв</p>
          <p className="mt-1">Кино-встреча · место 3 в листе ожидания.</p>
        </section>

        <section className="rounded-2xl bg-black/5 p-4">
          <p className="font-semibold">История посещений</p>
          <p className="mt-1">2 завершённые встречи, 1 открытый пост-ивент мэтчинг.</p>
        </section>
      </div>
    </AppShell>
  );
}
