-- =============================================================================
-- Vayeko V1 — Migration 001 : fondations (extensions, fonctions communes, RBAC)
-- =============================================================================

-- Extensions requises (PostGIS = géolocalisation, pgcrypto = UUIDs, trigrammes = recherche)
create extension if not exists postgis;
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- -----------------------------------------------------------------------------
-- Tables RBAC (roles / permissions) — complète le rôle simple de profiles.role
-- -----------------------------------------------------------------------------
create table if not exists public.roles (
  id          smallserial primary key,
  name        text not null unique,
  description text
);

create table if not exists public.permissions (
  id          smallserial primary key,
  name        text not null unique,
  description text
);

create table if not exists public.role_permissions (
  role_id       smallint not null references public.roles(id) on delete cascade,
  permission_id smallint not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

insert into public.roles (name, description) values
  ('user', 'Utilisateur standard'),
  ('merchant', 'Commerçant (boutique/produits)'),
  ('provider', 'Prestataire de services'),
  ('admin', 'Administrateur plateforme')
on conflict (name) do nothing;

insert into public.permissions (name, description) values
  ('business.create', 'Créer un commerce'),
  ('business.manage', 'Gérer un commerce'),
  ('product.manage', 'Gérer des produits'),
  ('service.manage', 'Gérer des services'),
  ('review.create', 'Publier un avis'),
  ('report.create', 'Créer un signalement'),
  ('admin.moderate', 'Modérer les contenus'),
  ('admin.users', 'Gérer les utilisateurs'),
  ('admin.businesses', 'Gérer les commerces')
on conflict (name) do nothing;

-- user → review.create, report.create
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r, public.permissions p
where r.name = 'user' and p.name in ('review.create', 'report.create')
on conflict do nothing;

-- merchant / provider → gestion métier
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r, public.permissions p
where r.name in ('merchant', 'provider')
  and p.name in ('business.create', 'business.manage', 'product.manage', 'service.manage', 'review.create', 'report.create')
on conflict do nothing;

-- admin → tout
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r, public.permissions p
where r.name = 'admin'
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Fonctions utilitaires (updated_at, rôle courant, appartenance)
-- security definer + search_path figé = pas de récursion RLS, pas d'injection.
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

-- L'utilisateur courant est-il membre d'une entreprise ?
create or replace function public.is_business_member(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.business_members
    where business_id = p_business_id and profile_id = auth.uid()
  );
$$;

-- L'utilisateur courant gère-t-il une boutique ? (via business_members)
create or replace function public.is_shop_member(p_shop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.shops s
    join public.business_members bm on bm.business_id = s.business_id
    where s.id = p_shop_id and bm.profile_id = auth.uid()
  );
$$;

comment on function public.current_app_role() is 'Rôle applicatif de auth.uid() — utilisé par les politiques RLS.';
comment on function public.is_admin() is 'true si auth.uid() est admin — utilisé par les politiques RLS.';
