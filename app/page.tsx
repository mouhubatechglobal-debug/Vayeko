import Link from 'next/link';
import Image from 'next/image';
import { listCities, listProducts } from '@/lib/data';
import { SearchBar } from '@/components/search/SearchBar';
import { QuickAccess } from '@/components/home/QuickAccess';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeatureRow } from '@/components/home/FeatureRow';
import { CtaBanner } from '@/components/home/CtaBanner';
import { ProductCard } from '@/components/boutiques/ProductCard';
import { Badge } from '@/components/ui/Badge';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

/**
 * Page d'accueil — fidèle à la maquette « Style Vibrant Vayeko / Local » :
 * hero photo Lomé, barre de recherche, accès rapide, catégories,
 * arguments, produits populaires, bannière d'engagement.
 */
export default async function HomePage() {
  const [cities, popular] = await Promise.all([
    listCities(),
    listProducts({ pageSize: 4 }),
  ]);

  return (
    <div>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="relative isolate overflow-hidden bg-vayeko-green-dark">
        <Image
          src="/images/hero.jpg"
          alt="Jeune femme togolaise consultant Vayeko sur son téléphone au coucher du soleil à Lomé"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Voile de lisibilité : clair en haut (texte), fondu vers le bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/20 via-transparent to-vayeko-green-dark" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-vayeko-green-dark drop-shadow-sm sm:text-6xl">
              {SITE_NAME}
            </h1>
            <p className="mt-1 text-2xl font-extrabold text-vayeko-green sm:text-3xl">
              {SITE_TAGLINE.replace('.', ' !')}
            </p>
            <p className="mt-3 max-w-md text-sm font-medium text-neutral-800/90 sm:text-base">
              Services, boutiques, prix, logements, annonces, emplois…
              <br />
              Tout ce qu'il vous faut, ici.
            </p>
            <div className="mt-5">
              <SearchBar cities={cities.map((c) => c.name)} />
            </div>
          </div>
          <span className="absolute right-4 top-4 sm:right-6 sm:top-6">
            <Badge tone="yellow" className="text-xs font-extrabold shadow-md sm:text-sm">
              100% Togolais
            </Badge>
          </span>
        </div>
      </section>

      {/* ---------------------- ACCÈS RAPIDE (pastilles) ---------------------- */}
      <section aria-label="Accès rapide" className="relative z-10 -mt-16 pb-2 pt-2">
        <QuickAccess />
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6">
        {/* --------------------------- CATÉGORIES --------------------------- */}
        <section aria-labelledby="categories-titre">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 id="categories-titre" className="text-xl font-extrabold text-vayeko-green sm:text-2xl">
              Découvre nos catégories
            </h2>
            <Link
              href="/services/categories"
              className="shrink-0 text-sm font-bold text-vayeko-green-light hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          <CategoryGrid />
        </section>

        {/* --------------------------- ARGUMENTS --------------------------- */}
        <section aria-label="Pourquoi Vayeko">
          <FeatureRow />
        </section>

        {/* ----------------------- PRODUITS POPULAIRES ----------------------- */}
        <section aria-labelledby="produits-titre">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 id="produits-titre" className="text-xl font-extrabold text-vayeko-green sm:text-2xl">
              Produits populaires
            </h2>
            <Link
              href="/produits"
              className="shrink-0 text-sm font-bold text-vayeko-green-light hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          {popular.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {popular.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-6 text-sm text-neutral-500 shadow-card">
              Les premiers produits arrivent très vite. Vous êtes commerçant ?{' '}
              <Link href="/inscription" className="font-bold text-vayeko-green underline">
                Créez votre boutique
              </Link>
              .
            </p>
          )}
        </section>

        {/* ------------------------------ CTA ------------------------------ */}
        <CtaBanner />
      </div>
    </div>
  );
}
