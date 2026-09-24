import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { jsonError, parseJson, readJson, serverError } from '@/lib/api';
import { boutiqueInputSchema, servicesQuerySchema, uuidSchema } from '@/lib/validations';
import { listBoutiques } from '@/lib/data';
import { slugify } from '@/lib/utils';

/**
 * GET   /api/boutiques — liste publique des boutiques (q/ville/pagination).
 * GET   /api/boutiques?mine=1 — entreprises dont l'utilisateur est membre.
 * POST  /api/boutiques — création boutique (auth) : business + emplacement + boutique.
 * PATCH /api/boutiques — mise à jour d'une de ses entreprises (id dans le corps).
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mine = url.searchParams.get('mine') === '1';

  if (mine) {
    if (!isSupabaseConfigured()) return jsonError(503, 'Mode démonstration : Supabase non configuré.');
    try {
      const supabase = await getServerSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return jsonError(401, 'Authentification requise.');
      const { data, error } = await supabase
        .from('business_members')
        .select('member_role, businesses(id, name, slug, type, status, description, phone, whatsapp, is_verified, created_at)')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const items = (data ?? [])
        .map((row) => {
          const biz = Array.isArray(row.businesses) ? row.businesses[0] : row.businesses;
          return biz ? { ...biz, member_role: row.member_role } : null;
        })
        .filter(Boolean);
      return NextResponse.json({ items });
    } catch (error) {
      return serverError('boutiques:mine', error);
    }
  }

  const parsed = servicesQuerySchema.safeParse({
    q: url.searchParams.get('q') ?? '',
    ville: url.searchParams.get('ville') ?? '',
    page: url.searchParams.get('page') ?? '1',
    pageSize: url.searchParams.get('pageSize') ?? '12',
  });
  if (!parsed.success) return jsonError(400, 'Paramètres de recherche invalides.');
  const result = await listBoutiques(parsed.data);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return jsonError(503, 'Mode démonstration : Supabase non configuré.');
  const body = await readJson(request);
  const parsed = parseJson(boutiqueInputSchema, body);
  if (parsed.error) return parsed.error;

  try {
    const supabase = await getServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return jsonError(401, 'Authentification requise.');

    // 1. Localisation
    const { data: location, error: locError } = await supabase
      .from('locations')
      .insert({
        city_id: parsed.data.city_id,
        address_line: parsed.data.address_line ?? null,
      })
      .select('id')
      .single();
    if (locError) throw locError;

    // 2. Entreprise (le trigger `on_business_created` ajoute le membre "owner")
    const slug = `${slugify(parsed.data.name)}-${Math.random().toString(36).slice(2, 7)}`;
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .insert({
        owner_id: user.id,
        name: parsed.data.name,
        slug,
        type: parsed.data.type,
        description: parsed.data.description ?? null,
        phone: parsed.data.phone ?? null,
        whatsapp: parsed.data.whatsapp ?? null,
        location_id: location.id,
        status: 'pending',
      })
      .select('id, slug')
      .single();
    if (bizError) throw bizError;

    // 3. Boutique vitrine (si type shop/both)
    if (parsed.data.type !== 'service') {
      const { error: shopError } = await supabase.from('shops').insert({
        business_id: business.id,
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        location_id: location.id,
        status: 'active',
      });
      if (shopError) {
        console.error('[vayeko][boutiques:post:shop]', shopError.code);
      }
    }

    return NextResponse.json(
      { id: business.id, slug: business.slug, status: 'pending' },
      { status: 201 },
    );
  } catch (error) {
    return serverError('boutiques:post', error);
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) return jsonError(503, 'Mode démonstration : Supabase non configuré.');
  const body = await readJson(request) as { id?: unknown } | null;
  const idParsed = uuidSchema.safeParse(body?.id);
  if (!idParsed.success) return jsonError(400, 'Identifiant invalide.');
  const partial = boutiqueInputSchema.partial();
  const parsed = parseJson(partial, body);
  if (parsed.error) return parsed.error;

  try {
    const supabase = await getServerSupabase();
    const { data: isMember } = await supabase.rpc('is_business_member', {
      p_business_id: idParsed.data,
    });
    if (!isMember) return jsonError(403, 'Accès refusé pour cette entreprise.');

    const updates: Partial<Pick<import('@/types/database').Business, 'name' | 'description' | 'phone' | 'whatsapp'>> = {};
    if (parsed.data.name) updates.name = parsed.data.name;
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;
    if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
    if (parsed.data.whatsapp !== undefined) updates.whatsapp = parsed.data.whatsapp;

    const { error } = await supabase.from('businesses').update(updates).eq('id', idParsed.data);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError('boutiques:patch', error);
  }
}
