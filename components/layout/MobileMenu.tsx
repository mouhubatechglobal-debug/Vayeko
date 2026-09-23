'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MAIN_NAV, SITE_NAME } from '@/lib/constants';
import { Icon } from '@/components/ui/Icon';

/** Menu mobile plein écran (hamburger) — 100% opaque, sobre et lisible. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Referme le menu à chaque navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
        className="rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none"
      >
        <Icon name={open ? 'x' : 'menu'} className="h-6 w-6 text-white" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex flex-col bg-[#072A21] p-6 text-white overflow-y-auto"
          style={{ backgroundColor: '#072A21' }}
        >
          {/* En-tête du menu mobile */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logos/vayeko-mark.png" alt={SITE_NAME} width={38} height={38} />
              <span className="text-xl font-extrabold tracking-wide text-white">{SITE_NAME}</span>
            </Link>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-white/10 p-2.5 text-white hover:bg-white/20 transition"
            >
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>

          {/* Liens de navigation */}
          <nav aria-label="Navigation mobile" className="mt-6 flex flex-col gap-2.5">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl bg-white/[0.08] px-4 py-3.5 text-base font-bold text-white hover:bg-white/15 transition border border-white/5"
              >
                <span>{item.label}</span>
                <Icon name="chevron-right" className="h-5 w-5 text-vayeko-yellow" />
              </Link>
            ))}
            <Link
              href="/recherche"
              className="flex items-center justify-between rounded-xl bg-white/[0.08] px-4 py-3.5 text-base font-bold text-white hover:bg-white/15 transition border border-white/5"
            >
              <span>Rechercher</span>
              <Icon name="search" className="h-5 w-5 text-vayeko-yellow" />
            </Link>
          </nav>

          {/* Bouton Connexion / Compte en bas */}
          <div className="mt-auto pt-8 pb-4">
            <Link
              href="/connexion"
              className="block w-full rounded-xl bg-vayeko-yellow px-4 py-3.5 text-center text-base font-extrabold text-[#072A21] shadow-lg transition hover:brightness-105 active:scale-95"
            >
              Mon compte / Se connecter
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
