import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';

/**
 * Bannière d'engagement — « Ensemble pour un Togo digital et plus fort ! »
 * (vert profond + accent jaune, comme la maquette).
 */
export function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-titre"
      className="overflow-hidden rounded-3xl bg-gradient-to-r from-vayeko-green-dark via-vayeko-green to-emerald-800 text-white shadow-lift"
    >
      <div className="grid items-center gap-6 p-8 sm:grid-cols-[1.4fr_1fr] sm:p-10">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-vayeko-yellow">
            <Icon name="zap" className="h-3.5 w-3.5" /> Rejoignez la communauté
          </p>
          <h2 id="cta-titre" className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            Ensemble pour un Togo digital et plus fort&nbsp;!
          </h2>
          <p className="mt-2 max-w-lg text-sm text-white/80 sm:text-base">
            Rejoignez la communauté Vayeko et profitez des meilleures opportunités près de chez vous.
          </p>
          <Link
            href="/inscription"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-vayeko-yellow px-6 py-3 text-sm font-extrabold text-vayeko-green-dark shadow transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Commencer maintenant
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative hidden h-44 overflow-hidden rounded-2xl sm:block">
          <Image
            src="/images/hero.jpg"
            alt="Côte de Lomé au coucher du soleil"
            fill
            sizes="(max-width: 1024px) 40vw, 30vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-vayeko-green/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
