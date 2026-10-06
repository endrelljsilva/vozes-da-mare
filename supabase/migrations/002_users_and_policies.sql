-- Vozes da Maré — perfis de usuário e políticas de escrita.
-- Complementa 001_init.sql. Executar depois da primeira migração.

-- Tabela "users": espelho de auth.users com os dados de perfil que o app usa.
-- Não guarda senha nem chave — autenticação fica inteiramente no Supabase Auth.
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  village text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Cada pessoa vê e edita apenas o próprio perfil.
create policy "users read own" on public.users
  for select using (auth.uid() = id);

create policy "users insert own" on public.users
  for insert with check (auth.uid() = id);

create policy "users update own" on public.users
  for update using (auth.uid() = id);

-- Preenchimento automático do perfil no primeiro login.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Políticas de escrita dos dados curados.
-- Só conta autenticada edita; o app lê com a anon key.
create policy "fish authenticated write" on public.fish
  for insert with check (auth.role() = 'authenticated');
create policy "fish authenticated update" on public.fish
  for update using (auth.role() = 'authenticated');
create policy "fish authenticated delete" on public.fish
  for delete using (auth.role() = 'authenticated');

create policy "health_units authenticated write" on public.health_units
  for insert with check (auth.role() = 'authenticated');
create policy "health_units authenticated update" on public.health_units
  for update using (auth.role() = 'authenticated');
create policy "health_units authenticated delete" on public.health_units
  for delete using (auth.role() = 'authenticated');

create policy "map_points authenticated write" on public.map_points
  for insert with check (auth.role() = 'authenticated');
create policy "map_points authenticated update" on public.map_points
  for update using (auth.role() = 'authenticated');
create policy "map_points authenticated delete" on public.map_points
  for delete using (auth.role() = 'authenticated');

-- Relatos da comunidade: o autor lê e apaga os próprios; a equipe de moderação
-- vê todos. Nunca é público, porque pode envolver dados de saúde.
create policy "community_reports read own or moderator" on public.community_reports
  for select using (auth.uid() = user_id or exists (select 1 from public.users where id = auth.uid()));
create policy "community_reports delete own" on public.community_reports
  for delete using (auth.uid() = user_id);
create policy "community_reports update own while pending" on public.community_reports
  for update using (auth.uid() = user_id and status = 'pending');

-- Imagens de relato ficam em bucket privado; URLs são servidas por signed URL.