import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { HOME_SECTIONS } from '@/lib/constants';

const CARD_TINTS = [
  'from-emerald-700/80',
  'from-rose-600/80',
  'from-amber-600/80',
  'from-teal-700/80',
  'from-indigo-700/80',
  'from-purple-700/80',
];

/**
 * Grille « Découvre nos catégories » — cartes photo avec dégradés colorés,
 * fidèle à la maquette.
 */
export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {HOME_SECTIONS.map((s, i) => {
        const inner = (
          <>
            <div className="relative h-28 overflow-hidden sm:h-32">
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className={cn('object-cover transition duration-500', s.available && 'group-hover:scale-105')}
              />
              <div className={cn('absolute inset-0 bg-gradient-to-t via-transparent to-transparent', CARD_TINTS[i % CARD_TINTS.length])} />
              {!s.available && (
                <span className="absolute right-2 top-2 rounded-full bg-vayeko-yellow px-2 py-0.5 text-[10px] font-extrabold text-vayeko-green-dark shadow">
                  Bientôt
                </span>
              )}
              <h3 className="absolute bottom-2 left-3 text-lg font-extrabold text-white drop-shadow">
                {s.label}
              </h3>
            </div>
            <p className="truncate bg-white px-3 py-2 text-xs font-medium text-neutral-600">{s.description}</p>
          </>
        );
        const cls = cn(
          'group overflow-hidden rounded-2xl shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-yellow',
          s.available ? 'hover:-translate-y-0.5 hover:shadow-lift' : 'cursor-not-allowed opacity-90',
        );
        return s.available && s.href ? (
          <Link key={s.key} href={s.href} className={cls} aria-label={`Explorer ${s.label}`}>
            {inner}
          </Link>
        ) : (
          <div key={s.key} className={cls} aria-disabled="true">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
