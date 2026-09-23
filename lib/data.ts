import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import {
  DEMO_BOUTIQUES,
  DEMO_CITIES,
  DEMO_PRODUCTS,
  DEMO_PRODUCT_CATEGORIES,
  DEMO_SERVICES,
  DEMO_SERVICE_CATEGORIES,
  filterDemoBoutiques,
  filterDemoProducts,
  filterDemoServices,
} from '@/lib/demo-data';
import type { City, ProductCategory, Review, ServiceCategory } from '@/types/database';
import type { BusinessCardItem } from '@/types/business';
import type { ProductCardItem } from '@/types/product';
import type { ServiceCardItem, ServiceDetail } from '@/types/service';

/**
 * Couche d'accès aux données publiques (lecture).
 *
 * Chaque requête est bornée (pagination / limit) — jamais de SELECT * complet.
 * Quand Supabase n'est pas configuré, on bascule sur le jeu de DÉMONSTRATION
 * pour permettre la prévisualisation du design.
 */

export interface ListParams {
  q?: string;
  ville?: string;
  categorie?: string;
  page?: number;
  pageSize?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

const DEFAULT_PAGE_SIZE = 12;

function paged<T>(items: T[], params: ListParams): Paged<T> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------------------------------------------------------------------------
// Référentiels
// ---------------------------------------------------------------------------

export async function listCities(): Promise<City[]> {
  if (!isSupabaseConfigured()) return DEMO_CITIES;
  try {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase.from('cities').select('*').order('name');
    // Supabase configuré : on sert la VRAIE base, même vide — jamais de contenu fictif en prod.
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function listServiceCategories(): Promise<ServiceCategory[]> {
  if (!isSupabaseConfigured()) return DEMO_SERVICE_CATEGORIES;
  try {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase.from('service_categories').select('*').order('name');
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function listProductCategories(): Promise<ProductCategory[]> {
  if (!isSupabaseConfigured()) return DEMO_PRODUCT_CATEGORIES;
  try {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase.from('product_categories').select('*').order('name');
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cfa: number | null;
  rate_type: ServiceDetail['rate_type'];
  whatsapp: string | null;
  phone: string | null;
  opening_hours: Record<string, string> | null;
  service_categories: { name: string } | null;
  businesses: { name: string } | null;
  locations: { cities: { name: string } | null } | null;
};

async function locationIdLisForCityName(ville: string): Promise<string[] | null> {
  const supabase = await getServerSupabase();
  const { data: city } = await supabase
    .from('cities')
    .select('id')
    .ilike('name', ville)
    .maybeSingle();
  if (!city) return [];
  const { data: locs } = await supabase.from('locations').select('id').eq('city_id', city.id);
  return (locs ?? []).map((l) => l.id);
}

/** Calcule la note moyenne depuis les avis publiés. */
function averageRatings(rows: { rating: number }[]): { avg: number | null; count: number } {
  if (rows.length === 0) return { avg: null, count: 0 };
  const total = rows.reduce((acc, r) => acc + r.rating, 0);
  return { avg: Math.round((total / rows.length) * 10) / 10, count: rows.length };
}

async function ratingsFor(target: 'service' | 'product' | 'business', ids: string[], fk: 'service_id' | 'product_id' | 'business_id') {
  const result = new Map<string, { avg: number | null; count: number }>();
  if (ids.length === 0) return result;
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from('reviews')
    .select(`${fk}, rating`)
    .eq('target', target)
    .in(fk, ids)
    .eq('status', 'published');
  const grouped = new Map<string, number[]>();
  for (const row of (data ?? []) as unknown as Array<Record<string, number | string>>) {
    const id = String(row[fk]);
    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id)!.push(Number(row.rating));
  }
  for (const [id, ratings] of grouped) {
    const { avg, count } = averageRatings(ratings.map((rating) => ({ rating })));
    result.set(id, { avg, count });
  }
  return result;
}

export async function listServices(params: ListParams = {}): Promise<Paged<ServiceCardItem>> {
  if (!isSupabaseConfigured()) {
    const filtered = filterDemoServices(DEMO_SERVICES, params);
    return paged(filtered, params);
  }
  try {
    const supabase = await getServerSupabase();
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('services')
      .select(
        'id, slug, name, description, price_cfa, rate_type, whatsapp, phone, opening_hours, service_categories(name), businesses(name), locations(cities(name))',
        { count: 'exact' },
      )
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(from, to);

    const q = (params.q ?? '').trim();
    if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    if (params.categorie) {
      const { data: cat } = await supabase
        .from('service_categories')
        .select('id')
        .or(`slug.eq.${params.categorie},name.eq.${params.categorie}`)
        .maybeSingle();
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (params.ville) {
      const ids = await locationIdLisForCityName(params.ville);
      if (!ids || ids.length === 0) return { items: [], total: 0, page, pageSize };
      query = query.in('location_id', ids);
    }

    const { data, count, error } = await query.returns<ServiceRow[]>();
    if (error || !data) return { items: [], total: 0, page, pageSize };

    const ratings = await ratingsFor('service', data.map((d) => d.id), 'service_id');
    const items: ServiceCardItem[] = data.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description,
      price_cfa: s.price_cfa,
      rate_type: s.rate_type,
      category_name: s.service_categories?.name ?? null,
      city_name: s.locations?.cities?.name ?? null,
      business_name: s.businesses?.name ?? null,
      whatsapp: s.whatsapp,
      average_rating: ratings.get(s.id)?.avg ?? null,
      reviews_count: ratings.get(s.id)?.count ?? 0,
    }));
    return { items, total: count ?? items.length, page, pageSize };
  } catch {
    return { items: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE };
  }
}

export async function getService(slugOrId: string): Promise<ServiceDetail | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_SERVICES.find((s) => s.slug === slugOrId || s.id === slugOrId) ?? null;
  }
  try {
    const supabase = await getServerSupabase();
    let query = supabase
      .from('services')
      .select(
        'id, slug, name, description, price_cfa, rate_type, whatsapp, phone, opening_hours, service_categories(name), businesses(name), locations(cities(name))',
      )
      .eq('status', 'active');
    query = UUID_RE.test(slugOrId)
      ? query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      : query.eq('slug', slugOrId);

    const { data, error } = await query.returns<ServiceRow[]>();
    const s = data?.[0];
    if (error || !s) return null;
    const ratings = await ratingsFor('service', [s.id], 'service_id');
    return {
      ...s,
      category_name: s.service_categories?.name ?? null,
      city_name: s.locations?.cities?.name ?? null,
      business_name: s.businesses?.name ?? null,
      average_rating: ratings.get(s.id)?.avg ?? null,
      reviews_count: ratings.get(s.id)?.count ?? 0,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Boutiques (businesses de type shop)
// ---------------------------------------------------------------------------

type BusinessRow = {
  id: string;
  slug: string;
  name: string;
  type: 'shop' | 'service' | 'both';
  description: string | null;
  logo_url: string | null;
  whatsapp: string | null;
  locations: { cities: { name: string } | null } | null;
  shops: Array<{ id: string }> | null;
};

export async function listBoutiques(params: ListParams = {}): Promise<Paged<BusinessCardItem>> {
  if (!isSupabaseConfigured()) {
    return paged(filterDemoBoutiques(DEMO_BOUTIQUES, params.q), params);
  }
  try {
    const supabase = await getServerSupabase();
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('businesses')
      .select(
        'id, slug, name, type, description, logo_url, whatsapp, locations(cities(name)), shops(id)',
        { count: 'exact' },
      )
      .eq('status', 'active')
      .in('type', ['shop', 'both'])
      .order('created_at', { ascending: false })
      .range(from, to);

    const q = (params.q ?? '').trim();
    if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    if (params.ville) {
      const ids = await locationIdLisForCityName(params.ville);
      if (!ids || ids.length === 0) return { items: [], total: 0, page, pageSize };
      query = query.in('location_id', ids);
    }

    const { data, count, error } = await query.returns<BusinessRow[]>();
    if (error || !data) return { items: [], total: 0, page, pageSize };

    const shopIds = data.flatMap((b) => (b.shops ?? []).map((s) => s.id));
    const productsCount = new Map<string, number>();
    if (shopIds.length > 0) {
      const { data: counts } = await supabase
        .from('products')
        .select('shop_id')
        .in('shop_id', shopIds)
        .eq('status', 'active');
      for (const row of counts ?? []) {
        productsCount.set(row.shop_id, (productsCount.get(row.shop_id) ?? 0) + 1);
      }
    }
    const ratings = await ratingsFor('business', data.map((d) => d.id), 'business_id');

    const items: BusinessCardItem[] = data.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      type: b.type,
      description: b.description,
      logo_url: b.logo_url,
      city_name: b.locations?.cities?.name ?? null,
      whatsapp: b.whatsapp,
      products_count: (b.shops ?? []).reduce((acc, s) => acc + (productsCount.get(s.id) ?? 0), 0),
      average_rating: ratings.get(b.id)?.avg ?? null,
      reviews_count: ratings.get(b.id)?.count ?? 0,
    }));
    return { items, total: count ?? items.length, page, pageSize };
  } catch {
    return { items: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE };
  }
}

export async function getBoutique(slugOrId: string): Promise<BusinessCardItem | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_BOUTIQUES.find((b) => b.slug === slugOrId || b.id === slugOrId) ?? null;
  }
  try {
    const supabase = await getServerSupabase();
    let query = supabase
      .from('businesses')
      .select(
        'id, slug, name, type, description, logo_url, whatsapp, locations(cities(name)), shops(id)',
      )
      .eq('status', 'active');
    query = UUID_RE.test(slugOrId)
      ? query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      : query.eq('slug', slugOrId);
    const { data, error } = await query.returns<BusinessRow[]>();
    const b = data?.[0];
    if (error || !b) return null;
    return {
      id: b.id,
      slug: b.slug,
      name: b.name,
      type: b.type,
      description: b.description,
      logo_url: b.logo_url,
      city_name: b.locations?.cities?.name ?? null,
      whatsapp: b.whatsapp,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Produits
// ---------------------------------------------------------------------------

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cfa: number;
  available: boolean;
  product_images: Array<{ url: string; position: number }> | null;
  shops: { name: string; slug: string } | null;
  product_categories: { name: string; slug: string } | null;
};

function toProductCard(p: ProductRow, rating: { avg: number | null; count: number } | undefined): ProductCardItem {
  const images = [...(p.product_images ?? [])].sort((a, b) => a.position - b.position);
  const localFirst = images.find((i) => i.url.startsWith('/'));
  const chosen = localFirst ?? images[0];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price_cfa: p.price_cfa,
    image_url: chosen?.url ?? null,
    available: p.available,
    average_rating: rating?.avg ?? null,
    reviews_count: rating?.count ?? 0,
  };
}

export async function listProducts(params: ListParams = {}): Promise<Paged<ProductCardItem>> {
  if (!isSupabaseConfigured()) {
    return paged(filterDemoProducts(DEMO_PRODUCTS, params.q), params);
  }
  try {
    const supabase = await getServerSupabase();
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('products')
      .select(
        'id, slug, name, description, price_cfa, available, product_images(url, position), shops(name, slug), product_categories(name, slug)',
        { count: 'exact' },
      )
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(from, to);

    const q = (params.q ?? '').trim();
    if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    if (params.categorie) {
      const { data: cat } = await supabase
        .from('product_categories')
        .select('id')
        .or(`slug.eq.${params.categorie},name.eq.${params.categorie}`)
        .maybeSingle();
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (!params.categorie && q === '') {
      // Rien de spécial : on garde le tri par défaut.
    }

    const { data, count, error } = await query.returns<ProductRow[]>();
    if (error || !data) return { items: [], total: 0, page, pageSize };

    const ratings = await ratingsFor('product', data.map((d) => d.id), 'product_id');
    const items = data.map((p) => toProductCard(p, ratings.get(p.id)));
    return { items, total: count ?? items.length, page, pageSize };
  } catch {
    return { items: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE };
  }
}

export interface ProductDetail extends ProductCardItem {
  description: string | null;
  images: string[];
  shop_name: string | null;
  shop_slug: string | null;
  shop_whatsapp: string | null;
  category_name: string | null;
}

export async function getProduct(slugOrId: string): Promise<ProductDetail | null> {
  if (!isSupabaseConfigured()) {
    const found = DEMO_PRODUCTS.find((p) => p.slug === slugOrId || p.id === slugOrId);
    if (!found) return null;
    const shop = DEMO_BOUTIQUES[Math.abs(DEMO_PRODUCTS.indexOf(found)) % DEMO_BOUTIQUES.length];
    return {
      ...found,
      description:
        'Produit local proposé par une boutique partenaire Vayeko. Contactez le vendeur sur WhatsApp pour la disponibilité exacte et la remise en main propre.',
      images: found.image_url ? [found.image_url] : [],
      shop_name: shop.name,
      shop_slug: shop.slug,
      shop_whatsapp: shop.whatsapp,
      category_name: null,
    };
  }
  try {
    const supabase = await getServerSupabase();
    let query = supabase
      .from('products')
      .select(
        'id, slug, name, description, price_cfa, available, product_images(url, position), shops(name, slug, businesses(whatsapp, phone)), product_categories(name, slug)',
      )
      .eq('status', 'active');
    query = UUID_RE.test(slugOrId)
      ? query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      : query.eq('slug', slugOrId);
    const { data, error } = await query.returns<Array<ProductRow & { shops: { name: string; slug: string; businesses: { whatsapp: string | null; phone: string | null } | null } | null }>>();
    const p = data?.[0];
    if (error || !p) return null;
    const ratings = await ratingsFor('product', [p.id], 'product_id');
    const card = toProductCard(p, ratings.get(p.id));
    const images = [...(p.product_images ?? [])].sort((a, b) => a.position - b.position).map((i) => i.url);
    return {
      ...card,
      description: p.description,
      images,
      shop_name: p.shops?.name ?? null,
      shop_slug: p.shops?.slug ?? null,
      shop_whatsapp: p.shops?.businesses?.whatsapp ?? p.shops?.businesses?.phone ?? null,
      category_name: p.product_categories?.name ?? null,
    };
  } catch {
    return null;
  }
}

export async function listProductsForBoutique(businessSlug: string): Promise<ProductCardItem[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_PRODUCTS.slice(0, 4);
  }
  try {
    const supabase = await getServerSupabase();
    const { data: shop } = await supabase
      .from('shops')
      .select('id, businesses!inner(slug)')
      .eq('businesses.slug', businessSlug)
      .limit(1)
      .maybeSingle();
    if (!shop) return [];
    const { data } = await supabase
      .from('products')
      .select(
        'id, slug, name, description, price_cfa, available, product_images(url, position), shops(name, slug), product_categories(name, slug)',
      )
      .eq('shop_id', shop.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(24)
      .returns<ProductRow[]>();
    const ratings = await ratingsFor('product', (data ?? []).map((d) => d.id), 'product_id');
    return (data ?? []).map((p) => toProductCard(p, ratings.get(p.id)));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Recherche globale
// ---------------------------------------------------------------------------

export interface GlobalSearchResults {
  services: ServiceCardItem[];
  boutiques: BusinessCardItem[];
  produits: ProductCardItem[];
}

export async function searchAll(q: string, ville?: string): Promise<GlobalSearchResults> {
  const trimmed = q.trim().slice(0, 80);
  const [services, boutiques, produits] = await Promise.all([
    listServices({ q: trimmed, ville, pageSize: 6 }),
    listBoutiques({ q: trimmed, ville, pageSize: 6 }),
    listProducts({ q: trimmed, ville, pageSize: 6 }),
  ]);
  return { services: services.items, boutiques: boutiques.items, produits: produits.items };
}

// ---------------------------------------------------------------------------
// Avis publics
// ---------------------------------------------------------------------------

export interface PublicReview {
  id: string;
  author: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export async function listReviews(
  target: 'service' | 'product' | 'business',
  id: string,
): Promise<PublicReview[]> {
  const fk = `${target}_id` as 'service_id' | 'product_id' | 'business_id';
  if (!isSupabaseConfigured() || !UUID_RE.test(id)) {
    // Démo : deux avis fictifs génériques
    return [
      {
        id: 'rv-demo-1',
        author: 'Afi D.',
        rating: 5,
        comment: 'Très bonne expérience, je recommande vivement !',
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'rv-demo-2',
        author: 'Kossi M.',
        rating: 4,
        comment: 'Professionnel et disponible. Petit délai de réponse le week-end.',
        created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
    ];
  }
  try {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, profiles:author_id(full_name)')
      .eq('target', target)
      .eq(fk, id)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(20)
      .returns<Array<Pick<Review, 'id' | 'rating' | 'comment' | 'created_at'> & { profiles: { full_name: string | null } | null }>>();
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      author: r.profiles?.full_name ?? 'Utilisateur Vayeko',
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
    }));
  } catch {
    return [];
  }
}

export { slugify };
