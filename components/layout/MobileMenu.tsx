'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MAIN_NAV, SITE_NAME } from '@/lib/constants';
import { Icon } from '@/components/ui/Icon';

/** Menu mobile plein écran (hamburger) — style vibrant Vayeko. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Referme le menu à chaque navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-white hover:bg-white/10"
      >
        <Icon name={open ? 'x' : 'menu'} className="h-6 w-6" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[70] flex flex-col bg-gradient-to-b from-vayeko-green via-vayeko-green to-vayeko-green-dark p-6"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logos/vayeko-mark.png" alt={SITE_NAME} width={36} height={36} />
              <span className="text-xl font-extrabold text-white">{SITE_NAME}</span>
            </Link>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-white hover:bg-white/10"
            >
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>

          <nav aria-label="Navigation mobile" className="mt-10 flex flex-col gap-2">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-lg font-bold text-white hover:bg-white/10"
              >
                {item.label}
                <Icon name="chevron-right" className="h-5 w-5 text-vayeko-yellow" />
              </Link>
            ))}
            <Link
              href="/recherche"
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-lg font-bold text-white hover:bg-white/10"
            >
              Rechercher
              <Icon name="search" className="h-5 w-5 text-vayeko-yellow" />
            </Link>
          </nav>

          <div className="mt-auto pt-8">
            <Link
              href="/connexion"
              className="block rounded-xl bg-vayeko-yellow px-4 py-3.5 text-center text-base font-extrabold text-vayeko-green-dark shadow"
            >
              Se connecter / Créer un compte
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
