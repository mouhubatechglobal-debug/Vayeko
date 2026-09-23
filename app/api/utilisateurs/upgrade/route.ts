import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { jsonError, readJson, serverError } from '@/lib/api';
import { z } from 'zod';

const upgradeSchema = z.object({
  role: z.enum(['merchant', 'provider']),
});

/**
 * POST /api/utilisateurs/upgrade
 * Permet à un utilisateur avec rôle 'user' de passer en compte professionnel ('merchant' ou 'provider').
 * La sécurité de la base de données (prevent_role_escalation) garantit qu'il est impossible de devenir 'admin'.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return jsonError(503, 'Mode démonstration : Supabase non configuré.');

  const body = await readJson(request);
  const parsed = upgradeSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, 'Rôle cible invalide. Choisissez commerçant ou prestataire.');
  }

  try {
    const supabase = await getServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return jsonError(401, 'Authentification requise.');

    // Vérifier l'ancien rôle
    const { data: profile, error: fetchErr } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (fetchErr || !profile) return jsonError(404, 'Profil introuvable.');

    if (profile.role === 'admin') {
      return NextResponse.json({ message: 'Vous êtes déjà administrateur.', role: profile.role });
    }

    if (profile.role === parsed.data.role) {
      return NextResponse.json({ message: 'Compte déjà configuré avec ce rôle.', role: profile.role });
    }

    // Mise à jour du rôle
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: parsed.data.role })
      .eq('id', user.id)
      .select('id, username, full_name, role')
      .single();

    if (error) {
      return jsonError(403, error.message || 'Impossible de mettre à niveau le compte.');
    }

    return NextResponse.json({
      success: true,
      role: data.role,
      message: `Votre compte est maintenant configuré en tant que ${data.role === 'merchant' ? 'Commerçant' : 'Prestataire'} !`,
    });
  } catch (error) {
    return serverError('utilisateurs:upgrade', error);
  }
}
