# Diana Mini App

MVP Telegram Mini App для блоггера Дианы Листопад.

## Stack

- Next.js 16 (App Router)
- Telegram WebApp JS API
- Supabase
- Vercel

## Быстрый старт

```bash
npm install
cp .env.example .env.local
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## ENV

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TELEGRAM_BOT_TOKEN=
```

## Что нужно для запуска в Telegram

1. Созданный бот в BotFather.
2. Деплой на Vercel с HTTPS URL.
3. В BotFather (`/mybots` -> Bot Settings -> Menu Button) указать URL Mini App.
4. Подключить таблицы в Supabase и RLS-политики.

## Следующие шаги

1. Добавить серверную валидацию `initData` по `TELEGRAM_BOT_TOKEN`.
2. Сохранение/обновление пользователя в `profiles` через Supabase.
3. Бизнес-экраны Дианы: контент, заявки, оплаты/подписки.
