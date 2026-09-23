import type { Metadata } from 'next';
import Link from 'next/link';
import { listProductCategories, listProducts } from '@/lib/data';
import { searchQuerySchema } from '@/lib/validations';
import { ProductCard } from '@/components/boutiques/ProductCard';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Produits au Togo',
  description: 'Parcourez les produits des boutiques Vayeko : alimentation, pagne, artisanat… Prix affichés en francs CFA, contact direct sur WhatsApp.',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProduitsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const parsed = searchQuerySchema.safeParse({
    q: typeof raw.q === 'string' ? raw.q : '',
    categorie: typeof raw.categorie === 'string' ? raw.categorie : '',
  });
  const { q, categorie } = parsed.success ? parsed.data : { q: '', categorie: '' };
  const page = Math.max(1, Number.parseInt(typeof raw.page === 'string' ? raw.page : '1', 10) || 1);

  const [categories, result] = await Promise.all([
    listProductCategories(),
    listProducts({ q, categorie, page, pageSize: 12 }),
  ]);

  const chipHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (slug) params.set('categorie', slug);
    const qs = params.toString();
    return qs ? `/produits?${qs}` : '/produits';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">Produits</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Prix affichés en francs CFA. Contactez le vendeur directement sur WhatsApp.
        </p>
      </header>

      <form action="/produits" method="GET" role="search" className="flex gap-2 rounded-2xl bg-white p-2 shadow-card">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher un produit</span>
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            maxLength={80}
            placeholder="Arachide, pagne, téléphone…"
            className="w-full rounded-xl bg-neutral-50 py-3 pl-10 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-vayeko-yellow"
          />
        </label>
        {categorie && <input type="hidden" name="categorie" value={categorie} />}
        <button
          type="submit"
          className="rounded-xl bg-vayeko-yellow px-5 py-3 text-sm font-extrabold text-vayeko-green-dark shadow transition hover:brightness-105"
        >
          Filtrer
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
        <Link
          href={chipHref()}
          aria-current={!categorie ? 'true' : undefined}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-semibold shadow-card transition',
            !categorie ? 'bg-vayeko-green text-white' : 'bg-white text-vayeko-green hover:bg-vayeko-green/5',
          )}
        >
          Toutes
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={chipHref(c.slug)}
            aria-current={categorie === c.slug ? 'true' : undefined}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold shadow-card transition',
              categorie === c.slug ? 'bg-vayeko-green text-white' : 'bg-white text-vayeko-green hover:bg-vayeko-green/5',
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {result.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon="tag" title="Aucun produit trouvé" message="Modifiez votre recherche ou vos filtres." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {result.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination
        page={result.page}
        total={result.total}
        pageSize={result.pageSize}
        basePath="/produits"
        query={{ q: q || undefined, categorie: categorie || undefined }}
      />
    </div>
  );
}
