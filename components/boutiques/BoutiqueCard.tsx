import Link from 'next/link';
import Image from 'next/image';
import { cn, truncate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import type { BusinessCardItem } from '@/types/business';

const GRADIENTS = [
  'from-orange-500 to-amber-400',
  'from-teal-600 to-emerald-500',
  'from-rose-500 to-red-500',
  'from-indigo-600 to-sky-500',
];

function gradientFor(seed: string): string {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

/** Carte d'aperçu d'une boutique. */
export function BoutiqueCard({ boutique }: { boutique: BusinessCardItem }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lift">
      <Link
        href={`/boutiques/${boutique.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-yellow"
        aria-label={`Voir la boutique ${boutique.name}`}
      >
        <div className={cn('flex h-24 items-center gap-3 bg-gradient-to-r px-5 text-white', gradientFor(boutique.id + boutique.name))}>
          {boutique.logo_url ? (
            <Image
              src={boutique.logo_url}
              alt={`Logo de ${boutique.name}`}
              width={52}
              height={52}
              className="h-13 w-13 rounded-xl border-2 border-white/60 object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/25 text-xl font-extrabold backdrop-blur-sm">
              {boutique.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold group-hover:underline">{boutique.name}</h3>
            {boutique.city_name && (
              <p className="inline-flex items-center gap-1 text-xs text-white/85">
                <Icon name="map-pin" className="h-3 w-3" />
                {boutique.city_name}
              </p>
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="line-clamp-2 text-sm text-neutral-600">
            {boutique.description ? truncate(boutique.description, 110) : 'Boutique partenaire Vayeko.'}
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
            <StarRating value={boutique.average_rating ?? null} count={boutique.reviews_count ?? 0} />
            {typeof boutique.products_count === 'number' && (
              <Badge tone="green">
                <Icon name="box" className="h-3 w-3" />
                {boutique.products_count} produit{boutique.products_count > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
