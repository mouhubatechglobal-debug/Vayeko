import { getServerSupabase } from '@/lib/database';
import { Icon, type IconName } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const supabase = await getServerSupabase();

  const [users, businesses, pendingBiz, products, services, openReports] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('services').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'open'),
  ]);

  const stats: Array<{ label: string; value: number | null; icon: IconName; tone: string }> = [
    { label: 'Utilisateurs', value: users.count, icon: 'users', tone: 'bg-vayeko-green/10 text-vayeko-green' },
    { label: 'Commerces', value: businesses.count, icon: 'shop', tone: 'bg-amber-100 text-vayeko-yellow-dark' },
    { label: 'À valider', value: pendingBiz.count, icon: 'clock', tone: 'bg-orange-100 text-orange-600' },
    { label: 'Produits', value: products.count, icon: 'tag', tone: 'bg-emerald-100 text-emerald-700' },
    { label: 'Services', value: services.count, icon: 'wrench', tone: 'bg-sky-100 text-sky-700' },
    { label: 'Signalements ouverts', value: openReports.count, icon: 'flag', tone: 'bg-red-100 text-vayeko-red' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl bg-white p-5 shadow-card">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${s.tone}`}>
            <Icon name={s.icon} className="h-5 w-5" />
          </span>
          <p className="mt-3 text-3xl font-extrabold text-vayeko-green">{s.value ?? '—'}</p>
          <p className="text-sm text-neutral-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
