import { Icon, type IconName } from '@/components/ui/Icon';

/** État vide clair et rassurant (listes, recherche, erreurs soft). */
export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: IconName;
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/60 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-vayeko-green/5 text-vayeko-green">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <h2 className="mt-4 text-lg font-bold text-vayeko-green">{title}</h2>
      {message && <p className="mt-1 max-w-sm text-sm text-neutral-500">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
