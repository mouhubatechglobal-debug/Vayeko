'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** Liens de navigation principale (client : état actif via usePathname). */
export function Navbar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation principale" className="flex items-center gap-1">
      {MAIN_NAV.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
              active
                ? 'text-vayeko-yellow'
                : 'text-white/85 hover:bg-white/10 hover:text-white',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
