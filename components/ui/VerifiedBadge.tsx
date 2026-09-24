
export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-100 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-900 shadow-sm ${className}`}
      title="Boutique certifiée et vérifiée par l'équipe Vayeko"
    >
      <span className="text-amber-500">🛡️</span>
      <span>Vérifié Vayeko</span>
    </span>
  );
}
