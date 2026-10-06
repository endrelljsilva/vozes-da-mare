-- Vozes da Maré — esquema inicial (Fase 4+)
-- Executar no SQL Editor do Supabase. RLS habilitado em todas as tabelas.

create table if not exists public.fish (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scientific_name text not null,
  description text,
  habitat text,
  fishing_information text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.health_units (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  address text,
  phone text,
  latitude double precision not null,
  longitude double precision not null,
  opening_hours text,
  created_at timestamptz not null default now()
);

create table if not exists public.map_points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('fishing_point','river','mangrove','health','risk','boat_point','other')),
  description text,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

create table if not exists public.risk_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  severity text not null check (severity in ('low','medium','high')),
  latitude double precision,
  longitude double precision,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text not null check (type in ('risk','fish','water','weather','other')),
  description text,
  latitude double precision,
  longitude double precision,
  image_url text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.fish enable row level security;
alter table public.health_units enable row level security;
alter table public.map_points enable row level security;
alter table public.risk_alerts enable row level security;
alter table public.community_reports enable row level security;

-- Leitura pública (dados educativos/locais); escrita restrita a usuários autenticados.
create policy "fish public read" on public.fish for select using (true);
create policy "health_units public read" on public.health_units for select using (true);
create policy "map_points public read" on public.map_points for select using (true);
create policy "risk_alerts public read" on public.risk_alerts for select using (true);
create policy "community_reports authenticated read" on public.community_reports for select using (auth.role() = 'authenticated');
create policy "community_reports authenticated insert" on public.community_reports for insert with check (auth.role() = 'authenticated');
