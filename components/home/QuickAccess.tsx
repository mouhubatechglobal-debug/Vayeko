import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';
import { QUICK_ACCESS } from '@/lib/constants';

const SECTION_ICONS: Record<string, IconName> = {
  services: 'wrench',
  boutiques: 'tag',
  produits: 'home',
  immobilier: 'home',
  emploi: 'briefcase',
  campus: 'graduation',
};

// Correspondances d'icônes exactes de la maquette
SECTION_ICONS.boutiques = 'shop';
SECTION_ICONS.produits = 'tag';
SECTION_ICONS.immobilier = 'home';

/**
 * Rangée d'accès rapide sous le hero (pastilles jaunes de la maquette).
 * Les sections V2 sont visibles mais marquées « Bientôt ».
 */
export function QuickAccess() {
  return (
    <div
      role="navigation"
      aria-label="Accès rapide aux sections"
      className="mx-auto grid max-w-3xl grid-cols-3 gap-y-5 px-2 sm:grid-cols-6"
    >
      {QUICK_ACCESS.map((s) => {
        const content = (
          <>
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-vayeko-yellow text-vayeko-green-dark shadow-md transition group-hover:scale-105 group-hover:shadow-lg sm:h-16 sm:w-16">
              <Icon name={SECTION_ICONS[s.key] ?? 'home'} className="h-6 w-6" />
              {!s.available && (
                <span className="absolute -right-2 -top-2 rotate-6 rounded-full bg-vayeko-red px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                  Bientôt
                </span>
              )}
            </span>
            <span className="mt-2 text-xs font-bold text-white drop-shadow sm:text-sm">{s.label}</span>
          </>
        );
        const cls = 'group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-yellow focus-visible:ring-offset-2 rounded-xl py-1';
        return s.available && s.href ? (
          <Link key={s.key} href={s.href} className={cls}>
            {content}
          </Link>
        ) : (
          <span key={s.key} className={`${cls} cursor-not-allowed opacity-90`} aria-disabled="true">
            {content}
          </span>
        );
      })}
    </div>
  );
}
