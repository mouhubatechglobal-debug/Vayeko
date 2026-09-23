import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/AuthForms';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte Vayeko.',
};

export default function ConnexionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold text-vayeko-green">Connexion</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Bon retour ! Accédez à vos favoris, avis et tableaux de bord.
      </p>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-card">
        <Suspense fallback={<p className="text-sm text-neutral-500">Chargement…</p>}>
          <SignInForm />
        </Suspense>
      </div>
      <p className="mt-4 text-center text-sm text-neutral-600">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="font-bold text-vayeko-green hover:underline">
          Créer un compte gratuit
        </Link>
      </p>
    </div>
  );
}
