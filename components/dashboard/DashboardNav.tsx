'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';

const ITEMS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: 'dashboard' },
  { href: '/dashboard/boutique', label: 'Ma boutique', icon: 'shop' },
  { href: '/dashboard/produits', label: 'Mes produits', icon: 'tag' },
  { href: '/dashboard/services', label: 'Mes services', icon: 'wrench' },
];

/** Navigation latérale (desktop) / en onglets (mobile) du tableau de bord. */
export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Espace professionnel" className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:pb-0">
      {ITEMS.map((item) => {
        const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold transition',
              active
                ? 'bg-vayeko-green text-white shadow'
                : 'bg-white text-vayeko-green shadow-card hover:bg-vayeko-green/5',
            )}
          >
            <Icon name={item.icon} className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
