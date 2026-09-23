import { getCurrentProfile } from '@/lib/auth';
import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Badge } from '@/components/ui/Badge';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ROLE_LABELS } from '@/lib/permissions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Stat {
  label: string;
  value: number;
  icon: IconName;
  href: string;
}

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  let businessCount = 0;
  let productCount = 0;
  let serviceCount = 0;

  if (profile && isSupabaseConfigured()) {
    const supabase = await getServerSupabase();
    const { data: memberships } = await supabase
      .from('business_members')
      .select('business_id')
      .eq('profile_id', profile.id);
    const businessIds = (memberships ?? []).map((m) => m.business_id);
    businessCount = businessIds.length;

    if (businessIds.length > 0) {
      const { data: shops } = await supabase
        .from('shops')
        .select('id')
        .in('business_id', businessIds);
      const shopIds = (shops ?? []).map((s) => s.id);
      if (shopIds.length > 0) {
        const { count } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .in('shop_id', shopIds)
          .is('deleted_at', null);
        productCount = count ?? 0;
      }
      const { count: srvCount } = await supabase
        .from('services')
        .select('id', { count: 'exact', head: true })
        .in('business_id', businessIds)
        .is('deleted_at', null);
      serviceCount = srvCount ?? 0;
    }
  }

  const stats: Stat[] = [
    { label: 'Mes entreprises', value: businessCount, icon: 'shop', href: '/dashboard/boutique' },
    { label: 'Produits publiés', value: productCount, icon: 'tag', href: '/dashboard/produits' },
    { label: 'Services publiés', value: serviceCount, icon: 'wrench', href: '/dashboard/services' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-vayeko-green to-emerald-700 p-6 text-white shadow-card">
        <p className="text-sm uppercase tracking-wide text-vayeko-yellow">Espace professionnel</p>
        <h2 className="mt-1 text-2xl font-extrabold">Bonjour {profile?.full_name ?? ''} 👋</h2>
        <div className="mt-2">
          <Badge tone="yellow">{ROLE_LABELS[profile?.role ?? 'merchant']}</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-vayeko-yellow/20 text-vayeko-yellow-dark">
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-extrabold text-vayeko-green">{s.value}</p>
            <p className="text-sm text-neutral-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h3 className="font-extrabold text-vayeko-green">Conseils pour bien vendre</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-neutral-600">
          <li>Ajoutez un numéro WhatsApp valide — c'est votre canal de vente n°1 sur Vayeko.</li>
          <li>Indiquez des prix clairs en FCFA pour susciter la confiance.</li>
          <li>Répondez rapidement aux messages : les avis clients comptent.</li>
          <li>Signalez à notre équipe toute demande suspecte de paiement à distance.</li>
        </ul>
      </div>
    </div>
  );
}
