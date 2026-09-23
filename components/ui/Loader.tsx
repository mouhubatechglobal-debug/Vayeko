import { cn } from '@/lib/utils';

/** Spinner de chargement accessible. */
export function Loader({ label = 'Chargement…', className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn('flex items-center justify-center gap-3 py-8', className)}>
      <span
        aria-hidden
        className="h-6 w-6 animate-spin rounded-full border-[3px] border-vayeko-green border-t-transparent"
      />
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}
