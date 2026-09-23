'use server';

import { revalidatePath } from 'next/cache';
import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { reportInputSchema, reviewInputSchema } from '@/lib/validations';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import type { Favorite, Report, Review } from '@/types/database';

/**
 * Server Actions Vayeko — chaque action :
 *   1. vérifie la session côté serveur,
 *   2. valide l'entrée avec Zod,
 *   3. s'appuie enfin sur les RLS PostgreSQL (dernière ligne de défense).
 * Jamais de message technique exposé à l'utilisateur final.
 */

type ActionResult = { ok: true } | { ok: false; message: string };

async function getAuthenticatedUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Retourne le lien WhatsApp reconstruit (sécurisé) pour un numéro. */
export async function getWhatsAppLink(phone: string, message: string): Promise<string | null> {
  return buildWhatsAppLink(phone, message);
}

// ---------------------------------------------------------------------------
// Avis
// ---------------------------------------------------------------------------
export async function submitReview(input: unknown): Promise<ActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'Connectez-vous pour laisser un avis.' };

  const parsed = reviewInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'Avis invalide. Vérifiez les champs.' };
  const r = parsed.data;

  // Cohérence cible : exactement une entité visée.
  const ids = [r.business_id, r.product_id, r.service_id].filter(Boolean);
  if (ids.length !== 1) return { ok: false, message: 'Cible de l’avis invalide.' };

  const supabase = await getServerSupabase();
  const insert: Partial<Review> = {
    author_id: userId,
    target: r.target,
    business_id: r.business_id ?? null,
    product_id: r.product_id ?? null,
    service_id: r.service_id ?? null,
    rating: r.rating,
    comment: r.comment,
    status: 'published',
  };
  const { error } = await supabase.from('reviews').insert(insert);
  if (error) {
    console.error('[vayeko][submitReview]', error.code);
    return { ok: false, message: 'Impossible de publier votre avis pour le moment.' };
  }
  revalidatePath('/services');
  revalidatePath('/produits');
  revalidatePath('/boutiques');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Signalements
// ---------------------------------------------------------------------------
export async function submitReport(input: unknown): Promise<ActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'Connectez-vous pour signaler un contenu.' };

  const parsed = reportInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'Signalement invalide. Vérifiez les champs.' };
  const r = parsed.data;

  const ids = [r.business_id, r.product_id, r.service_id, r.review_id, r.reported_profile_id].filter(Boolean);
  if (ids.length !== 1) return { ok: false, message: 'Cible du signalement invalide.' };

  const supabase = await getServerSupabase();
  const insert: Partial<Report> = {
    reporter_id: userId,
    target: r.target,
    business_id: r.business_id ?? null,
    product_id: r.product_id ?? null,
    service_id: r.service_id ?? null,
    review_id: r.review_id ?? null,
    reported_profile_id: r.reported_profile_id ?? null,
    reason: r.reason,
    details: r.details ?? null,
    status: 'open',
  };
  const { error } = await supabase.from('reports').insert(insert);
  if (error) {
    console.error('[vayeko][submitReport]', error.code);
    return { ok: false, message: 'Impossible d’envoyer le signalement pour le moment.' };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Favoris
// ---------------------------------------------------------------------------
export async function toggleFavorite(input: {
  target: 'business' | 'product' | 'service';
  business_id?: string;
  product_id?: string;
  service_id?: string;
}): Promise<ActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'Connectez-vous pour gérer vos favoris.' };

  const fk = input.target === 'business' ? 'business_id' : input.target === 'product' ? 'product_id' : 'service_id';
  const value = input[fk as 'business_id' | 'product_id' | 'service_id'];
  if (!value) return { ok: false, message: 'Cible invalide.' };

  const supabase = await getServerSupabase();
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('profile_id', userId)
    .eq(fk, value)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('favorites').delete().eq('id', existing.id);
    if (error) return { ok: false, message: 'Action impossible pour le moment.' };
  } else {
    const insert: Partial<Favorite> = {
      profile_id: userId,
      target: input.target,
      business_id: input.business_id ?? null,
      product_id: input.product_id ?? null,
      service_id: input.service_id ?? null,
    };
    const { error } = await supabase.from('favorites').insert(insert);
    if (error) {
      console.error('[vayeko][toggleFavorite]', error.code);
      return { ok: false, message: 'Action impossible pour le moment.' };
    }
  }
  return { ok: true };
}
