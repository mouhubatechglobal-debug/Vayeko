import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/constants';
import { Navbar } from '@/components/layout/Navbar';
import { UserMenu } from '@/components/layout/UserMenu';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Icon } from '@/components/ui/Icon';

/**
 * En-tête global — vert profond Vayeko, logo officiel fourni par le client.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-vayeko-green/95 shadow-lg backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${SITE_NAME} — Accueil`}>
          <Image
            src="/logos/vayeko-mark.png"
            alt=""
            width={34}
            height={34}
            className="h-8 w-8 object-contain drop-shadow"
            priority
          />
          <span className="text-xl font-extrabold tracking-tight text-white">{SITE_NAME}</span>
        </Link>

        <div className="mx-auto hidden md:block">
          <Navbar />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/recherche"
            aria-label="Rechercher"
            className="rounded-full p-2.5 text-white/85 transition hover:bg-white/10 hover:text-vayeko-yellow"
          >
            <Icon name="search" className="h-5 w-5" />
          </Link>
          <UserMenu />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
