import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'yellow' | 'green' | 'red' | 'neutral';

const TONES: Record<BadgeTone, string> = {
  yellow: 'bg-vayeko-yellow/90 text-vayeko-green-dark',
  green: 'bg-vayeko-green/10 text-vayeko-green',
  red: 'bg-vayeko-red/10 text-vayeko-red',
  neutral: 'bg-neutral-100 text-neutral-600',
};

export function Badge({
  tone = 'green',
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
