import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/AuthForms';

export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  description: 'Recevez un lien de réinitialisation de mot de passe Vayeko.',
};

export default function MotDePasseOubliePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold text-vayeko-green">Mot de passe oublié</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Indiquez votre e-mail : nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.
      </p>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-card">
        <ResetPasswordForm />
      </div>
      <p className="mt-4 text-center text-sm text-neutral-600">
        <Link href="/connexion" className="font-bold text-vayeko-green hover:underline">
          ← Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
