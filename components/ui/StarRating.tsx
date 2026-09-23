import { cn } from '@/lib/utils';

/** Affichage d'une note 1–5 avec étoiles (jaunes comme la maquette). */
export function StarRating({
  value,
  count,
  size = 'sm',
  className,
}: {
  value: number | null;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const stars = Math.round(value ?? 0);
  const dims = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <span className={cn('inline-flex flex-wrap items-center gap-1', className)}>
      <span className="inline-flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={cn(dims, i <= stars ? 'fill-vayeko-yellow-dark' : 'fill-neutral-300')}
          >
            <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z" />
          </svg>
        ))}
      </span>
      <span className="sr-only">{value == null ? 'Pas encore de note' : `Note ${value} sur 5`}</span>
      {value != null && (
        <span className="text-xs font-semibold text-neutral-700">{value.toFixed(1)}</span>
      )}
      {count != null && <span className="text-xs text-neutral-400">({count})</span>}
    </span>
  );
}
