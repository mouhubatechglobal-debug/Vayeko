import { WhatsAppShareButton } from '@/components/boutiques/WhatsAppShareButton';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';
import { getProduct, listReviews } from '@/lib/data';
import { formatCfa, formatDateFr } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import { WhatsAppButton } from '@/components/boutiques/WhatsAppButton';
import { ReportDialog } from '@/components/ReportDialog';
import { ReviewForm } from '@/components/ReviewForm';
import { FavoriteButton } from '@/components/FavoriteButton';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Produit introuvable' };
  return { title: product.name, description: product.description ?? undefined };
}

export default async function ProduitDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const [reviews, profile] = await Promise.all([
    listReviews('product', product.id),
    getCurrentProfile(),
  ]);

  const whatsappMessage = `Bonjour, je suis intéressé(e) par « ${product.name} » (${formatCfa(product.price_cfa)}) vu sur Vayeko. Est-ce disponible ?`;
  const mainImage = product.images[0] ?? product.image_url;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-neutral-500">
        <Link href="/" className="hover:text-vayeko-green">Accueil</Link>
        <span aria-hidden> / </span>
        <Link href="/produits" className="hover:text-vayeko-green">Produits</Link>
        <span aria-hidden> / </span>
        <span className="font-semibold text-vayeko-green">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-vayeko-cream to-amber-50 shadow-card">
            {mainImage ? (
              mainImage.startsWith('http') ? (
                <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <Image src={mainImage} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-7xl" aria-hidden>
                🧺
              </div>
            )}
            {!product.available && (
              <span className="absolute left-3 top-3">
                <Badge tone="red">Indisponible</Badge>
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Autres photos">
              {product.images.slice(1, 5).map((url) => (
                <li key={url} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">{product.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {product.category_name && <Badge tone="green">{product.category_name}</Badge>}
                <StarRating value={product.average_rating} count={product.reviews_count} size="md" />
              </div>
            </div>
            <FavoriteButton target="product" productId={product.id} isAuthenticated={Boolean(profile)} />
          </div>

          <p className="mt-4 text-3xl font-extrabold text-vayeko-green">{formatCfa(product.price_cfa)}</p>

          <div className="mt-5 space-y-2.5">
            <WhatsAppButton
              phone={product.shop_whatsapp}
              message={whatsappMessage}
              size="lg"
              className="w-full"
              label="Commander via WhatsApp"
            />
            <div className="pt-1">
              <WhatsAppShareButton title={product.name} type="produit" />
            </div>
            <p className="text-xs text-neutral-500">
              Vous discutez directement avec le vendeur : remise en main propre, prix et disponibilité.
            </p>
          </div>

          {product.shop_name && (
            <div className="mt-6 rounded-2xl bg-white p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Vendu par</p>
              <Link
                href={`/boutiques/${product.shop_slug}`}
                className="mt-1 inline-flex items-center gap-2 font-extrabold text-vayeko-green hover:underline"
              >
                <Icon name="shop" className="h-4 w-4 text-vayeko-yellow-dark" />
                {product.shop_name}
              </Link>
            </div>
          )}

          <section aria-labelledby="description" className="mt-6 rounded-2xl bg-white p-5 shadow-card">
            <h2 id="description" className="font-extrabold text-vayeko-green">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
              {product.description ?? 'Aucune description fournie pour ce produit.'}
            </p>
          </section>

          <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
            <ReportDialog target="product" productId={product.id} />
          </div>
        </div>
      </div>

      <section aria-labelledby="avis" className="mt-10 rounded-2xl bg-white p-6 shadow-card">
        <h2 id="avis" className="text-lg font-extrabold text-vayeko-green">
          Avis ({product.reviews_count})
        </h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Aucun avis pour le moment.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-xl bg-neutral-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-vayeko-green">{r.author}</span>
                  <time className="text-xs text-neutral-400" dateTime={r.created_at}>
                    {formatDateFr(r.created_at)}
                  </time>
                </div>
                <StarRating value={r.rating} className="mt-1" />
                {r.comment && <p className="mt-2 text-sm text-neutral-700">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          <ReviewForm target="product" productId={product.id} isAuthenticated={Boolean(profile)} />
        </div>
      </section>
    </div>
  );
}
