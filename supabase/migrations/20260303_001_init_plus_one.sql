-- Plus One MVP schema
-- Generated on 2026-03-03

create extension if not exists pgcrypto;

-- Enums
create type gender_t as enum ('male', 'female', 'other', 'unknown');
create type role_t as enum ('user', 'admin', 'organizer');
create type event_status_t as enum ('draft', 'scheduled', 'sales_open', 'sold_out', 'finished', 'canceled');
create type registration_status_t as enum ('reserved', 'pending_payment', 'paid', 'canceled', 'expired', 'refunded');
create type waitlist_status_t as enum ('waiting', 'offered', 'accepted', 'expired', 'canceled');
create type payment_status_t as enum ('created', 'pending', 'succeeded', 'failed', 'canceled', 'refunded');
create type attendance_status_t as enum ('unknown', 'present', 'no_show');
create type swipe_type_t as enum ('skip', 'romantic', 'friendly');
create type match_type_t as enum ('romantic', 'friendly');

-- Tables
create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint not null unique,
  first_name text,
  last_name text,
  username text,
  city_id uuid references cities(id) on delete set null,
  gender gender_t not null default 'unknown',
  birthdate date,
  bio text,
  photo_urls text[] not null default '{}',
  allow_show_username boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roles (
  user_id uuid primary key references profiles(id) on delete cascade,
  role role_t not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete restrict,
  title text not null,
  format text,
  description text,
  starts_at timestamptz not null,
  location_text text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'RUB',
  capacity integer not null check (capacity > 0),
  status event_status_t not null default 'draft',
  sales_open boolean not null default false,
  matching_open boolean not null default false,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status registration_status_t not null,
  source text not null default 'web',
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  position integer,
  status waitlist_status_t not null default 'waiting',
  offer_expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  event_registration_id uuid not null references event_registrations(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'RUB',
  status payment_status_t not null default 'created',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status attendance_status_t not null default 'unknown',
  marked_by uuid references profiles(id) on delete set null,
  marked_at timestamptz,
  unique (event_id, user_id)
);

create table if not exists swipes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  from_user_id uuid not null references profiles(id) on delete cascade,
  to_user_id uuid not null references profiles(id) on delete cascade,
  type swipe_type_t not null,
  created_at timestamptz not null default now(),
  unique (event_id, from_user_id, to_user_id),
  check (from_user_id <> to_user_id)
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_a uuid not null references profiles(id) on delete cascade,
  user_b uuid not null references profiles(id) on delete cascade,
  type match_type_t not null,
  created_at timestamptz not null default now(),
  unique (event_id, user_a, user_b, type),
  check (user_a < user_b)
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  event_id uuid references events(id) on delete set null,
  name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_events_city_status_starts on events(city_id, status, starts_at);
create index if not exists idx_regs_event_status on event_registrations(event_id, status);
create index if not exists idx_waitlist_event_status_created on waitlist(event_id, status, created_at);
create index if not exists idx_swipes_event_from on swipes(event_id, from_user_id);
create index if not exists idx_matches_event_user_a on matches(event_id, user_a);
create index if not exists idx_matches_event_user_b on matches(event_id, user_b);

-- Helpers
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function is_admin_or_organizer()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from roles r
    where r.user_id = auth.uid()
      and r.role in ('admin', 'organizer')
  );
$$;

create or replace function can_access_event_match_deck(event_id_param uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from events e
    join attendance a on a.event_id = e.id and a.user_id = auth.uid()
    where e.id = event_id_param
      and e.status = 'finished'
      and e.matching_open = true
      and a.status = 'present'
  );
$$;

-- Triggers

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
before update on profiles
for each row execute function set_updated_at();

drop trigger if exists trg_events_updated_at on events;
create trigger trg_events_updated_at
before update on events
for each row execute function set_updated_at();

drop trigger if exists trg_payments_updated_at on payments;
create trigger trg_payments_updated_at
before update on payments
for each row execute function set_updated_at();

-- RLS
alter table cities enable row level security;
alter table profiles enable row level security;
alter table roles enable row level security;
alter table events enable row level security;
alter table event_registrations enable row level security;
alter table waitlist enable row level security;
alter table payments enable row level security;
alter table attendance enable row level security;
alter table swipes enable row level security;
alter table matches enable row level security;
alter table analytics_events enable row level security;

-- cities
create policy "cities_select_all" on cities
for select using (true);

create policy "cities_admin_write" on cities
for all using (is_admin_or_organizer())
with check (is_admin_or_organizer());

-- profiles
create policy "profiles_select_self" on profiles
for select using (id = auth.uid());

create policy "profiles_update_self" on profiles
for update using (id = auth.uid())
with check (id = auth.uid());

create policy "profiles_insert_self" on profiles
for insert with check (id = auth.uid());

create policy "profiles_admin_read_all" on profiles
for select using (is_admin_or_organizer());

-- roles
create policy "roles_self_read" on roles
for select using (user_id = auth.uid());

create policy "roles_admin_manage" on roles
for all using (is_admin_or_organizer())
with check (is_admin_or_organizer());

-- events
create policy "events_public_read" on events
for select using (true);

create policy "events_admin_write" on events
for all using (is_admin_or_organizer())
with check (is_admin_or_organizer());

-- registrations
create policy "regs_user_read_own" on event_registrations
for select using (user_id = auth.uid());

create policy "regs_user_insert_own" on event_registrations
for insert with check (user_id = auth.uid());

create policy "regs_user_update_own" on event_registrations
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "regs_admin_read_all" on event_registrations
for select using (is_admin_or_organizer());

create policy "regs_admin_manage" on event_registrations
for all using (is_admin_or_organizer())
with check (is_admin_or_organizer());

-- waitlist
create policy "waitlist_user_read_own" on waitlist
for select using (user_id = auth.uid());

create policy "waitlist_user_insert_own" on waitlist
for insert with check (user_id = auth.uid());

create policy "waitlist_user_update_own" on waitlist
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "waitlist_admin_manage" on waitlist
for all using (is_admin_or_organizer())
with check (is_admin_or_organizer());

-- payments
create policy "payments_user_read_own" on payments
for select using (
  exists (
    select 1
    from event_registrations r
    where r.id = payments.event_registration_id
      and r.user_id = auth.uid()
  )
);

create policy "payments_admin_manage" on payments
for all using (is_admin_or_organizer())
with check (is_admin_or_organizer());

-- attendance
create policy "attendance_user_read_own" on attendance
for select using (user_id = auth.uid());

create policy "attendance_admin_manage" on attendance
for all using (is_admin_or_organizer())
with check (is_admin_or_organizer());

-- swipes
create policy "swipes_user_read_own" on swipes
for select using (from_user_id = auth.uid());

create policy "swipes_user_insert_own" on swipes
for insert with check (
  from_user_id = auth.uid()
  and can_access_event_match_deck(event_id)
);

-- matches
create policy "matches_user_read_participant" on matches
for select using (user_a = auth.uid() or user_b = auth.uid());

create policy "matches_admin_read_all" on matches
for select using (is_admin_or_organizer());

-- analytics
create policy "analytics_user_insert_own" on analytics_events
for insert with check (user_id = auth.uid());

create policy "analytics_admin_read_all" on analytics_events
for select using (is_admin_or_organizer());
