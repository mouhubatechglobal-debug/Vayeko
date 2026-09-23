-- ============================================================================
-- VAYEKO V1 — INSTALLATION COMPLÈTE EN UNE SEULE PASTE (migrations 001 à 006)
-- Instructions : tout copier → SQL Editor → New query → coller → Run
-- Sécurité : ce fichier crée la structure VIDE + les tables ; zéro fausse donnée.
-- (Ne JAMAIS exécuter seed.sql en production.)
-- ============================================================================


-- #############################################################################
-- ==> EXÉCUTION DE migrations/001_initial.sql
-- #############################################################################

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


-- #############################################################################
-- ==> EXÉCUTION DE migrations/002_users.sql
-- #############################################################################

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

create unique index if not exists profiles_username_lower_uidx
  on public.profiles (lower(username)) where username is not null;

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

create trigger profiles_prevent_role_escalation
  before update of role on public.profiles
  for each row execute function public.prevent_role_escalation();

-- -----------------------------------------------------------------------------
-- Row Level Security — profiles
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Lecture publique limitée (fiches prestataires/vendeurs, auteurs d'avis)
create policy profiles_select_public on public.profiles
  for select
  using (deleted_at is null);

-- Modification : uniquement son propre profil (role protégé par trigger)
create policy profiles_update_own on public.profiles
  for update
  using (auth.uid() = id);

-- Insertion réservée au trigger (security definer) — aucune insertion API directe
create policy profiles_insert_none on public.profiles
  for insert
  with check (false);

-- Les suppressions sont gérées par un administrateur (suppression douce)
create policy profiles_delete_admin on public.profiles
  for delete
  using (public.is_admin());


-- #############################################################################
-- ==> EXÉCUTION DE migrations/003_businesses.sql
-- #############################################################################

-- =============================================================================
-- Vayeko V1 — Migration 003 : géolocalisation & commerces
-- =============================================================================

-- Villages / villes du Togo
create table if not exists public.cities (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  region     text,
  latitude   double precision,
  longitude  double precision,
  created_at timestamptz not null default now()
);

create table if not exists public.neighborhoods (
  id         uuid primary key default gen_random_uuid(),
  city_id    uuid not null references public.cities(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now(),
  unique (city_id, name)
);

-- Point d'intérêt géolocalisé (PostGIS)
create table if not exists public.locations (
  id              uuid primary key default gen_random_uuid(),
  address_line    text check (address_line is null or char_length(address_line) <= 200),
  city_id         uuid not null references public.cities(id) on delete restrict,
  neighborhood_id uuid references public.neighborhoods(id) on delete set null,
  latitude        double precision,
  longitude       double precision,
  -- PostGIS : point déduit automatiquement si lat/lng fournis
  geo             geography(Point, 4326),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (
    (latitude is null and longitude is null)
    or (latitude between -90 and 90 and longitude between -180 and 180)
  )
);

create index if not exists locations_city_idx on public.locations (city_id);
create index if not exists locations_geo_gix on public.locations using gist (geo);

create or replace function public.sync_location_geo()
returns trigger
language plpgsql
as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.geo := st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  end if;
  return new;
end;
$$;

create trigger locations_sync_geo
  before insert or update on public.locations
  for each row execute function public.sync_location_geo();

create trigger locations_set_updated_at
  before update on public.locations
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Commerces (boutiques et prestataires sont des "entreprises")
-- -----------------------------------------------------------------------------
create table if not exists public.businesses (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete restrict,
  name        text not null check (char_length(name) between 3 and 100),
  slug        text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,80}$'),
  type        text not null default 'shop' check (type in ('shop', 'service', 'both')),
  description text check (description is null or char_length(description) <= 2000),
  phone       text check (phone is null or char_length(phone) <= 20),
  whatsapp    text check (whatsapp is null or char_length(whatsapp) <= 20),
  logo_url    text check (logo_url is null or char_length(logo_url) <= 500),
  cover_url   text check (cover_url is null or char_length(cover_url) <= 500),
  location_id uuid references public.locations(id) on delete set null,
  status      text not null default 'pending' check (status in ('pending', 'active', 'suspended', 'rejected')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists businesses_owner_idx on public.businesses (owner_id);
create index if not exists businesses_status_idx on public.businesses (status) where deleted_at is null;
create index if not exists businesses_name_trgm_idx on public.businesses using gin (name gin_trgm_ops);

create trigger businesses_set_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

-- Membres d'une entreprise (qui peut la gérer)
create table if not exists public.business_members (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  member_role text not null default 'owner' check (member_role in ('owner', 'manager', 'editor')),
  created_at  timestamptz not null default now(),
  unique (business_id, profile_id)
);

create index if not exists business_members_profile_idx on public.business_members (profile_id);

-- À la création d'une entreprise, le propriétaire devient automatiquement membre.
create or replace function public.add_owner_as_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.business_members (business_id, profile_id, member_role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

create trigger businesses_add_owner_member
  after insert on public.businesses
  for each row execute function public.add_owner_as_member();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.cities enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.locations enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;

-- Référentiels géographiques : lecture publique
create policy cities_select_all on public.cities for select using (true);
create policy neighborhoods_select_all on public.neighborhoods for select using (true);

-- Locations : lecture publique (adresses des fiches), écriture par utilisateur connecté
create policy locations_select_all on public.locations for select using (true);
create policy locations_insert_auth on public.locations for insert with check (auth.uid() is not null);
create policy locations_update_auth on public.locations for update using (auth.uid() is not null);

-- Commerces visibles : actifs pour tous, tout statut pour les membres/admins
create policy businesses_select_public on public.businesses
  for select
  using (
    (status = 'active' and deleted_at is null)
    or public.is_business_member(id)
    or public.is_admin()
  );

-- Création : utilisateur connecté (owner = soi-même obligatoire)
create policy businesses_insert_auth on public.businesses
  for insert
  with check (auth.uid() is not null and owner_id = auth.uid());

-- Modification : membres ou admin ; le statut reste réservé à l'admin
create policy businesses_update_members on public.businesses
  for update
  using (public.is_business_member(id) or public.is_admin());

-- Seuls les admins suppriment (suppression douce via deleted_at)
create policy businesses_delete_admin on public.businesses
  for delete
  using (public.is_admin());

-- Garde-fou statut : un membre ne peut pas s'auto-valider
create or replace function public.guard_business_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status and not public.is_admin() then
    raise exception 'Seul un administrateur peut changer le statut d''un commerce.';
  end if;
  return new;
end;
$$;

create trigger businesses_guard_status
  before update of status on public.businesses
  for each row execute function public.guard_business_status();

-- Membres : visibles par membres/admin ; gestion par owner/admin
create policy business_members_select on public.business_members
  for select
  using (profile_id = auth.uid() or public.is_business_member(business_id) or public.is_admin());

create policy business_members_insert_owner on public.business_members
  for insert
  with check (
    auth.uid() is not null
    and (
      profile_id = auth.uid()
      or exists (
        select 1 from public.business_members bm
        where bm.business_id = business_members.business_id
          and bm.profile_id = auth.uid()
          and bm.member_role in ('owner', 'manager')
      )
      or public.is_admin()
    )
  );

create policy business_members_delete_owner on public.business_members
  for delete
  using (
    profile_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.business_members bm
      where bm.business_id = business_members.business_id
        and bm.profile_id = auth.uid()
        and bm.member_role = 'owner'
    )
  );


-- #############################################################################
-- ==> EXÉCUTION DE migrations/004_products.sql
-- #############################################################################

-- =============================================================================
-- Vayeko V1 — Migration 004 : boutiques, catégories et produits
-- =============================================================================

create table if not exists public.product_categories (
  id         uuid primary key default gen_random_uuid(),
  parent_id  uuid references public.product_categories(id) on delete set null,
  name       text not null unique,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

-- Boutique vitrine rattachée à une entreprise de type shop/both
create table if not exists public.shops (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name        text not null check (char_length(name) between 3 and 100),
  slug        text not null unique,
  description text,
  location_id uuid references public.locations(id) on delete set null,
  status      text not null default 'active' check (status in ('active', 'archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists shops_business_idx on public.shops (business_id);

create trigger shops_set_updated_at
  before update on public.shops
  for each row execute function public.set_updated_at();

create table if not exists public.products (
  id                   uuid primary key default gen_random_uuid(),
  shop_id              uuid not null references public.shops(id) on delete cascade,
  category_id          uuid references public.product_categories(id) on delete set null,
  name                 text not null check (char_length(name) between 3 and 100),
  slug                 text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,80}$'),
  description          text check (description is null or char_length(description) <= 2000),
  price_cfa            integer not null check (price_cfa >= 0 and price_cfa <= 100000000),
  compare_at_price_cfa integer check (compare_at_price_cfa is null or compare_at_price_cfa >= 0),
  available            boolean not null default true,
  stock                integer check (stock is null or stock >= 0),
  status               text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  deleted_at           timestamptz
);

create index if not exists products_shop_idx on public.products (shop_id);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_status_idx on public.products (status) where deleted_at is null;
create index if not exists products_price_idx on public.products (price_cfa) where status = 'active';
create index if not exists products_name_trgm_idx on public.products using gin (name gin_trgm_ops);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url        text not null check (char_length(url) <= 500),
  position   smallint not null default 0 check (position between 0 and 4),
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id);

-- 5 images maximum par produit
create or replace function public.limit_product_images()
returns trigger
language plpgsql
as $$
declare
  current_count integer;
begin
  select count(*) into current_count from public.product_images where product_id = new.product_id;
  if current_count >= 5 then
    raise exception 'Un produit ne peut pas avoir plus de 5 images.';
  end if;
  return new;
end;
$$;

create trigger product_images_limit
  before insert on public.product_images
  for each row execute function public.limit_product_images();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.product_categories enable row level security;
alter table public.shops enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy product_categories_select_all on public.product_categories for select using (true);

-- Boutiques visibles si l'entreprise parente est active
create policy shops_select_public on public.shops
  for select
  using (
    status = 'active'
    and exists (
      select 1 from public.businesses b
      where b.id = shops.business_id
        and b.status = 'active'
        and b.deleted_at is null
    )
  ) or public.is_shop_member(id) or public.is_admin();

create policy shops_insert_member on public.shops
  for insert
  with check (
    exists (
      select 1 from public.business_members bm
      where bm.business_id = shops.business_id and bm.profile_id = auth.uid()
    )
  );

create policy shops_update_member on public.shops
  for update
  using (public.is_shop_member(id) or public.is_admin());

-- Produits publics : actifs uniquement
create policy products_select_public on public.products
  for select
  using (
    (status = 'active' and deleted_at is null)
    or public.is_shop_member(shop_id)
    or public.is_admin()
  );

create policy products_insert_member on public.products
  for insert
  with check (public.is_shop_member(shop_id));

create policy products_update_member on public.products
  for update
  using (public.is_shop_member(shop_id) or public.is_admin());

create policy products_delete_member on public.products
  for delete
  using (public.is_shop_member(shop_id) or public.is_admin());

-- Images : lecture publique, gestion par le membre de la boutique
create policy product_images_select_all on public.product_images for select using (true);

create policy product_images_insert_member on public.product_images
  for insert
  with check (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and public.is_shop_member(p.shop_id)
    )
  );

create policy product_images_delete_member on public.product_images
  for delete
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id
        and (public.is_shop_member(p.shop_id) or public.is_admin())
    )
  );


-- #############################################################################
-- ==> EXÉCUTION DE migrations/005_services.sql
-- #############################################################################

-- =============================================================================
-- Vayeko V1 — Migration 005 : services, avis, favoris, signalements,
-- commandes WhatsApp (préparation V2), actions admin & audit
-- =============================================================================

create table if not exists public.service_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  icon       text,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references public.businesses(id) on delete cascade,
  category_id   uuid references public.service_categories(id) on delete set null,
  name          text not null check (char_length(name) between 3 and 120),
  slug          text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,80}$'),
  description   text not null check (char_length(description) between 10 and 3000),
  price_cfa     integer check (price_cfa is null or (price_cfa >= 0 and price_cfa <= 100000000)),
  rate_type     text not null default 'quote' check (rate_type in ('fixed', 'from', 'quote', 'hourly')),
  phone         text check (phone is null or char_length(phone) <= 20),
  whatsapp      text check (whatsapp is null or char_length(whatsapp) <= 20),
  opening_hours jsonb check (opening_hours is null or jsonb_typeof(opening_hours) = 'object'),
  location_id   uuid references public.locations(id) on delete set null,
  status        text not null default 'active' check (status in ('pending', 'active', 'suspended', 'rejected')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists services_business_idx on public.services (business_id);
create index if not exists services_category_idx on public.services (category_id);
create index if not exists services_status_idx on public.services (status) where deleted_at is null;
create index if not exists services_name_trgm_idx on public.services using gin (name gin_trgm_ops);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- Qualifications d'un prestataire par catégorie (expérience/certification)
create table if not exists public.service_providers (
  id                 uuid primary key default gen_random_uuid(),
  business_id        uuid not null references public.businesses(id) on delete cascade,
  service_category_id uuid not null references public.service_categories(id) on delete cascade,
  experience_years   integer check (experience_years is null or experience_years between 0 and 70),
  certified          boolean not null default false,
  created_at         timestamptz not null default now(),
  unique (business_id, service_category_id)
);

-- -----------------------------------------------------------------------------
-- Avis (1 seule cible par avis : commerce OU produit OU service)
-- -----------------------------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  target      text not null check (target in ('business', 'product', 'service')),
  business_id uuid references public.businesses(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  service_id  uuid references public.services(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  comment     text check (comment is null or char_length(comment) <= 1000),
  status      text not null default 'published' check (status in ('published', 'rejected')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint reviews_one_target check (
    (business_id is not null)::int + (product_id is not null)::int + (service_id is not null)::int = 1
  )
);

create index if not exists reviews_author_idx on public.reviews (author_id);
create index if not exists reviews_business_idx on public.reviews (business_id) where business_id is not null;
create index if not exists reviews_product_idx on public.reviews (product_id) where product_id is not null;
create index if not exists reviews_service_idx on public.reviews (service_id) where service_id is not null;

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Favoris
-- -----------------------------------------------------------------------------
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  target      text not null check (target in ('business', 'product', 'service')),
  business_id uuid references public.businesses(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  service_id  uuid references public.services(id) on delete cascade,
  created_at  timestamptz not null default now(),
  constraint favorites_one_target check (
    (business_id is not null)::int + (product_id is not null)::int + (service_id is not null)::int = 1
  )
);

create unique index if not exists favorites_unique_business
  on public.favorites (profile_id, business_id) where business_id is not null;
create unique index if not exists favorites_unique_product
  on public.favorites (profile_id, product_id) where product_id is not null;
create unique index if not exists favorites_unique_service
  on public.favorites (profile_id, service_id) where service_id is not null;

-- -----------------------------------------------------------------------------
-- Signalements
-- -----------------------------------------------------------------------------
create table if not exists public.reports (
  id                  uuid primary key default gen_random_uuid(),
  reporter_id         uuid not null references public.profiles(id) on delete cascade,
  target              text not null check (target in ('user', 'business', 'product', 'service', 'review')),
  business_id         uuid references public.businesses(id) on delete set null,
  product_id          uuid references public.products(id) on delete set null,
  service_id          uuid references public.services(id) on delete set null,
  review_id           uuid references public.reviews(id) on delete set null,
  reported_profile_id uuid references public.profiles(id) on delete set null,
  reason              text not null check (char_length(reason) between 4 and 80),
  details             text check (details is null or char_length(details) <= 1000),
  status              text not null default 'open' check (status in ('open', 'in_review', 'resolved', 'rejected')),
  resolved_by         uuid references public.profiles(id) on delete set null,
  resolved_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists reports_status_idx on public.reports (status);
create index if not exists reports_reporter_idx on public.reports (reporter_id);

create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Commandes (préparation : V1 = contact WhatsApp, sans paiement en ligne)
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid references public.profiles(id) on delete set null,
  customer_name  text not null check (char_length(customer_name) between 2 and 100),
  customer_phone text not null check (char_length(customer_phone) <= 20),
  shop_id        uuid not null references public.shops(id) on delete restrict,
  note           text check (note is null or char_length(note) <= 500),
  status         text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  total_cfa      integer not null default 0 check (total_cfa >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists orders_shop_idx on public.orders (shop_id);
create index if not exists orders_customer_idx on public.orders (customer_id) where customer_id is not null;

create table if not exists public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  product_id      uuid references public.products(id) on delete set null,
  -- Instantanés au moment de la commande (le produit peut évoluer ensuite)
  name_snapshot   text not null,
  unit_price_cfa  integer not null check (unit_price_cfa >= 0),
  quantity        integer not null check (quantity > 0 and quantity <= 10000),
  created_at      timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Journalisation (actions admin + audit générique)
-- -----------------------------------------------------------------------------
create table if not exists public.admin_actions (
  id         uuid primary key default gen_random_uuid(),
  admin_id   uuid not null references public.profiles(id) on delete restrict,
  action     text not null,
  entity     text not null,
  entity_id  uuid not null,
  details    jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_actions_admin_idx on public.admin_actions (admin_id);

create table if not exists public.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on public.audit_logs (entity, entity_id);
create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);

-- Trigger générique d'audit des changements de statut sensibles
create or replace function public.audit_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.audit_logs (profile_id, action, entity, entity_id, metadata)
    values (
      auth.uid(),
      tg_table_name || '.status_change',
      tg_table_name,
      new.id,
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;
  return new;
end;
$$;

create trigger businesses_audit_status
  after update of status on public.businesses
  for each row execute function public.audit_status_change();

create trigger reports_audit_status
  after update of status on public.reports
  for each row execute function public.audit_status_change();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.service_providers enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_actions enable row level security;
alter table public.audit_logs enable row level security;

create policy service_categories_select_all on public.service_categories for select using (true);

-- Services publics : actifs uniquement
create policy services_select_public on public.services
  for select
  using (
    (status = 'active' and deleted_at is null)
    or public.is_business_member(business_id)
    or public.is_admin()
  );

create policy services_insert_member on public.services
  for insert
  with check (public.is_business_member(business_id));

create policy services_update_member on public.services
  for update
  using (public.is_business_member(business_id) or public.is_admin());

create policy services_delete_member on public.services
  for delete
  using (public.is_business_member(business_id) or public.is_admin());

create policy service_providers_select_all on public.service_providers for select using (true);
create policy service_providers_manage on public.service_providers
  for all
  using (public.is_business_member(business_id) or public.is_admin());

-- Avis : lecture des avis publiés pour tous ; création par utilisateur connecté
create policy reviews_select_public on public.reviews
  for select
  using (status = 'published' or author_id = auth.uid() or public.is_admin());

create policy reviews_insert_auth on public.reviews
  for insert
  with check (auth.uid() is not null and author_id = auth.uid());

create policy reviews_update_own on public.reviews
  for update
  using (author_id = auth.uid() or public.is_admin());

create policy reviews_delete_own_admin on public.reviews
  for delete
  using (author_id = auth.uid() or public.is_admin());

-- Favoris : privés à l'utilisateur
create policy favorites_own on public.favorites
  for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Signalements : l'auteur voit les siens, l'admin tout, création par authentifié
create policy reports_select_own_admin on public.reports
  for select
  using (reporter_id = auth.uid() or public.is_admin());

create policy reports_insert_auth on public.reports
  for insert
  with check (auth.uid() is not null and reporter_id = auth.uid());

create policy reports_update_admin on public.reports
  for update
  using (public.is_admin());

-- Commandes : le client voit les siennes, la boutique voit ses ventes
create policy orders_select_own on public.orders
  for select
  using (
    customer_id = auth.uid()
    or public.is_shop_member(shop_id)
    or public.is_admin()
  );

create policy orders_insert_any on public.orders
  for insert
  with check (
    (customer_id is null or customer_id = auth.uid())
    and status = 'pending'
  );

create policy orders_update_shop on public.orders
  for update
  using (public.is_shop_member(shop_id) or public.is_admin());

create policy order_items_select on public.order_items
  for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.customer_id = auth.uid() or public.is_shop_member(o.shop_id) or public.is_admin())
    )
  );

create policy order_items_insert on public.order_items
  for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.customer_id = auth.uid() or o.customer_id is null)
        and o.status = 'pending'
    )
  );

-- Journaux : lecture réservée aux admins ; insertion via fonctions security definer
create policy admin_actions_select_admin on public.admin_actions for select using (public.is_admin());
create policy audit_logs_select_admin on public.audit_logs for select using (public.is_admin());


-- #############################################################################
-- ==> EXÉCUTION DE migrations/006_storage.sql
-- #############################################################################

-- =============================================================================
-- Vayeko V1 — Migration 006 : Supabase Storage (buckets + règles d'accès)
-- =============================================================================
-- Buckets attendus : avatars | business-assets | product-images
-- Règles : lecture publique ; écriture uniquement dans SON propre dossier
-- (chemin = "<uid>/fichier"), limité aux images ≤ 5 Mo.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('business-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique des trois buckets.
drop policy if exists vayeko_public_read on storage.objects;
create policy vayeko_public_read on storage.objects
  for select
  using (bucket_id in ('avatars', 'business-assets', 'product-images'));

-- Écriture : uniquement dans son dossier <uid>/..., fichiers images.
drop policy if exists vayeko_write_own_folder on storage.objects;
create policy vayeko_write_own_folder on storage.objects
  for insert
  with check (
    bucket_id in ('avatars', 'business-assets', 'product-images')
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
    and lower(name) ~ '\.(jpe?g|png|webp|avif)$'
  );

-- Mise à jour / suppression : uniquement ses propres fichiers.
drop policy if exists vayeko_update_own_folder on storage.objects;
create policy vayeko_update_own_folder on storage.objects
  for update
  using (
    bucket_id in ('avatars', 'business-assets', 'product-images')
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists vayeko_delete_own_folder on storage.objects;
create policy vayeko_delete_own_folder on storage.objects
  for delete
  using (
    bucket_id in ('avatars', 'business-assets', 'product-images')
    and auth.role() = 'authenticated'
    and auth.uid() = owner
  );

-- ======================================================================
-- FIN — Toutes les tables Vayeko sont créées. 🎉
