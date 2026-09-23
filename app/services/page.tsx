import type { Metadata } from 'next';
import { listCities, listServiceCategories, listServices } from '@/lib/data';
import { searchQuerySchema } from '@/lib/validations';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceSearch } from '@/components/services/ServiceSearch';
import { ServiceFilters } from '@/components/services/ServiceFilters';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services au Togo',
  description:
    'Trouvez un artisan, un prestataire ou un professionnel près de chez vous au Togo : mécanique, coiffure, bricolage, informatique… Contact direct WhatsApp.',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ServicesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const parsed = searchQuerySchema.safeParse({
    q: typeof raw.q === 'string' ? raw.q : '',
    ville: typeof raw.ville === 'string' ? raw.ville : '',
    categorie: typeof raw.categorie === 'string' ? raw.categorie : '',
  });
  const { q, ville, categorie } = parsed.success ? parsed.data : { q: '', ville: '', categorie: '' };
  const page = Math.max(1, Number.parseInt(typeof raw.page === 'string' ? raw.page : '1', 10) || 1);

  const [cities, categories, result] = await Promise.all([
    listCities(),
    listServiceCategories(),
    listServices({ q, ville, categorie, page, pageSize: 12 }),
  ]);
  const cityNames = cities.map((c) => c.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">Services</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Artisans et prestataires près de chez vous, contactables directement sur WhatsApp.
        </p>
      </header>

      <ServiceSearch
        cities={cityNames}
        defaultQuery={q}
        defaultCity={ville}
        categorie={categorie}
      />

      <div className="mt-5">
        <ServiceFilters
          categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
          activeSlug={categorie || undefined}
          q={q || undefined}
          ville={ville || undefined}
        />
      </div>

      <p className="mt-5 text-sm font-medium text-neutral-500">
        {result.total} service{result.total > 1 ? 's' : ''} trouvé{result.total > 1 ? 's' : ''}
      </p>

      {result.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon="wrench"
            title="Aucun service trouvé"
            message="Modifiez votre recherche ou vos filtres pour voir plus de résultats."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}

      <Pagination
        page={result.page}
        total={result.total}
        pageSize={result.pageSize}
        basePath="/services"
        query={{ q: q || undefined, ville: ville || undefined, categorie: categorie || undefined }}
      />
    </div>
  );
}
