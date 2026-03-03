import { AppShell } from "@/src/components/app-shell";

const adminActions = [
  "CRUD городов",
  "CRUD мероприятий",
  "Статусы продаж и завершение события",
  "Управление участниками, резервом и attendance",
  "Экспорт CSV",
];

export default function AdminPage() {
  return (
    <AppShell title="Админка" subtitle="Панель организатора для управления мероприятиями">
      <ul className="list-disc space-y-2 pl-5 text-sm text-black/80">
        {adminActions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
    </AppShell>
  );
}
