import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}

/** Pagination serveur (liens réels — navigation clavier et SEO). */
export function Pagination({ page, total, pageSize, basePath, query = {} }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => v && params.set(k, v));
    params.set('page', String(p));
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
    .reduce<Array<number | '…'>>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
      acc.push(p);
      return acc;
    }, []);

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          aria-label="Page précédente"
          className="rounded-lg bg-white p-2 text-vayeko-green shadow-card hover:bg-vayeko-green/5"
        >
          <Icon name="chevron-right" className="h-4 w-4 rotate-180" />
        </Link>
      )}
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-neutral-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'rounded-lg px-3.5 py-2 text-sm font-semibold shadow-card',
              p === page ? 'bg-vayeko-green text-white' : 'bg-white text-vayeko-green hover:bg-vayeko-green/5',
            )}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          aria-label="Page suivante"
          className="rounded-lg bg-white p-2 text-vayeko-green shadow-card hover:bg-vayeko-green/5"
        >
          <Icon name="chevron-right" className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
