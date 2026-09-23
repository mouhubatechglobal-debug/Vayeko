import Link from 'next/link';
import Image from 'next/image';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants';
import { Icon } from '@/components/ui/Icon';

const NAVIGATION_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/boutiques', label: 'Boutiques' },
  { href: '/produits', label: 'Produits' },
  { href: '/recherche', label: 'Recherche' },
] as const;

const ABOUT_LINKS = [
  { href: '/a-propos', label: 'Notre mission' },
  { href: '/contact', label: 'Nous contacter' },
  { href: '/conditions', label: "Conditions d'utilisation" },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
] as const;

/** Pied de page — vert profond, bande tissée et liens structurés (maquette). */
export function Footer() {
  return (
    <footer className="mt-auto bg-vayeko-green-dark text-white">
      <div aria-hidden className="textile-strip h-2 w-full" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logos/vayeko-mark.png" alt="" width={38} height={38} className="h-9 w-9" />
            <span className="text-2xl font-extrabold tracking-tight">{SITE_NAME}</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{SITE_DESCRIPTION}</p>
          <div className="mt-4 space-y-3">
            <a
              href="https://whatsapp.com/channel/0029VbE9enqKAwEcfRySrW0T"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white shadow transition hover:brightness-105 active:scale-95"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              <span>Rejoindre notre Chaîne WhatsApp 📢</span>
            </a>
            <div className="flex gap-2">
              {(
                [
                  { name: 'facebook', label: 'Facebook' },
                  { name: 'instagram', label: 'Instagram' },
                  { name: 'x-social', label: 'X (Twitter)' },
                  { name: 'linkedin', label: 'LinkedIn' },
                ] as const
              ).map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-disabled="true"
                  aria-label={`${SITE_NAME} sur ${s.label} (bientôt)`}
                  className="rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-vayeko-yellow hover:text-vayeko-green-dark"
                >
                  <Icon name={s.name} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <nav aria-label="Liens de navigation" className="lg:justify-self-center">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-vayeko-yellow">Navigation</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAVIGATION_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/75 transition hover:text-vayeko-yellow">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="À propos" className="lg:justify-self-center">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-vayeko-yellow">À propos</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {ABOUT_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/75 transition hover:text-vayeko-yellow">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:justify-self-end">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-vayeko-yellow">Territoire</h2>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            <span aria-hidden>🇹🇬</span> Togo
          </p>
          <p className="mt-3 text-xs text-white/50">Prix, Immobilier, Emploi & Campus : bientôt.</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.
      </div>
    </footer>
  );
}
