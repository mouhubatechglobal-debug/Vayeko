/**
 * Constantes d'interface Vayeko (navigation, libellés métier).
 */

export const SITE_NAME = 'Vayeko';
export const SITE_TAGLINE = 'Le Togo à portée de main.';
export const SITE_DESCRIPTION =
  'Vayeko connecte les Togolais aux services, boutiques et produits locaux. Trouvez un artisan, une boutique ou un produit près de chez vous, et contactez-le directement sur WhatsApp.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export interface NavItem {
  href: string;
  label: string;
}

/** Navigation principale (V1). Prix, Immobilier, Emploi et Campus arrivent en V2. */
export const MAIN_NAV: NavItem[] = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/boutiques', label: 'Boutiques' },
  { href: '/produits', label: 'Produits' },
];

/** Sections annoncées sur l'accueil (V2 = bientôt disponible). */
export interface HomeSection {
  key: string;
  label: string;
  description: string;
  href: string | null;
  image: string;
  available: boolean;
}

export const HOME_SECTIONS: HomeSection[] = [
  {
    key: 'services',
    label: 'Services',
    description: 'Artisans, prestataires…',
    href: '/services',
    image: '/images/categories/services.jpg',
    available: true,
  },
  {
    key: 'boutiques',
    label: 'Boutiques',
    description: 'Magasins, e-commerce…',
    href: '/boutiques',
    image: '/images/categories/boutiques.jpg',
    available: true,
  },
  {
    key: 'produits',
    label: 'Prix',
    description: 'Comparez les prix…',
    href: '/produits',
    image: '/images/categories/prix.jpg',
    available: true,
  },
  {
    key: 'immobilier',
    label: 'Immobilier',
    description: 'Maisons, appartements…',
    href: null,
    image: '/images/categories/immobilier.jpg',
    available: false,
  },
  {
    key: 'emploi',
    label: 'Emploi',
    description: "Offres d'emploi…",
    href: null,
    image: '/images/categories/emploi.jpg',
    available: false,
  },
  {
    key: 'campus',
    label: 'Campus',
    description: 'Étudiants, formations…',
    href: null,
    image: '/images/categories/campus.jpg',
    available: false,
  },
];

/** Accès rapide sous le hero (pastilles). */
export const QUICK_ACCESS: Array<Pick<HomeSection, 'key' | 'label' | 'href' | 'available'>> =
  HOME_SECTIONS.map(({ key, label, href, available }) => ({ key, label, href, available }));

export const RATE_TYPE_LABELS: Record<string, string> = {
  fixed: 'Prix fixe',
  from: 'À partir de',
  quote: 'Sur devis',
  hourly: 'À l\u2019heure',
};

export const DAYS_FR: Record<string, string> = {
  mon: 'Lundi',
  tue: 'Mardi',
  wed: 'Mercredi',
  thu: 'Jeudi',
  fri: 'Vendredi',
  sat: 'Samedi',
  sun: 'Dimanche',
};
