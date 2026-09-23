import type { Metadata } from 'next';
import { getServerSupabase } from '@/lib/database';
import { formatDateFr } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ROLE_LABELS } from '@/lib/permissions';
import { UserRoleSelect } from '@/components/admin/AdminActions';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Gestion des utilisateurs' };

export default async function AdminUtilisateursPage() {
  const supabase = await getServerSupabase();
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, username, role, created_at, deleted_at')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <h2 className="text-xl font-extrabold text-vayeko-green">Utilisateurs</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Changement de rôle réservé aux administrateurs — chaque changement est journalisé.
      </p>
      {error || !profiles || profiles.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon="users" title="Aucun utilisateur" message="Les comptes créés apparaîtront ici." />
        </div>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {profiles.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-card"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-vayeko-green">
                  {p.full_name ?? 'Sans nom'}
                  {p.deleted_at && <Badge tone="red" className="ml-2">Supprimé</Badge>}
                </p>
                <p className="text-xs text-neutral-500">
                  @{p.username ?? '—'} · inscrit le {formatDateFr(p.created_at)} · rôle :{' '}
                  {ROLE_LABELS[p.role]}
                </p>
              </div>
              <UserRoleSelect profileId={p.id} current={p.role} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
