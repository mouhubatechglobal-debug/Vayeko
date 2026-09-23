import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';
import { getBoutique, listProductsForBoutique, listReviews } from '@/lib/data';
import { formatDateFr } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import { ProductCard } from '@/components/boutiques/ProductCard';
import { WhatsAppButton } from '@/components/boutiques/WhatsAppButton';
import { ReportDialog } from '@/components/ReportDialog';
import { ReviewForm } from '@/components/ReviewForm';
import { FavoriteButton } from '@/components/FavoriteButton';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const boutique = await getBoutique(id);
  if (!boutique) return { title: 'Boutique introuvable' };
  return { title: boutique.name, description: boutique.description ?? undefined };
}

export default async function BoutiqueDetailPage({ params }: Props) {
  const { id } = await params;
  const boutique = await getBoutique(id);
  if (!boutique) notFound();

  const [products, reviews, profile] = await Promise.all([
    listProductsForBoutique(boutique.slug),
    listReviews('business', boutique.id),
    getCurrentProfile(),
  ]);

  const whatsappMessage = `Bonjour, j'ai trouvé votre boutique « ${boutique.name} » sur Vayeko.`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-neutral-500">
        <Link href="/" className="hover:text-vayeko-green">Accueil</Link>
        <span aria-hidden> / </span>
        <Link href="/boutiques" className="hover:text-vayeko-green">Boutiques</Link>
        <span aria-hidden> / </span>
        <span className="font-semibold text-vayeko-green">{boutique.name}</span>
      </nav>

      <header className="overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="bg-gradient-to-r from-vayeko-green to-emerald-700 px-6 py-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">{boutique.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/85">
                {boutique.city_name && (
                  <span className="inline-flex items-center gap-1">
                    <Icon name="map-pin" className="h-4 w-4" /> {boutique.city_name}
                  </span>
                )}
                <StarRating value={boutique.average_rating ?? null} count={boutique.reviews_count ?? 0} size="md" />
              </div>
            </div>
            <FavoriteButton target="business" businessId={boutique.id} isAuthenticated={Boolean(profile)} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="max-w-xl text-sm text-neutral-600">{boutique.description}</p>
          <div className="flex items-center gap-2">
            <WhatsAppButton phone={boutique.whatsapp} message={whatsappMessage} />
            <ReportDialog target="business" businessId={boutique.id} />
          </div>
        </div>
      </header>

      <section aria-labelledby="produits" className="mt-8">
        <h2 id="produits" className="text-xl font-extrabold text-vayeko-green">
          Produits ({products.length})
        </h2>
        {products.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon="box" title="Pas encore de produits" message="Cette boutique publiera bientôt ses produits." />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="avis" className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <h2 id="avis" className="text-lg font-extrabold text-vayeko-green">
          Avis clients ({boutique.reviews_count ?? 0})
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
          <ReviewForm target="business" businessId={boutique.id} isAuthenticated={Boolean(profile)} />
        </div>
      </section>
    </div>
  );
}
