'use client';

import { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { Loader } from '@/components/ui/Loader';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ProductCard } from '@/components/boutiques/ProductCard';
import { BoutiqueCard } from '@/components/boutiques/BoutiqueCard';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';

type Tab = 'tout' | 'services' | 'boutiques' | 'produits';

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'tout', label: 'Tout' },
  { key: 'services', label: 'Services' },
  { key: 'boutiques', label: 'Boutiques' },
  { key: 'produits', label: 'Produits' },
];

/** Résultats de recherche (client, appel API avec debounce). */
export function SearchResults({ q, ville }: { q: string; ville?: string }) {
  const { services, boutiques, produits, loading, error } = useSearch({ q, ville });
  const [tab, setTab] = useState<Tab>('tout');

  const total = services.length + boutiques.length + produits.length;
  const show = (t: Tab) => tab === 'tout' || tab === t;

  if (!q.trim()) {
    return (
      <EmptyState
        icon="search"
        title="Rechercher sur Vayeko"
        message="Saisissez un mot-clé : un service, une boutique, un produit…"
      />
    );
  }

  if (loading) return <Loader label={`Recherche de « ${q} »…`} />;

  if (error) {
    return <EmptyState icon="flag" title="Recherche indisponible" message={error} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition',
              tab === t.key
                ? 'bg-vayeko-green text-white shadow'
                : 'bg-white text-vayeko-green shadow-card hover:bg-vayeko-green/5',
            )}
          >
            {t.label}
          </button>
        ))}
        <Badge tone="neutral">{total} résultat{total > 1 ? 's' : ''}</Badge>
      </div>

      {total === 0 && (
        <EmptyState
          icon="search"
          title={`Aucun résultat pour « ${q} »`}
          message="Essayez un autre mot-clé ou une autre ville."
        />
      )}

      {show('services') && services.length > 0 && (
        <section aria-labelledby="search-services">
          <h2 id="search-services" className="mb-3 flex items-center gap-2 text-lg font-extrabold text-vayeko-green">
            <Icon name="wrench" className="h-5 w-5 text-vayeko-yellow-dark" /> Services
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}

      {show('boutiques') && boutiques.length > 0 && (
        <section aria-labelledby="search-boutiques">
          <h2 id="search-boutiques" className="mb-3 flex items-center gap-2 text-lg font-extrabold text-vayeko-green">
            <Icon name="shop" className="h-5 w-5 text-vayeko-yellow-dark" /> Boutiques
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boutiques.map((b) => (
              <BoutiqueCard key={b.id} boutique={b} />
            ))}
          </div>
        </section>
      )}

      {show('produits') && produits.length > 0 && (
        <section aria-labelledby="search-produits">
          <h2 id="search-produits" className="mb-3 flex items-center gap-2 text-lg font-extrabold text-vayeko-green">
            <Icon name="tag" className="h-5 w-5 text-vayeko-yellow-dark" /> Produits
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {produits.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
