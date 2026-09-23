import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';
import { getService, listReviews } from '@/lib/data';
import { DAYS_FR, RATE_TYPE_LABELS } from '@/lib/constants';
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
  const service = await getService(id);
  if (!service) return { title: 'Service introuvable' };
  return {
    title: `${service.name}`,
    description: service.description.slice(0, 160),
  };
}

const UUID_RE = /^[0-9a-f-]{36}$/i;

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  const [reviews, profile] = await Promise.all([
    listReviews('service', UUID_RE.test(service.id) ? service.id : service.id),
    getCurrentProfile(),
  ]);

  const whatsappMessage = `Bonjour, j'ai trouvé votre service « ${service.name} » sur Vayeko. Est-il toujours disponible ?`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-neutral-500">
        <Link href="/" className="hover:text-vayeko-green">Accueil</Link>
        <span aria-hidden> / </span>
        <Link href="/services" className="hover:text-vayeko-green">Services</Link>
        <span aria-hidden> / </span>
        <span className="font-semibold text-vayeko-green">{service.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <article>
          <header className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">{service.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                  {service.category_name && <Badge tone="green">{service.category_name}</Badge>}
                  {service.city_name && (
                    <span className="inline-flex items-center gap-1">
                      <Icon name="map-pin" className="h-4 w-4 text-vayeko-red" /> {service.city_name}
                    </span>
                  )}
                  <StarRating value={service.average_rating} count={service.reviews_count} size="md" />
                </div>
              </div>
              <FavoriteButton
                target="service"
                serviceId={service.id}
                isAuthenticated={Boolean(profile)}
              />
            </div>
          </header>

          <section aria-labelledby="description" className="mt-6 rounded-2xl bg-white p-6 shadow-card">
            <h2 id="description" className="text-lg font-extrabold text-vayeko-green">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-neutral-700">{service.description}</p>
          </section>

          {service.opening_hours && Object.keys(service.opening_hours).length > 0 && (
            <section aria-labelledby="horaires" className="mt-6 rounded-2xl bg-white p-6 shadow-card">
              <h2 id="horaires" className="flex items-center gap-2 text-lg font-extrabold text-vayeko-green">
                <Icon name="clock" className="h-5 w-5 text-vayeko-yellow-dark" /> Horaires
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm text-neutral-700">
                {Object.entries(service.opening_hours).map(([day, hours]) => (
                  <li key={day} className="flex justify-between border-b border-neutral-100 py-1.5">
                    <span className="font-semibold">{DAYS_FR[day] ?? day}</span>
                    <span>{hours}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="avis" className="mt-6 rounded-2xl bg-white p-6 shadow-card">
            <h2 id="avis" className="text-lg font-extrabold text-vayeko-green">
              Avis ({service.reviews_count})
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">Soyez le premier à donner votre avis.</p>
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
              <ReviewForm
                target="service"
                serviceId={service.id}
                isAuthenticated={Boolean(profile)}
              />
            </div>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <p className="text-sm text-neutral-500">{RATE_TYPE_LABELS[service.rate_type]}</p>
            <p className="mt-1 text-2xl font-extrabold text-vayeko-green">
              {service.price_cfa != null ? formatCfa(service.price_cfa) : 'Sur devis'}
            </p>
            <div className="mt-4 space-y-2.5">
              <WhatsAppButton phone={service.whatsapp} message={whatsappMessage} className="w-full" size="lg" />
              {service.phone && (
                <a
                  href={`tel:${service.phone.replace(/\s/g, '')}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-vayeko-green px-4 py-3 text-sm font-bold text-vayeko-green transition hover:bg-vayeko-green hover:text-white"
                >
                  <Icon name="phone" className="h-4 w-4" /> Appeler
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-neutral-500">Prestataire</h2>
            <p className="mt-2 flex items-center gap-2 font-bold text-vayeko-green">
              <Icon name="shop" className="h-4 w-4 text-vayeko-yellow-dark" />
              {service.business_name ?? 'Prestataire Vayeko'}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Professionnel référencé sur Vayeko. Méfiez-vous des demandes de paiement à distance.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-card">
            <ReportDialog target="service" serviceId={service.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}
