import type { Metadata } from 'next';
import { listCities } from '@/lib/data';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { searchQuerySchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Recherche',
  description: 'Recherchez un service, une boutique ou un produit partout au Togo.',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RecherchePage({ searchParams }: Props) {
  const raw = await searchParams;
  const parsed = searchQuerySchema.safeParse({
    q: typeof raw.q === 'string' ? raw.q : '',
    ville: typeof raw.ville === 'string' ? raw.ville : '',
  });
  const { q, ville } = parsed.success ? parsed.data : { q: '', ville: '' };
  const cities = await listCities();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">Recherche</h1>
      <div className="mt-4">
        <SearchBar
          cities={cities.map((c) => c.name)}
          defaultQuery={q}
          defaultCity={ville || 'Lomé'}
        />
      </div>
      <div className="mt-8">
        <SearchResults key={`${q}::${ville}`} q={q} ville={ville || undefined} />
      </div>
    </div>
  );
}
