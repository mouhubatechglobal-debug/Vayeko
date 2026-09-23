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

drop trigger if exists locations_sync_geo on public.locations;
create trigger locations_sync_geo
  before insert or update on public.locations
  for each row execute function public.sync_location_geo();

drop trigger if exists locations_set_updated_at on public.locations;
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

drop trigger if exists businesses_set_updated_at on public.businesses;
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
-- Fonctions RLS utilitaires (déplacées ici car elles lisent cette table)
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

drop trigger if exists businesses_add_owner_member on public.businesses;
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
drop policy if exists cities_select_all on public.cities;
create policy cities_select_all on public.cities for select using (true);
drop policy if exists neighborhoods_select_all on public.neighborhoods;
create policy neighborhoods_select_all on public.neighborhoods for select using (true);

-- Locations : lecture publique (adresses des fiches), écriture par utilisateur connecté
drop policy if exists locations_select_all on public.locations;
create policy locations_select_all on public.locations for select using (true);
drop policy if exists locations_insert_auth on public.locations;
create policy locations_insert_auth on public.locations for insert with check (auth.uid() is not null);
drop policy if exists locations_update_auth on public.locations;
create policy locations_update_auth on public.locations for update using (auth.uid() is not null);

-- Commerces visibles : actifs pour tous, tout statut pour les membres/admins
drop policy if exists businesses_select_public on public.businesses;
create policy businesses_select_public on public.businesses
  for select
  using (
    (status = 'active' and deleted_at is null)
    or public.is_business_member(id)
    or public.is_admin()
  );

-- Création : utilisateur connecté (owner = soi-même obligatoire)
drop policy if exists businesses_insert_auth on public.businesses;
create policy businesses_insert_auth on public.businesses
  for insert
  with check (auth.uid() is not null and owner_id = auth.uid());

-- Modification : membres ou admin ; le statut reste réservé à l'admin
drop policy if exists businesses_update_members on public.businesses;
create policy businesses_update_members on public.businesses
  for update
  using (public.is_business_member(id) or public.is_admin());

-- Seuls les admins suppriment (suppression douce via deleted_at)
drop policy if exists businesses_delete_admin on public.businesses;
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

drop trigger if exists businesses_guard_status on public.businesses;
create trigger businesses_guard_status
  before update of status on public.businesses
  for each row execute function public.guard_business_status();

-- Membres : visibles par membres/admin ; gestion par owner/admin
drop policy if exists business_members_select on public.business_members;
create policy business_members_select on public.business_members
  for select
  using (profile_id = auth.uid() or public.is_business_member(business_id) or public.is_admin());

drop policy if exists business_members_insert_owner on public.business_members;
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

drop policy if exists business_members_delete_owner on public.business_members;
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
