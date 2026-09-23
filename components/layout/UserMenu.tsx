'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { canAccessAdmin, canAccessDashboard, ROLE_LABELS } from '@/lib/permissions';
import { Icon } from '@/components/ui/Icon';

/**
 * Menu compte utilisateur (icône à droite du header).
 * L'affichage dépend de la session — les règles finales restent côté serveur.
 */
export function UserMenu() {
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (loading) {
    return <span className="h-9 w-9 animate-pulse rounded-full bg-white/15" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        href="/connexion"
        aria-label="Connexion"
        className="inline-flex items-center gap-2 rounded-full bg-vayeko-yellow px-2.5 py-2 text-sm font-bold text-vayeko-green-dark shadow hover:brightness-105 sm:px-3.5"
      >
        <Icon name="user" className="h-4 w-4" />
        <span className="hidden sm:inline">Connexion</span>
      </Link>
    );
  }

  const displayName = profile?.full_name || 'Mon compte';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const items: Array<{ href?: string; label: string; icon: Parameters<typeof Icon>[0]['name']; onClick?: () => void }> = [
    { href: '/profil', label: 'Mon profil', icon: 'user' },
    ...(canAccessDashboard(profile?.role)
      ? [{ href: '/dashboard', label: 'Tableau de bord', icon: 'dashboard' as const }]
      : []),
    ...(canAccessAdmin(profile?.role)
      ? [{ href: '/admin', label: 'Administration', icon: 'shield' as const }]
      : []),
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Menu de ${displayName}`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-vayeko-yellow text-sm font-extrabold text-vayeko-green-dark shadow hover:brightness-105"
      >
        {initials || <Icon name="user" className="h-4 w-4" />}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl bg-white py-2 text-sm shadow-lift"
        >
          <div className="border-b border-neutral-100 px-4 py-2">
            <p className="truncate font-bold text-vayeko-green">{displayName}</p>
            <p className="text-xs text-neutral-500">{ROLE_LABELS[profile?.role ?? 'user']}</p>
          </div>
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href!}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 font-medium text-neutral-700 hover:bg-vayeko-green/5 hover:text-vayeko-green"
            >
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.refresh();
            }}
            className="flex w-full items-center gap-3 border-t border-neutral-100 px-4 py-2.5 font-medium text-vayeko-red hover:bg-vayeko-red/5"
          >
            <Icon name="logout" className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
