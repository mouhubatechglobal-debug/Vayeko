'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';

const ITEMS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/admin', label: 'Vue d’ensemble', icon: 'dashboard' },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: 'users' },
  { href: '/admin/commerces', label: 'Commerces', icon: 'shop' },
  { href: '/admin/signalements', label: 'Signalements', icon: 'flag' },
  { href: '/admin/moderation', label: 'Modération', icon: 'shield' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration" className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:pb-0">
      {ITEMS.map((item) => {
        const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold transition',
              active
                ? 'bg-vayeko-red text-white shadow'
                : 'bg-white text-vayeko-green shadow-card hover:bg-vayeko-red/5',
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
