import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Carte de contenu Vayeko (coins arrondis généreux + ombre douce). */
export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn('rounded-2xl bg-white shadow-card transition-shadow', className)}
      {...props}
    >
      {children}
    </div>
  );
}
