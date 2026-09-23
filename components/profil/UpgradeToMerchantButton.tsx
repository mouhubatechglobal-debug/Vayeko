'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface UpgradeButtonProps {
  currentRole: 'user' | 'merchant' | 'provider' | 'admin';
}

export function UpgradeToMerchantButton({ currentRole }: UpgradeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Si l'utilisateur est déjà pro ou admin, pas besoin de ce bouton
  if (currentRole !== 'user') return null;

  async function handleUpgrade() {
    if (!confirm('Voulez-vous activer votre espace Commerçant / Pro ? C’est gratuit et immédiat.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/utilisateurs/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'merchant' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors du passage en compte pro.');
      }

      setSuccess('Compte passé en Commerçant avec succès ! Redirection en cours...');
      setTimeout(() => {
        router.push('/dashboard/boutique');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Impossible de mettre à jour votre profil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border-2 border-vayeko-yellow/40 bg-gradient-to-r from-vayeko-yellow/15 to-emerald-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <h3 className="text-base font-extrabold text-vayeko-green">
              Vous avez un commerce ou une activité ?
            </h3>
          </div>
          <p className="text-xs text-neutral-600">
            Activez gratuitement votre espace pro pour publier votre boutique, vos produits et recevoir des commandes via WhatsApp.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleUpgrade}
          loading={loading}
          className="shrink-0 font-extrabold"
          size="md"
        >
          Devenir commerçant ✨
        </Button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-2 text-xs font-semibold text-vayeko-red">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-3 rounded-lg bg-emerald-50 p-2 text-xs font-semibold text-emerald-800">
          {success}
        </p>
      )}
    </div>
  );
}
