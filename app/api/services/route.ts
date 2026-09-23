import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { jsonError, parseJson, readJson, serverError } from '@/lib/api';
import { serviceInputSchema, servicesQuerySchema, uuidSchema } from '@/lib/validations';
import { listServices } from '@/lib/data';
import { slugify } from '@/lib/utils';

/**
 * GET  /api/services — liste publique (pagination bornée, filtres q/ville/categorie).
 * POST /api/services — création (authentifié + membre de l'entreprise).
 * PUT  /api/services — mise à jour (mêmes règles, id dans le corps).
 * DELETE /api/services?id=… — suppression douce par le propriétaire.
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
    // Services des entreprises dont l'utilisateur est membre
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
      const { data, count, error } = await supabase
        .from('services')
        .select('id, name, slug, price_cfa, rate_type, status, created_at', { count: 'exact' })
        .in('business_id', businessIds)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return NextResponse.json({ items: data ?? [], total: count ?? 0 });
    } catch (error) {
      return serverError('services:mine', error);
    }
  }

  const result = await listServices(parsed.data);
  return NextResponse.json(result);
}

async function checkMembership(businessId: string): Promise<{ ok: boolean; status: number; message: string }> {
  if (!isSupabaseConfigured()) return { ok: false, status: 503, message: 'Mode démonstration : Supabase non configuré.' };
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, message: 'Authentification requise.' };
  const { data } = await supabase.rpc('is_business_member', { p_business_id: businessId });
  if (!data) return { ok: false, status: 403, message: 'Accès refusé pour cette entreprise.' };
  return { ok: true, status: 200, message: '' };
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const parsed = parseJson(serviceInputSchema, body);
  if (parsed.error) return parsed.error;

  const membership = await checkMembership(parsed.data.business_id);
  if (!membership.ok) return jsonError(membership.status, membership.message);

  try {
    const supabase = await getServerSupabase();
    const slug = `${slugify(parsed.data.name)}-${Math.random().toString(36).slice(2, 7)}`;
    const { data, error } = await supabase
      .from('services')
      .insert({
        business_id: parsed.data.business_id,
        category_id: parsed.data.category_id ?? null,
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        price_cfa: parsed.data.price_cfa ?? null,
        rate_type: parsed.data.rate_type,
        phone: parsed.data.phone ?? null,
        whatsapp: parsed.data.whatsapp ?? null,
        opening_hours: parsed.data.opening_hours ?? null,
        status: 'active',
      })
      .select('id, slug')
      .single();
    if (error) throw error;
    return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 });
  } catch (error) {
    return serverError('services:post', error);
  }
}

export async function PUT(request: Request) {
  const body = await readJson(request) as { id?: unknown } | null;
  const idParsed = uuidSchema.safeParse(body?.id);
  if (!idParsed.success) return jsonError(400, 'Identifiant de service invalide.');
  const parsed = parseJson(serviceInputSchema.partial({ business_id: true }), body);
  if (parsed.error) return parsed.error;

  try {
    const supabase = await getServerSupabase();
    // Vérifie l'appartenance via la ligne cible (RLS bloque aussi l'écriture sinon).
    const { data: existing } = await supabase
      .from('services')
      .select('business_id')
      .eq('id', idParsed.data)
      .maybeSingle();
    if (!existing) return jsonError(404, 'Service introuvable.');
    const membership = await checkMembership(existing.business_id);
    if (!membership.ok) return jsonError(membership.status, membership.message);

    const { error } = await supabase
      .from('services')
      .update({
        name: parsed.data.name,
        description: parsed.data.description,
        category_id: parsed.data.category_id ?? null,
        price_cfa: parsed.data.price_cfa ?? null,
        rate_type: parsed.data.rate_type,
        phone: parsed.data.phone ?? null,
        whatsapp: parsed.data.whatsapp ?? null,
        opening_hours: parsed.data.opening_hours ?? null,
      })
      .eq('id', idParsed.data);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError('services:put', error);
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success) return jsonError(400, 'Identifiant de service invalide.');

  try {
    const supabase = await getServerSupabase();
    const { data: existing } = await supabase
      .from('services')
      .select('business_id')
      .eq('id', idParsed.data)
      .maybeSingle();
    if (!existing) return jsonError(404, 'Service introuvable.');
    const membership = await checkMembership(existing.business_id);
    if (!membership.ok) return jsonError(membership.status, membership.message);

    // Suppression douce : status archived + deleted_at (jamais de DELETE physique pour les clients).
    const { error } = await supabase
      .from('services')
      .update({ status: 'rejected', deleted_at: new Date().toISOString() })
      .eq('id', idParsed.data);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError('services:delete', error);
  }
}
