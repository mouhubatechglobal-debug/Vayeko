'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleFavorite } from '@/app/actions';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  target: 'business' | 'product' | 'service';
  businessId?: string;
  productId?: string;
  serviceId?: string;
  initialActive?: boolean;
  isAuthenticated: boolean;
}

/** Cœur favoris — optimiste, sans rechargement. */
export function FavoriteButton({
  target,
  businessId,
  productId,
  serviceId,
  initialActive = false,
  isAuthenticated,
}: FavoriteButtonProps) {
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    if (!isAuthenticated) {
      router.push('/connexion');
      return;
    }
    const next = !active;
    setActive(next); // optimiste
    startTransition(async () => {
      const result = await toggleFavorite({
        target,
        business_id: businessId,
        product_id: productId,
        service_id: serviceId,
      });
      if (!result.ok) setActive(!next); // retour arrière en cas d'échec
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={cn(
        'rounded-full p-2 shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-yellow',
        active ? 'bg-vayeko-red text-white' : 'bg-white text-vayeko-red hover:bg-vayeko-red/10',
      )}
    >
      <Icon name="heart" className={cn('h-4 w-4', active && 'fill-current')} />
    </button>
  );
}
