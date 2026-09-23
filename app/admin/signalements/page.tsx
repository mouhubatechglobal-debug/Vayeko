import type { Metadata } from 'next';
import { getServerSupabase } from '@/lib/database';
import { formatDateFr } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ResolveReportActions } from '@/components/admin/AdminActions';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Signalements' };

const STATUS_LABELS: Record<string, { label: string; tone: 'yellow' | 'green' | 'red' | 'neutral' }> = {
  open: { label: 'Ouvert', tone: 'red' },
  in_review: { label: 'En cours', tone: 'yellow' },
  resolved: { label: 'Résolu', tone: 'green' },
  rejected: { label: 'Rejeté', tone: 'neutral' },
};

const TARGET_LABELS: Record<string, string> = {
  user: 'Utilisateur',
  business: 'Commerce',
  product: 'Produit',
  service: 'Service',
  review: 'Avis',
};

export default async function AdminSignalementsPage() {
  const supabase = await getServerSupabase();
  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, target, reason, details, status, created_at, profiles:reporter_id(full_name)')
    .order('status')
    .order('created_at', { ascending: false })
    .limit(100)
    .returns<Array<{
      id: string;
      target: string;
      reason: string;
      details: string | null;
      status: string;
      created_at: string;
      profiles: { full_name: string | null } | null;
    }>>();

  return (
    <div>
      <h2 className="text-xl font-extrabold text-vayeko-green">Signalements</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Examinez chaque signalement des utilisateurs puis marquez-le comme résolu ou rejeté.
      </p>
      {error || !reports || reports.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon="flag" title="Aucun signalement" message="Tout est calme. 🎉" />
        </div>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {reports.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white px-4 py-3 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-vayeko-green">
                    {r.reason}
                    <Badge tone={STATUS_LABELS[r.status]?.tone ?? 'neutral'} className="ml-2">
                      {STATUS_LABELS[r.status]?.label ?? r.status}
                    </Badge>
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Cible : {TARGET_LABELS[r.target] ?? r.target} · Par :{' '}
                    {r.profiles?.full_name ?? 'Anonyme'} · {formatDateFr(r.created_at)}
                  </p>
                  {r.details && <p className="mt-2 text-sm text-neutral-700">{r.details}</p>}
                </div>
                {(r.status === 'open' || r.status === 'in_review') && (
                  <ResolveReportActions reportId={r.id} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
