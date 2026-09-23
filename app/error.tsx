'use client';

import { useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log interne uniquement — rien de technique ne s'affiche pour l'utilisateur.
    console.error('[vayeko][error]', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-vayeko-red/10 text-vayeko-red">
        <Icon name="flag" className="h-10 w-10" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold text-vayeko-green">Une erreur est survenue</h1>
      <p className="mt-2 text-neutral-600">
        Désolé, quelque chose n’a pas fonctionné. Rechargez la page ou réessayez dans un instant.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-vayeko-yellow px-6 py-3 text-sm font-extrabold text-vayeko-green-dark shadow hover:brightness-105"
      >
        Réessayer
      </button>
    </div>
  );
}
