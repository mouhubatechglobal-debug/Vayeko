import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';
import { canAccessDashboard } from '@/lib/permissions';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Icon } from '@/components/ui/Icon';

export const metadata = { title: 'Tableau de bord' };

/** Zone privée : session requise + rôle marchand/prestataire/admin (vérifié côté serveur). */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/connexion?redirectedFrom=/dashboard');

  if (!canAccessDashboard(profile.role)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-vayeko-yellow/20 text-vayeko-yellow-dark">
          <Icon name="shield" className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-vayeko-green">Espace professionnel</h1>
        <p className="mt-2 text-neutral-600">
          Cet espace est réservé aux comptes <strong>commerçants</strong> et{' '}
          <strong>prestataires</strong>. Votre compte actuel est un compte utilisateur standard : la
          modification de l’URL ne donne pas accès à cette zone.
        </p>
        <p className="mt-4 rounded-xl bg-vayeko-green/5 p-4 text-sm text-neutral-600">
          Pour activer un compte professionnel, contactez-nous via la page{' '}
          <Link href="/contact" className="font-bold text-vayeko-green underline">
            Contact
          </Link>{' '}
          : un administrateur validera votre activité et basculera votre rôle.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-vayeko-yellow px-6 py-3 text-sm font-extrabold text-vayeko-green-dark shadow hover:brightness-105"
        >
          Retour à l’accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">Tableau de bord</h1>
      <div className="mt-6 grid gap-8 md:grid-cols-[230px_1fr]">
        <DashboardNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
