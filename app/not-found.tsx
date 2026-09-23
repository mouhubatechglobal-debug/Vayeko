import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export const metadata = { title: 'Page introuvable' };

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-vayeko-yellow/20 text-vayeko-yellow-dark">
        <Icon name="search" className="h-10 w-10" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold text-vayeko-green">Page introuvable</h1>
      <p className="mt-2 text-neutral-600">
        La page demandée n’existe pas ou a été déplacée. Vérifiez l’adresse ou repartez de
        l’accueil.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-vayeko-yellow px-6 py-3 text-sm font-extrabold text-vayeko-green-dark shadow hover:brightness-105"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
