import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getServerSupabase } from '@/lib/database';
import { isProfileRole } from '@/lib/permissions';
import type { Profile, ProfileRole } from '@/types/database';

/**
 * Helpers d'authentification côté serveur.
 * `getCurrentProfile` est mis en cache par requête (`React.cache`) pour éviter
 * les appels Supabase en double dans un même rendu.
 */

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  try {
    const supabase = await getServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .is('deleted_at', null)
      .maybeSingle();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
});

export async function getCurrentUser() {
  const profile = await getCurrentProfile();
  if (!profile) return null;
  return { id: profile.id, role: profile.role as ProfileRole, profile };
}

/** Redirige vers /connexion si non authentifié (pages/layouts protégés). */
export async function requireUser(redirectedFrom: string) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(`/connexion?redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
  }
  return profile;
}

/** Redirige si le rôle exigé est absent — l'URL seule ne donne JAMAIS l'accès. */
export async function requireRole(role: ProfileRole, redirectedFrom: string) {
  const profile = await requireUser(redirectedFrom);
  if (!isProfileRole(profile.role) || profile.role !== role) {
    redirect('/');
  }
  return profile;
}
