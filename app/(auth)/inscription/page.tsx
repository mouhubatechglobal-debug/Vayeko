import type { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/AuthForms';

export const metadata: Metadata = {
  title: 'Créer un compte',
  description: 'Rejoignez Vayeko : trouvez des services, boutiques et produits locaux, gérez vos favoris.',
};

export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold text-vayeko-green">Créer un compte</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Un email et un mot de passe suffisent. Gratuit pour toujours.
      </p>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-card">
        <SignUpForm />
      </div>
      <p className="mt-4 text-center text-sm text-neutral-600">
        Déjà inscrit ?{' '}
        <Link href="/connexion" className="font-bold text-vayeko-green hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
