'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSupabase, getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { canAccessAdmin } from '@/lib/permissions';
import type { Json } from '@/types/database';
import {
  adminBusinessStatusSchema,
  adminUserRoleSchema,
  moderateReviewSchema,
  reportResolutionSchema,
} from '@/lib/validations';

/**
 * Server Actions d'administration.
 *
 * Sécurité : chaque action vérifie le rôle `admin` via le profil de
 * l'utilisateur authentifié, utilise ensuite le client service_role
 * (RLS bypass) pour l'opération, puis journalise dans `admin_actions`
 * et `audit_logs`.
 */

type AdminActionResult = { ok: true } | { ok: false; message: string };

async function getAdminId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile || !canAccessAdmin(profile.role)) return null;
  return user.id;
}

async function logAdminAction(
  adminId: string,
  action: string,
  entity: string,
  entityId: string,
  details: Record<string, unknown>,
) {
  const admin = getAdminSupabase();
  const payload = details as Json;
  await admin.from('admin_actions').insert({
    admin_id: adminId,
    action,
    entity,
    entity_id: entityId,
    details: payload,
  });
  await admin.from('audit_logs').insert({
    profile_id: adminId,
    action,
    entity,
    entity_id: entityId,
    metadata: payload,
  });
}

/** Changer le statut d'un commerce (validation, suspension…). */
export async function setBusinessStatus(input: unknown): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };

  const parsed = adminBusinessStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'Paramètres invalides.' };

  try {
    const admin = getAdminSupabase();
    const { error } = await admin
      .from('businesses')
      .update({ status: parsed.data.status })
      .eq('id', parsed.data.business_id);
    if (error) {
      console.error('[vayeko][setBusinessStatus]', error);
      return { ok: false, message: error.message || 'Opération impossible pour le moment.' };
    }
    try {
      await logAdminAction(adminId, 'business.set_status', 'business', parsed.data.business_id, {
        status: parsed.data.status,
      });
    } catch {}
    revalidatePath('/admin/commerces');
    revalidatePath('/boutiques');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Erreur lors de la validation.' };
  }
}

/** Modifier le rôle d'un utilisateur (uniquement par un admin). */
export async function setUserRole(input: unknown): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };

  const parsed = adminUserRoleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'Paramètres invalides.' };
  if (parsed.data.profile_id === adminId) {
    return { ok: false, message: 'Vous ne pouvez pas modifier votre propre rôle.' };
  }

  try {
    const admin = getAdminSupabase();
    const { error } = await admin
      .from('profiles')
      .update({ role: parsed.data.role })
      .eq('id', parsed.data.profile_id);
    if (error) {
      console.error('[vayeko][setUserRole]', error);
      return { ok: false, message: error.message || 'Opération impossible.' };
    }
    try {
      await logAdminAction(adminId, 'user.set_role', 'profile', parsed.data.profile_id, {
        role: parsed.data.role,
      });
    } catch (logErr) {
      console.warn('[vayeko][logAdminAction] ignored', logErr);
    }
    revalidatePath('/admin/utilisateurs');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Erreur lors du changement de rôle.' };
  }
}

/** Supprimer ou désactiver un utilisateur (Action Admin). */
export async function deleteUser(profileId: string): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };
  if (profileId === adminId) return { ok: false, message: 'Impossible de supprimer votre propre compte.' };

  try {
    const admin = getAdminSupabase();
    // Marquer le compte comme supprimé (soft delete)
    const { error } = await admin
      .from('profiles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', profileId);

    if (error) {
      console.error('[vayeko][deleteUser]', error);
      return { ok: false, message: error.message || 'Impossible de supprimer cet utilisateur.' };
    }
    try {
      await logAdminAction(adminId, 'user.delete', 'profile', profileId, {});
    } catch {}
    revalidatePath('/admin/utilisateurs');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Erreur lors de la suppression.' };
  }
}

/** Supprimer une boutique (Action Admin). */
export async function deleteBusiness(businessId: string): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };

  try {
    const admin = getAdminSupabase();
    const { error } = await admin
      .from('businesses')
      .update({ deleted_at: new Date().toISOString(), status: 'suspended' })
      .eq('id', businessId);

    if (error) {
      console.error('[vayeko][deleteBusiness]', error);
      return { ok: false, message: error.message || 'Impossible de supprimer la boutique.' };
    }
    try {
      await logAdminAction(adminId, 'business.delete', 'business', businessId, {});
    } catch {}
    revalidatePath('/admin/commerces');
    revalidatePath('/boutiques');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Erreur lors de la suppression.' };
  }
}

/** Traiter un signalement (résolu / rejeté). */
export async function resolveReport(input: unknown): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };

  const parsed = reportResolutionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'Paramètres invalides.' };

  const admin = getAdminSupabase();
  const { error } = await admin
    .from('reports')
    .update({
      status: parsed.data.status,
      resolved_by: adminId,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.report_id);
  if (error) {
    console.error('[vayeko][resolveReport]', error.code);
    return { ok: false, message: 'Opération impossible pour le moment.' };
  }
  await logAdminAction(adminId, `report.${parsed.data.status}`, 'report', parsed.data.report_id, {});
  revalidatePath('/admin/signalements');
  return { ok: true };
}

/** Modérer un avis (publier / rejeter). */
export async function moderateReview(input: unknown): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };

  const parsed = moderateReviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'Paramètres invalides.' };

  const admin = getAdminSupabase();
  const { error } = await admin
    .from('reviews')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.review_id);
  if (error) {
    console.error('[vayeko][moderateReview]', error.code);
    return { ok: false, message: 'Opération impossible pour le moment.' };
  }
  await logAdminAction(adminId, `review.${parsed.data.status}`, 'review', parsed.data.review_id, {});
  revalidatePath('/admin/moderation');
  return { ok: true };
}

/** Restaurer un utilisateur supprimé (Action Admin). */
export async function restoreUser(profileId: string): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };

  try {
    const admin = getAdminSupabase();
    const { error } = await admin
      .from('profiles')
      .update({ deleted_at: null })
      .eq('id', profileId);

    if (error) {
      console.error('[vayeko][restoreUser]', error);
      return { ok: false, message: error.message || 'Impossible de réactiver cet utilisateur.' };
    }
    try {
      await logAdminAction(adminId, 'user.restore', 'profile', profileId, {});
    } catch {}
    revalidatePath('/admin/utilisateurs');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Erreur lors de la réactivation.' };
  }
}

/** Réactiver une boutique désactivée (Action Admin). */
export async function restoreBusiness(businessId: string): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };

  try {
    const admin = getAdminSupabase();
    const { error } = await admin
      .from('businesses')
      .update({ deleted_at: null, status: 'active' })
      .eq('id', businessId);

    if (error) {
      console.error('[vayeko][restoreBusiness]', error);
      return { ok: false, message: error.message || 'Impossible de réactiver la boutique.' };
    }
    try {
      await logAdminAction(adminId, 'business.restore', 'business', businessId, {});
    } catch {}
    revalidatePath('/admin/commerces');
    revalidatePath('/boutiques');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Erreur lors de la réactivation.' };
  }
}

/** Supprimer définitivement une boutique à vie (Purge totale). */
export async function purgeBusinessPermanent(businessId: string): Promise<AdminActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return { ok: false, message: 'Accès refusé.' };

  try {
    const admin = getAdminSupabase();
    // Appel de la procédure stockée de purge cascade
    const { error: rpcErr } = await (admin as any).rpc('purge_business_permanent', { p_business_id: businessId });
    if (rpcErr) {
      // Fallback manuel si la fonction RPC n'est pas encore créée
      await admin.from('shops').delete().eq('business_id', businessId);
      await admin.from('services').delete().eq('business_id', businessId);
      await admin.from('business_members').delete().eq('business_id', businessId);
      const { error } = await admin.from('businesses').delete().eq('id', businessId);
      if (error) throw error;
    }
    revalidatePath('/admin/commerces');
    revalidatePath('/boutiques');
    revalidatePath('/dashboard/boutique');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Erreur lors de la suppression définitive.' };
  }
}
