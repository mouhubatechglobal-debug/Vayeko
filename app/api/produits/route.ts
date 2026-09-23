import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { jsonError, parseJson, readJson, serverError } from '@/lib/api';
import { productInputSchema, servicesQuerySchema, uuidSchema } from '@/lib/validations';
import { listProducts } from '@/lib/data';
import { slugify } from '@/lib/utils';

/**
 * GET    /api/produits — liste publique (q, categorie, pagination bornée).
 * GET    /api/produits?mine=1 — produits des boutiques de l'utilisateur.
 * POST   /api/produits — création (membre de la boutique, RLS renforcée).
 * PUT    /api/produits (id dans le corps) — mise à jour.
 * DELETE /api/produits?id=… — suppression douce.
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mine = url.searchParams.get('mine') === '1';

  const parsed = servicesQuerySchema.safeParse({
    q: url.searchParams.get('q') ?? '',
    ville: url.searchParams.get('ville') ?? '',
    categorie: url.searchParams.get('categorie') ?? '',
    page: url.searchParams.get('page') ?? '1',
    pageSize: url.searchParams.get('pageSize') ?? '12',
  });
  if (!parsed.success) return jsonError(400, 'Paramètres de recherche invalides.');

  if (mine) {
    if (!isSupabaseConfigured()) return jsonError(503, 'Mode démonstration : Supabase non configuré.');
    try {
      const supabase = await getServerSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return jsonError(401, 'Authentification requise.');
      const { data: memberships } = await supabase
        .from('business_members')
        .select('business_id')
        .eq('profile_id', user.id);
      const businessIds = (memberships ?? []).map((m) => m.business_id);
      if (businessIds.length === 0) return NextResponse.json({ items: [], total: 0 });
      const { data: shops } = await supabase
        .from('shops')
        .select('id, name')
        .in('business_id', businessIds);
      const shopIds = (shops ?? []).map((s) => s.id);
      if (shopIds.length === 0) return NextResponse.json({ items: [], total: 0 });
      const { data, count, error } = await supabase
        .from('products')
        .select('id, name, slug, price_cfa, available, status, shop_id, created_at', { count: 'exact' })
        .in('shop_id', shopIds)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return NextResponse.json({ items: data ?? [], total: count ?? 0, shops: shops ?? [] });
    } catch (error) {
      return serverError('produits:mine', error);
    }
  }

  const result = await listProducts(parsed.data);
  return NextResponse.json(result);
}

async function checkShopMembership(shopId: string) {
  if (!isSupabaseConfigured()) return { ok: false, status: 503, message: 'Mode démonstration : Supabase non configuré.' };
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, message: 'Authentification requise.' };
  const { data } = await supabase.rpc('is_shop_member', { p_shop_id: shopId });
  if (!data) return { ok: false, status: 403, message: 'Accès refusé pour cette boutique.' };
  return { ok: true, status: 200, message: '' };
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const parsed = parseJson(productInputSchema, body);
  if (parsed.error) return parsed.error;

  const access = await checkShopMembership(parsed.data.shop_id);
  if (!access.ok) return jsonError(access.status, access.message);

  try {
    const supabase = await getServerSupabase();
    const slug = `${slugify(parsed.data.name)}-${Math.random().toString(36).slice(2, 7)}`;
    const { data, error } = await supabase
      .from('products')
      .insert({
        shop_id: parsed.data.shop_id,
        category_id: parsed.data.category_id ?? null,
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        price_cfa: parsed.data.price_cfa,
        compare_at_price_cfa: parsed.data.compare_at_price_cfa ?? null,
        available: parsed.data.available,
        stock: parsed.data.stock ?? null,
        status: 'active',
      })
      .select('id, slug')
      .single();
    if (error) throw error;

    // Images optionnelles (max 5, déjà bornées par Zod)
    if (parsed.data.image_urls?.length) {
      const rows = parsed.data.image_urls.map((url, index) => ({
        product_id: data.id,
        url,
        position: index,
      }));
      await supabase.from('product_images').insert(rows);
    }
    return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 });
  } catch (error) {
    return serverError('produits:post', error);
  }
}

export async function PUT(request: Request) {
  const body = await readJson(request) as { id?: unknown } | null;
  const idParsed = uuidSchema.safeParse(body?.id);
  if (!idParsed.success) return jsonError(400, 'Identifiant de produit invalide.');
  const parsed = parseJson(productInputSchema.partial({ shop_id: true }), body);
  if (parsed.error) return parsed.error;

  try {
    const supabase = await getServerSupabase();
    const { data: existing } = await supabase
      .from('products')
      .select('shop_id')
      .eq('id', idParsed.data)
      .maybeSingle();
    if (!existing) return jsonError(404, 'Produit introuvable.');
    const access = await checkShopMembership(existing.shop_id);
    if (!access.ok) return jsonError(access.status, access.message);

    const { error } = await supabase
      .from('products')
      .update({
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        category_id: parsed.data.category_id ?? null,
        price_cfa: parsed.data.price_cfa,
        compare_at_price_cfa: parsed.data.compare_at_price_cfa ?? null,
        available: parsed.data.available,
        stock: parsed.data.stock ?? null,
      })
      .eq('id', idParsed.data);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError('produits:put', error);
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success) return jsonError(400, 'Identifiant de produit invalide.');

  try {
    const supabase = await getServerSupabase();
    const { data: existing } = await supabase
      .from('products')
      .select('shop_id')
      .eq('id', idParsed.data)
      .maybeSingle();
    if (!existing) return jsonError(404, 'Produit introuvable.');
    const access = await checkShopMembership(existing.shop_id);
    if (!access.ok) return jsonError(access.status, access.message);

    const { error } = await supabase
      .from('products')
      .update({ status: 'archived', deleted_at: new Date().toISOString() })
      .eq('id', idParsed.data);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError('produits:delete', error);
  }
}
