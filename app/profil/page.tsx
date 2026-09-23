import { UpgradeToMerchantButton } from '@/components/profil/UpgradeToMerchantButton';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/database';
import { requireUser } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { formatDateFr } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/permissions';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import type { Favorite } from '@/types/database';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Mon profil' };

type FavoriteRow = Favorite & {
  businesses: { name: string; slug: string } | null;
  products: { name: string; slug: string } | null;
  services: { name: string; slug: string } | null;
};

export default async function ProfilPage() {
  if (!isSupabaseConfigured()) redirect('/connexion?mode=demo');
  const profile = await requireUser('/profil');

  const supabase = await getServerSupabase();
  const { data: favorites } = await supabase
    .from('favorites')
    .select('*, businesses(name, slug), products(name, slug), services(name, slug)')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(24)
    .returns<FavoriteRow[]>();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-vayeko-yellow text-2xl font-extrabold text-vayeko-green-dark">
            {(profile.full_name ?? '')[0]?.toUpperCase() ?? 'V'}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-extrabold text-vayeko-green">
              {profile.full_name ?? 'Utilisateur Vayeko'}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge tone="green">{ROLE_LABELS[profile.role]}</Badge>
              <span className="text-xs text-neutral-500">
                Membre depuis le {formatDateFr(profile.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <UpgradeToMerchantButton currentRole={profile.role} />

      <section aria-labelledby="mes-favoris" className="mt-8">
        <h2 id="mes-favoris" className="text-xl font-extrabold text-vayeko-green">
          Mes favoris
        </h2>
        {!favorites || favorites.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-white p-6 text-sm text-neutral-500 shadow-card">
            Vous n'avez pas encore de favoris. Touchez le cœur sur une fiche pour l'enregistrer ici.
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {favorites.map((f) => {
              const target =
                f.target === 'business'
                  ? { name: f.businesses?.name, href: `/boutiques/${f.businesses?.slug}` }
                  : f.target === 'product'
                    ? { name: f.products?.name, href: `/produits/${f.products?.slug}` }
                    : { name: f.services?.name, href: `/services/${f.services?.slug}` };
              return (
                <li key={f.id}>
                  <a
                    href={target.href ?? '#'}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-card transition hover:shadow-lift"
                  >
                    <span className="flex items-center gap-3">
                      <Icon name="heart" className="h-4 w-4 fill-vayeko-red text-vayeko-red" />
                      <span className="font-semibold text-vayeko-green">{target.name ?? 'Contenu'}</span>
                    </span>
                    <span className="text-xs text-neutral-400">
                      {f.target === 'business' ? 'Boutique' : f.target === 'product' ? 'Produit' : 'Service'}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="infos" className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <h2 id="infos" className="text-lg font-extrabold text-vayeko-green">Informations</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-neutral-500">Nom d'utilisateur</dt>
            <dd className="font-semibold text-neutral-900">{profile.username ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Téléphone</dt>
            <dd className="font-semibold text-neutral-900">{profile.phone ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">WhatsApp</dt>
            <dd className="font-semibold text-neutral-900">{profile.whatsapp ?? '—'}</dd>
          </div>
        </dl>
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
          <StarRating value={null} />
          La modification du profil passe par l'API sécurisée (PATCH /api/utilisateurs) utilisée par
          l'espace professionnel.
        </div>
      </section>
    </div>
  );
}
