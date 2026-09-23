import Link from 'next/link';
import { RATE_TYPE_LABELS } from '@/lib/constants';
import { cn, formatCfa, truncate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import type { ServiceCardItem } from '@/types/service';

const GRADIENTS = [
  'from-emerald-600 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-sky-600 to-cyan-500',
  'from-violet-600 to-fuchsia-500',
  'from-lime-600 to-emerald-500',
];

function gradientFor(seed: string): string {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

/** Carte d'aperçu d'un service (liste / recherche / accueil). */
export function ServiceCard({ service }: { service: ServiceCardItem }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lift">
      <Link
        href={`/services/${service.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-yellow"
        aria-label={`Voir le service ${service.name}`}
      >
        <div
          className={cn(
            'flex h-28 items-center justify-center bg-gradient-to-br text-white',
            gradientFor(service.id + service.name),
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-extrabold backdrop-blur-sm">
            {service.name.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold leading-snug text-vayeko-green group-hover:underline">
              {truncate(service.name, 42)}
            </h3>
            {service.category_name && <Badge tone="green">{service.category_name}</Badge>}
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm text-neutral-600">
            {truncate(service.description, 110)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
            {service.city_name && (
              <span className="inline-flex items-center gap-1">
                <Icon name="map-pin" className="h-3.5 w-3.5 text-vayeko-red" />
                {service.city_name}
              </span>
            )}
            {service.business_name && (
              <span className="inline-flex items-center gap-1">
                <Icon name="shop" className="h-3.5 w-3.5 text-vayeko-green" />
                {service.business_name}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
            <StarRating value={service.average_rating} count={service.reviews_count} />
            <span className="text-sm font-extrabold text-vayeko-green">
              {service.price_cfa != null
                ? `${service.rate_type === 'hourly' ? `${formatCfa(service.price_cfa)}/h` : `${RATE_TYPE_LABELS[service.rate_type] === 'À partir de' ? 'dès ' : ''}${formatCfa(service.price_cfa)}`}`
                : RATE_TYPE_LABELS[service.rate_type]}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
