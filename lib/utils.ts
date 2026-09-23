/**
 * Utilitaires transverses Vayeko (sans dépendance réseau/navigateur).
 */

/** Concatène des classes CSS en ignorant les valeurs falsy. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Formatte un prix en francs CFA (XOF) pour l'affichage au Togo. */
export function formatCfa(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return 'Sur devis';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Transforme une chaîne en slug URL-safe (accents supprimés). */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Tronque un texte proprement pour les cartes. */
export function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max).replace(/\s+\S*$/, '');
  return `${cut}…`;
}

/** Clamp un entier dans un intervalle (pagination, etc.). */
export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/** Date lisible en français (sans dépendance). */
export function formatDateFr(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Génère un identifiant de requête pour corréler les logs sans exposer l'utilisateur. */
export function requestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
