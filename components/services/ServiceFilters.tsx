import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ServiceFiltersProps {
  categories: Array<{ name: string; slug: string }>;
  activeSlug?: string;
  q?: string;
  ville?: string;
}

/** Filtres par catégorie (chips) pour la liste des services. */
export function ServiceFilters({ categories, activeSlug, q, ville }: ServiceFiltersProps) {
  const buildHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (ville) params.set('ville', ville);
    if (slug) params.set('categorie', slug);
    const qs = params.toString();
    return qs ? `/services?${qs}` : '/services';
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
      <Link
        href={buildHref()}
        aria-current={!activeSlug ? 'true' : undefined}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-semibold shadow-card transition',
          !activeSlug ? 'bg-vayeko-green text-white' : 'bg-white text-vayeko-green hover:bg-vayeko-green/5',
        )}
      >
        Toutes
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={buildHref(c.slug)}
          aria-current={activeSlug === c.slug ? 'true' : undefined}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-semibold shadow-card transition',
            activeSlug === c.slug ? 'bg-vayeko-green text-white' : 'bg-white text-vayeko-green hover:bg-vayeko-green/5',
          )}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
