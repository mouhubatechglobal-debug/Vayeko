import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { jsonError, parseJson, readJson, serverError } from '@/lib/api';
import { updateProfileSchema } from '@/lib/validations';

/**
 * GET   /api/utilisateurs — profil de l'utilisateur courant (auth requise).
 * PATCH /api/utilisateurs — mise à jour de son propre profil (Zod + RLS).
 */

export async function GET() {
  if (!isSupabaseConfigured()) return jsonError(503, 'Mode démonstration : Supabase non configuré.');
  try {
    const supabase = await getServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return jsonError(401, 'Authentification requise.');
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, phone, whatsapp, role, created_at')
      .eq('id', user.id)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw error;
    if (!data) return jsonError(404, 'Profil introuvable.');
    return NextResponse.json({ profile: data });
  } catch (error) {
    return serverError('utilisateurs:get', error);
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) return jsonError(503, 'Mode démonstration : Supabase non configuré.');
  const body = await readJson(request);
  const parsed = parseJson(updateProfileSchema, body);
  if (parsed.error) return parsed.error;

  try {
    const supabase = await getServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return jsonError(401, 'Authentification requise.');

    const updates: Partial<import('@/types/database').Profile> = {};
    if (parsed.data.fullName !== undefined) updates.full_name = parsed.data.fullName;
    if (parsed.data.username !== undefined) updates.username = parsed.data.username;
    if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
    if (parsed.data.whatsapp !== undefined) updates.whatsapp = parsed.data.whatsapp;
    if (parsed.data.avatarUrl !== undefined) updates.avatar_url = parsed.data.avatarUrl;

    if (Object.keys(updates).length === 0) return jsonError(400, 'Aucun champ à mettre à jour.');

    // La RLS + le trigger `prevent_role_escalation` empêchent toute élévation de privilèges :
    // le champ `role` est délibérément absent du schéma.
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id, username, full_name, avatar_url, phone, whatsapp, role')
      .single();
    if (error) {
      if (error.code === '23505') return jsonError(409, "Ce nom d'utilisateur est déjà pris.");
      throw error;
    }
    return NextResponse.json({ profile: data });
  } catch (error) {
    return serverError('utilisateurs:patch', error);
  }
}
