# Plus One Mini App

Telegram Mini App for project "Плюс один".

## Stack

- Next.js 16 + TypeScript (App Router)
- Supabase Postgres + RLS
- Supabase Edge Functions (scaffold)
- Vercel

## Current Phase

Implemented (Phase 1):

- App shell and user routes:
  - `/`
  - `/events`
  - `/me`
  - `/admin`
- Telegram initData auth endpoint:
  - `POST /api/auth/telegram`
- Supabase schema + RLS migration:
  - `supabase/migrations/20260303_001_init_plus_one.sql`
- Edge function scaffold:
  - `supabase/functions/telegram-auth/index.ts`

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=

# local ops
SUPABASE_ACCESS_TOKEN=
GITHUB_FINE_GRAINED_PAT=
VERCEL_TOKEN=
```

## Supabase

Migration already applied to project `hochlyqmyhhkshtqzekh`.

Main tables:

- `profiles`
- `cities`
- `events`
- `event_registrations`
- `waitlist`
- `payments`
- `attendance`
- `swipes`
- `matches`
- `roles`
- `analytics_events`

All have RLS enabled.

## Next Phase (Phase 2)

- Event CRUD in admin
- Registration + waitlist flow
- Payment create + webhook
- Hold expiration job (`pending_payment` -> `expired`)
