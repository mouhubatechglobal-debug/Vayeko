import { Icon, type IconName } from '@/components/ui/Icon';

const FEATURES: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'map-pin', title: 'Local', text: "Soutenez l'économie locale" },
  { icon: 'shield', title: 'Fiable', text: 'Professionnels vérifiés' },
  { icon: 'zap', title: 'Rapide', text: 'Accès facile et rapide' },
  { icon: 'users', title: 'Pour tous', text: 'Particuliers et entreprises' },
];

/** Bandeau d'arguments (maquette : Local / Fiable / Rapide / Pour tous). */
export function FeatureRow() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="flex flex-col items-center rounded-2xl bg-white px-4 py-6 text-center shadow-card"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-vayeko-yellow/20 text-vayeko-yellow-dark">
            <Icon name={f.icon} className="h-6 w-6" />
          </span>
          <h3 className="mt-3 font-extrabold text-vayeko-green">{f.title}</h3>
          <p className="mt-1 text-xs text-neutral-500">{f.text}</p>
        </div>
      ))}
    </div>
  );
}
