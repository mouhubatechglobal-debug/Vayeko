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
