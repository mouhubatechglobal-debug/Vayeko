import type { Metadata } from 'next';
import { listBoutiques, listCities } from '@/lib/data';
import { searchQuerySchema } from '@/lib/validations';
import { BoutiqueCard } from '@/components/boutiques/BoutiqueCard';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Boutiques au Togo',
  description: 'Découvrez les boutiques Vayeko : pagne, alimentation, cosmétiques, artisanat… Contact direct WhatsApp avec le vendeur.',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BoutiquesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const parsed = searchQuerySchema.safeParse({
    q: typeof raw.q === 'string' ? raw.q : '',
    ville: typeof raw.ville === 'string' ? raw.ville : '',
  });
  const { q, ville } = parsed.success ? parsed.data : { q: '', ville: '' };
  const page = Math.max(1, Number.parseInt(typeof raw.page === 'string' ? raw.page : '1', 10) || 1);

  const [cities, result] = await Promise.all([
    listCities(),
    listBoutiques({ q, ville, page, pageSize: 12 }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">Boutiques</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Des commerces de confiance, partout au Togo.
        </p>
      </header>

      <form action="/boutiques" method="GET" role="search" className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-card sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher une boutique</span>
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            maxLength={80}
            placeholder="Nom de la boutique…"
            className="w-full rounded-xl bg-neutral-50 py-3 pl-10 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-vayeko-yellow"
          />
        </label>
        <label className="relative sm:w-44">
          <span className="sr-only">Ville</span>
          <select
            name="ville"
            defaultValue={ville}
            className="w-full appearance-none rounded-xl bg-neutral-50 px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-vayeko-yellow"
          >
            <option value="">Toutes les villes</option>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-xl bg-vayeko-yellow px-5 py-3 text-sm font-extrabold text-vayeko-green-dark shadow transition hover:brightness-105"
        >
          Filtrer
        </button>
      </form>

      {result.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon="shop" title="Aucune boutique trouvée" message="Modifiez votre recherche ou revenez plus tard." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((b) => (
            <BoutiqueCard key={b.id} boutique={b} />
          ))}
        </div>
      )}

      <Pagination
        page={result.page}
        total={result.total}
        pageSize={result.pageSize}
        basePath="/boutiques"
        query={{ q: q || undefined, ville: ville || undefined }}
      />
    </div>
  );
}
