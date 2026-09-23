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
