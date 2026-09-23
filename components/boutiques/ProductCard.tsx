import Link from 'next/link';
import Image from 'next/image';
import { formatCfa } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import type { ProductCardItem } from '@/types/product';

/**
 * Carte produit compacte (grille "Produits populaires" de la maquette).
 */
export function ProductCard({ product }: { product: ProductCardItem }) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-yellow"
      aria-label={`Voir le produit ${product.name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-vayeko-cream to-amber-50">
        {product.image_url ? (
          product.image_url.startsWith('http') ? (
            // Images distantes (Supabase Storage, seed existant)
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-5xl" aria-hidden>
            🧺
          </div>
        )}
        {!product.available && (
          <span className="absolute left-2 top-2">
            <Badge tone="red">Indisponible</Badge>
          </span>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-bold text-vayeko-green group-hover:underline">{product.name}</h3>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="text-sm font-extrabold text-neutral-900">{formatCfa(product.price_cfa)}</span>
          <StarRating value={product.average_rating} count={product.reviews_count} />
        </div>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-vayeko-green-light">
          Détails
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
