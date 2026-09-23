import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';
import { canAccessAdmin } from '@/lib/permissions';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata = { title: 'Administration' };

/**
 * Zone d'administration — CONTRÔLE DE RÔLE CÔTÉ SERVEUR.
 * Un utilisateur ordinaire ne peut pas y accéder en modifiant l'URL :
 * le middleware exige déjà une session, et ce layout exige le rôle admin.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/connexion?redirectedFrom=/admin');
  if (!canAccessAdmin(profile.role)) {
    redirect('/');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-vayeko-green sm:text-3xl">Administration</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Modération et gestion de la plateforme — chaque action sensible est journalisée.
          </p>
        </div>
        <span className="rounded-full bg-vayeko-red/10 px-3 py-1 text-xs font-bold text-vayeko-red">
          Zone réservée
        </span>
      </header>
      <div className="grid gap-8 md:grid-cols-[230px_1fr]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
