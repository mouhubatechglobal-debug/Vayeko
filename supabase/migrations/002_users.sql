-- =============================================================================
-- Vayeko V1 — Migration 002 : profils utilisateurs
-- =============================================================================

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  full_name   text check (char_length(full_name) <= 80),
  avatar_url  text check (avatar_url is null or char_length(avatar_url) <= 500),
  phone       text check (phone is null or char_length(phone) <= 20),
  whatsapp    text check (whatsapp is null or char_length(whatsapp) <= 20),
  role        text not null default 'user' check (role in ('user', 'merchant', 'provider', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- Suppression douce : on conserve l'audit tout en masquant le profil
  deleted_at  timestamptz
);
-- Fonctions RLS utilitaires (déplacées ici car elles lisent cette table)
-- Rôle applicatif de l'utilisateur courant (profiles défini en migration 002)
create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- L'utilisateur courant est-il admin ?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and deleted_at is null
  );
$$;


create unique index if not exists profiles_username_lower_uidx
  on public.profiles (lower(username)) where username is not null;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription (Supabase Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username, role)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    null,
    'user'  -- rôle par défaut : jamais hérité des métadonnées utilisateur !
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Empêche l'auto-élévation de privilèges : seul un admin peut changer un rôle.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Cheat detected: seul un administrateur peut modifier un rôle.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update of role on public.profiles
  for each row execute function public.prevent_role_escalation();

-- -----------------------------------------------------------------------------
-- Row Level Security — profiles
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Lecture publique limitée (fiches prestataires/vendeurs, auteurs d'avis)
drop policy if exists profiles_select_public on public.profiles;
create policy profiles_select_public on public.profiles
  for select
  using (deleted_at is null);

-- Modification : uniquement son propre profil (role protégé par trigger)
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update
  using (auth.uid() = id);

-- Insertion réservée au trigger (security definer) — aucune insertion API directe
drop policy if exists profiles_insert_none on public.profiles;
create policy profiles_insert_none on public.profiles
  for insert
  with check (false);

-- Les suppressions sont gérées par un administrateur (suppression douce)
drop policy if exists profiles_delete_admin on public.profiles;
create policy profiles_delete_admin on public.profiles
  for delete
  using (public.is_admin());
