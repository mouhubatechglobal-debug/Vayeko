import type { Metadata } from 'next';
import { getAdminSupabase } from '@/lib/database';
import { formatDateFr } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { BusinessStatusActions, DeleteBusinessButton, ToggleVerifiedButton } from '@/components/admin/AdminActions';
import { EmptyState } from '@/components/EmptyState';
import type { BusinessStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Gestion des commerces' };

const STATUS_LABELS: Record<BusinessStatus, { label: string; tone: 'yellow' | 'green' | 'red' | 'neutral' }> = {
  pending: { label: 'En attente', tone: 'yellow' },
  active: { label: 'Actif', tone: 'green' },
  suspended: { label: 'Suspendu', tone: 'red' },
  rejected: { label: 'Rejeté', tone: 'red' },
};

export default async function AdminCommercesPage() {
  const supabase = getAdminSupabase();
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, type, status, created_at, profiles:owner_id(full_name)')
    
    .order('status')
    .order('created_at', { ascending: false })
    .limit(100)
    .returns<Array<{ id: string; name: string; type: string; status: BusinessStatus; created_at: string; profiles: { full_name: string | null } | null }>>();

  return (
    <div>
      <h2 className="text-xl font-extrabold text-vayeko-green">Commerces</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Validez les nouvelles boutiques ou suspendez celles qui enfreignent les règles.
      </p>
      {error || !businesses || businesses.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon="shop" title="Aucun commerce" message="Les commerces créés apparaîtront ici." />
        </div>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {businesses.map((b) => (
            <li key={b.id} className="rounded-2xl bg-white px-4 py-3 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-vayeko-green">
                    {b.name}
                    {(b as any).deleted_at && <Badge tone="red" className="ml-2">Désactivée / Supprimée</Badge>}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <Badge tone={STATUS_LABELS[b.status].tone}>{STATUS_LABELS[b.status].label}</Badge>
                    <span>Type : {b.type === 'shop' ? 'Commerce' : b.type === 'service' ? 'Prestataire' : 'Les deux'}</span>
                    <span>Propriétaire : {b.profiles?.full_name ?? '—'}</span>
                    <span>Créé le {formatDateFr(b.created_at)}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ToggleVerifiedButton businessId={b.id} isVerified={Boolean((b as any).is_verified)} />
                  <BusinessStatusActions businessId={b.id} current={b.status} />
                  <DeleteBusinessButton businessId={b.id} isDeleted={!!(b as any).deleted_at} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
