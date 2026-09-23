import type { Metadata } from 'next';
import { getServerSupabase } from '@/lib/database';
import { formatDateFr } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { ModerateReviewActions } from '@/components/admin/AdminActions';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Modération des avis' };

/**
 * File de modération : affiche les avis signalés ou les plus récents,
 * et permet de les rejeter (ils disparaissent alors de l'espace public).
 */
export default async function AdminModerationPage() {
  const supabase = await getServerSupabase();

  // Avis concernés par un signalement OU avis récents (derniers 30 jours)
  const { data: reportedIds } = await supabase
    .from('reports')
    .select('review_id')
    .eq('target', 'review')
    .neq('status', 'rejected');
  const reviewedIds = [...new Set((reportedIds ?? []).map((r) => r.review_id).filter(Boolean))] as string[];

  type ReviewRow = {
    id: string;
    target: string;
    rating: number;
    comment: string | null;
    created_at: string;
    status: string;
    profiles: { full_name: string | null } | null;
  };

  const baseQuery = supabase
    .from('reviews')
    .select('id, target, rating, comment, created_at, status, profiles:author_id(full_name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const { data: reviews, error } =
    reviewedIds.length > 0
      ? await baseQuery.in('id', reviewedIds).limit(60).returns<ReviewRow[]>()
      : await baseQuery.limit(20).returns<ReviewRow[]>();

  return (
    <div>
      <h2 className="text-xl font-extrabold text-vayeko-green">Modération des avis</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Les avis signalés apparaissent en priorité. Un avis rejeté n'est plus affiché publiquement.
      </p>
      {error || !reviews || reviews.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon="shield" title="Rien à modérer" message="Aucun avis n'attend d'action. Bravo !" />
        </div>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white px-4 py-3 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-vayeko-green">
                    {r.profiles?.full_name ?? 'Utilisateur'}
                    {reviewedIds.includes(r.id) && (
                      <Badge tone="red" className="ml-2">Signalé</Badge>
                    )}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating value={r.rating} />
                    <span className="text-xs text-neutral-400">
                      {r.target} · {formatDateFr(r.created_at)}
                    </span>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-neutral-700">{r.comment}</p>}
                </div>
                <ModerateReviewActions reviewId={r.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
