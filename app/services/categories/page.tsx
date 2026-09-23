import type { Metadata } from 'next';
import Link from 'next/link';
import { listServiceCategories, listServices } from '@/lib/data';
import { Icon, type IconName } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catégories de services',
  description: 'Explorez toutes les catégories de services Vayeko au Togo.',
};

const ICONS: Record<string, IconName> = {
  wrench: 'wrench',
  scissors: 'briefcase',
  home: 'home',
  needle: 'tag',
  computer: 'zap',
  truck: 'box',
};

export default async function ServiceCategoriesPage() {
  const categories = await listServiceCategories();

  // Compte approximatif borné par catégorie
  const perCategory = await Promise.all(
    categories.map(async (c) => {
      const { total } = await listServices({ categorie: c.slug, pageSize: 1 });
      return { ...c, total };
    }),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">Catégories de services</h1>
      <p className="mt-1 text-sm text-neutral-600">Trouvez le bon professionnel par domaine.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {perCategory.map((c) => (
          <Link
            key={c.id}
            href={`/services?categorie=${encodeURIComponent(c.slug)}`}
            className="group rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-vayeko-yellow/20 text-vayeko-yellow-dark">
              <Icon name={ICONS[c.icon ?? 'wrench'] ?? 'wrench'} className="h-6 w-6" />
            </span>
            <h2 className="mt-3 font-extrabold text-vayeko-green group-hover:underline">{c.name}</h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {c.total} service{c.total > 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
