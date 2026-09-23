import type { City, ProductCategory, ServiceCategory } from '@/types/database';
import type { ProductCardItem } from '@/types/product';
import type { ServiceCardItem, ServiceDetail } from '@/types/service';
import type { BusinessCardItem } from '@/types/business';

/**
 * Données de DÉMONSTRATION utilisées quand Supabase n'est pas configuré
 * (développement sans backend, prévisualisation du design).
 *
 * ⚠️ 100 % fictives : noms, numéros (format local factice 90 00 00 xx) et
 * informations ne correspondent à aucune personne réelle.
 */

const now = new Date().toISOString();

export const DEMO_CITIES: City[] = [
  { id: 'c0000001-0000-4000-8000-000000000001', name: 'Lomé', region: 'Maritime', latitude: 6.13, longitude: 1.22, created_at: now },
  { id: 'c0000002-0000-4000-8000-000000000002', name: 'Tsévié', region: 'Maritime', latitude: 6.43, longitude: 1.21, created_at: now },
  { id: 'c0000003-0000-4000-8000-000000000003', name: 'Kpalimé', region: 'Plateaux', latitude: 6.9, longitude: 0.63, created_at: now },
  { id: 'c0000004-0000-4000-8000-000000000004', name: 'Atakpamé', region: 'Plateaux', latitude: 7.53, longitude: 1.13, created_at: now },
  { id: 'c0000005-0000-4000-8000-000000000005', name: 'Sokodé', region: 'Centrale', latitude: 8.98, longitude: 1.13, created_at: now },
  { id: 'c0000006-0000-4000-8000-000000000006', name: 'Kara', region: 'Kara', latitude: 9.55, longitude: 1.19, created_at: now },
  { id: 'c0000007-0000-4000-8000-000000000007', name: 'Dapaong', region: 'Savanes', latitude: 10.86, longitude: 0.21, created_at: now },
];

export const DEMO_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'a0000001-0000-4000-8000-000000000001', name: 'Mécanique & Auto', slug: 'mecanique-auto', icon: 'wrench', created_at: now },
  { id: 'a0000002-0000-4000-8000-000000000002', name: 'Coiffure & Beauté', slug: 'coiffure-beaute', icon: 'scissors', created_at: now },
  { id: 'a0000003-0000-4000-8000-000000000003', name: 'Maison & Bricolage', slug: 'maison-bricolage', icon: 'home', created_at: now },
  { id: 'a0000004-0000-4000-8000-000000000004', name: 'Couture & Mode', slug: 'couture-mode', icon: 'needle', created_at: now },
  { id: 'a0000005-0000-4000-8000-000000000005', name: 'Informatique & Numérique', slug: 'informatique-numerique', icon: 'computer', created_at: now },
  { id: 'a0000006-0000-4000-8000-000000000006', name: 'Transport & Logistique', slug: 'transport-logistique', icon: 'truck', created_at: now },
];

export const DEMO_PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'b0000001-0000-4000-8000-000000000001', parent_id: null, name: 'Alimentation', slug: 'alimentation', created_at: now },
  { id: 'b0000002-0000-4000-8000-000000000002', parent_id: null, name: 'Mode & Pagne', slug: 'mode-pagne', created_at: now },
  { id: 'b0000003-0000-4000-8000-000000000003', parent_id: null, name: 'Fruits & Légumes', slug: 'fruits-legumes', created_at: now },
  { id: 'b0000004-0000-4000-8000-000000000004', parent_id: null, name: 'Cosmétique & Bien-être', slug: 'cosmetique-bien-etre', created_at: now },
  { id: 'b0000005-0000-4000-8000-000000000005', parent_id: null, name: 'Artisanat', slug: 'artisanat', created_at: now },
];

export const DEMO_SERVICES: ServiceDetail[] = [
  {
    id: 'a1000001-0000-4000-8000-000000000001',
    slug: 'mecanique-nayo-lome',
    name: 'Mécanique Nayo',
    description:
      'Garage moto et auto toutes marques. Diagnostic rapide, révision, freinage et pneus. Accueil chaleureux et devis gratuit avant toute intervention.',
    price_cfa: 5000,
    rate_type: 'from',
    category_name: 'Mécanique & Auto',
    city_name: 'Lomé',
    business_name: 'Garage Nayo SARL',
    whatsapp: '+228 90 00 00 11',
    phone: '+228 90 00 00 11',
    opening_hours: { mon: '08:00 – 18:00', tue: '08:00 – 18:00', sat: '09:00 – 14:00' },
    average_rating: 4.7,
    reviews_count: 23,
  },
  {
    id: 'a1000002-0000-4000-8000-000000000002',
    slug: 'salon-belle-ebene',
    name: 'Salon Belle Ébène',
    description:
      'Coiffure femme et homme, tresses, tissage, soins capillaires et manucure. Sur rendez-vous ou sans rendez-vous selon disponibilité.',
    price_cfa: 3000,
    rate_type: 'from',
    category_name: 'Coiffure & Beauté',
    city_name: 'Lomé',
    business_name: 'Belle Ébène',
    whatsapp: '+228 90 00 00 12',
    phone: '+228 90 00 00 12',
    opening_hours: { mon: '09:00 – 19:00', wed: '09:00 – 19:00', sun: '10:00 – 16:00' },
    average_rating: 4.8,
    reviews_count: 41,
  },
  {
    id: 'a1000003-0000-4000-8000-000000000003',
    slug: 'electricite-pro-kodjo',
    name: 'Électricité Pro Kodjo',
    description:
      'Installation et dépannage électrique pour maisons et commerces. Mise aux normes, tableaux, interrupteurs, éclairage extérieur.',
    price_cfa: null,
    rate_type: 'quote',
    category_name: 'Maison & Bricolage',
    city_name: 'Tsévié',
    business_name: 'Kodjo Services',
    whatsapp: '+228 90 00 00 13',
    phone: null,
    opening_hours: { mon: '07:30 – 17:30', fri: '07:30 – 17:30' },
    average_rating: 4.5,
    reviews_count: 9,
  },
  {
    id: 'a1000004-0000-4000-8000-000000000004',
    slug: 'couture-fatou-styles',
    name: 'Couture Fatou Styles',
    description:
      'Confection sur mesure : robes, ensembles wax, retouches et broderie. Vous apportez votre pagne, nous créons votre style.',
    price_cfa: 4000,
    rate_type: 'from',
    category_name: 'Couture & Mode',
    city_name: 'Kpalimé',
    business_name: 'Fatou Styles',
    whatsapp: '+228 90 00 00 14',
    phone: '+228 90 00 00 14',
    opening_hours: { tue: '08:00 – 18:00', sat: '08:00 – 13:00' },
    average_rating: 4.9,
    reviews_count: 18,
  },
  {
    id: 'a1000005-0000-4000-8000-000000000005',
    slug: 'reparation-telephones-techlome',
    name: 'Réparation téléphones TechLomé',
    description:
      'Écrans, batteries, déblocage et logiciels pour smartphones. Pièces d’origine sur demande. Diagnostic gratuit en boutique.',
    price_cfa: 2500,
    rate_type: 'from',
    category_name: 'Informatique & Numérique',
    city_name: 'Lomé',
    business_name: 'TechLomé',
    whatsapp: '+228 90 00 00 15',
    phone: null,
    opening_hours: { mon: '09:00 – 18:00', thu: '09:00 – 18:00' },
    average_rating: 4.4,
    reviews_count: 30,
  },
  {
    id: 'a1000006-0000-4000-8000-000000000006',
    slug: 'transport-express-koffi',
    name: 'Transport Express Koffi',
    description:
      'Courses et déménagements légers dans Lomé et sa banlieue, 7j/7. Moto et tricycle selon le volume. Tarifs clairs, confirmés avant départ.',
    price_cfa: 1500,
    rate_type: 'from',
    category_name: 'Transport & Logistique',
    city_name: 'Lomé',
    business_name: 'Express Koffi',
    whatsapp: '+228 90 00 00 16',
    phone: '+228 90 00 00 16',
    opening_hours: { mon: '06:00 – 22:00', sun: '08:00 – 20:00' },
    average_rating: 4.3,
    reviews_count: 12,
  },
];

export const DEMO_BOUTIQUES: BusinessCardItem[] = [
  {
    id: 'b1000001-0000-4000-8000-000000000001',
    slug: 'boutique-aicha-wax-tissus',
    name: 'Aïcha Wax & Tissus',
    type: 'shop',
    description: 'Pagnes wax authentiques, bazins et accessoires de couture, au cœur du grand marché.',
    logo_url: null,
    city_name: 'Lomé',
    whatsapp: '+228 90 00 00 21',
    products_count: 24,
    services_count: 0,
    average_rating: 4.8,
    reviews_count: 54,
  },
  {
    id: 'b1000002-0000-4000-8000-000000000002',
    slug: 'marche-bio-ameyo',
    name: 'Marché Bio Améyo',
    type: 'shop',
    description: 'Fruits, légumes et produits locaux saisonniers issus de petits producteurs togolais.',
    logo_url: null,
    city_name: 'Lomé',
    whatsapp: '+228 90 00 00 22',
    products_count: 18,
    services_count: 0,
    average_rating: 4.6,
    reviews_count: 87,
  },
  {
    id: 'b1000003-0000-4000-8000-000000000003',
    slug: 'electro-lome',
    name: 'Électro Lomé',
    type: 'shop',
    description: 'Électroménager, téléphones et accessoires certifiés, avec garantie boutique.',
    logo_url: null,
    city_name: 'Lomé',
    whatsapp: '+228 90 00 00 23',
    products_count: 41,
    services_count: 0,
    average_rating: 4.2,
    reviews_count: 19,
  },
  {
    id: 'b1000004-0000-4000-8000-000000000004',
    slug: 'librairie-le-savoir',
    name: 'Librairie Le Savoir',
    type: 'shop',
    description: 'Livres scolaires, romans africains et fournitures de bureau pour étudiants et familles.',
    logo_url: null,
    city_name: 'Sokodé',
    whatsapp: '+228 90 00 00 24',
    products_count: 12,
    services_count: 0,
    average_rating: 4.7,
    reviews_count: 26,
  },
  {
    id: 'b1000005-0000-4000-8000-000000000005',
    slug: 'superette-be-kpota',
    name: 'Supérette Bè-Kpota',
    type: 'shop',
    description: 'Produits de première nécessité, recharge téléphone et épicerie fine de quartier.',
    logo_url: null,
    city_name: 'Lomé',
    whatsapp: '+228 90 00 00 25',
    products_count: 33,
    services_count: 0,
    average_rating: 4.1,
    reviews_count: 14,
  },
  {
    id: 'b1000006-0000-4000-8000-000000000006',
    slug: 'cosmetiques-mawuli',
    name: 'Cosmétiques Mawuli',
    type: 'shop',
    description: 'Savons au karité, huiles naturelles et soins corporels fabriqués au Togo.',
    logo_url: null,
    city_name: 'Kara',
    whatsapp: '+228 90 00 00 26',
    products_count: 15,
    services_count: 0,
    average_rating: 4.5,
    reviews_count: 31,
  },
];

export const DEMO_PRODUCTS: ProductCardItem[] = [
  {
    id: 'd1000001-0000-4000-8000-000000000001',
    slug: 'arachide-bio-1kg',
    name: 'Arachide',
    price_cfa: 1500,
    image_url: '/images/produits/arachide.jpg',
    available: true,
    average_rating: 4.8,
    reviews_count: 32,
  },
  {
    id: 'd1000002-0000-4000-8000-000000000002',
    slug: 'pagne-wax-6-metres',
    name: 'Pagne wax',
    price_cfa: 10000,
    image_url: '/images/produits/pagne-wax.jpg',
    available: true,
    average_rating: 4.9,
    reviews_count: 54,
  },
  {
    id: 'd1000003-0000-4000-8000-000000000003',
    slug: 'tomate-fraiche-1kg',
    name: 'Tomate',
    price_cfa: 800,
    image_url: '/images/produits/tomate.jpg',
    available: true,
    average_rating: 4.6,
    reviews_count: 87,
  },
  {
    id: 'd1000004-0000-4000-8000-000000000004',
    slug: 'panier-legumes-frais',
    name: 'Panier de légumes',
    price_cfa: 2500,
    image_url: '/images/categories/prix.jpg',
    available: true,
    average_rating: 4.5,
    reviews_count: 21,
  },
  {
    id: 'd1000005-0000-4000-8000-000000000005',
    slug: 'savon-karite-mawuli',
    name: 'Savon karité (x3)',
    price_cfa: 2000,
    image_url: null,
    available: true,
    average_rating: 4.7,
    reviews_count: 44,
  },
  {
    id: 'd1000006-0000-4000-8000-000000000006',
    slug: 'miel-pur-sokode-500ml',
    name: 'Miel pur de Sokodé 500 ml',
    price_cfa: 3500,
    image_url: null,
    available: true,
    average_rating: 4.9,
    reviews_count: 38,
  },
  {
    id: 'd1000007-0000-4000-8000-000000000007',
    slug: 'sandales-artisanales-cuir',
    name: 'Sandales artisanales cuir',
    price_cfa: 6000,
    image_url: null,
    available: false,
    average_rating: 4.3,
    reviews_count: 11,
  },
  {
    id: 'd1000008-0000-4000-8000-000000000008',
    slug: 't-shirt-wax-homme',
    name: 'T-shirt wax homme',
    price_cfa: 4500,
    image_url: null,
    available: true,
    average_rating: 4.4,
    reviews_count: 17,
  },
];

// ---------------------------------------------------------------------------
// Helpers de requête sur les données démo (filtrage local)
// ---------------------------------------------------------------------------

export function filterDemoServices(
  items: ServiceCardItem[],
  filters: { q?: string; ville?: string; categorie?: string },
): ServiceCardItem[] {
  const q = (filters.q ?? '').trim().toLowerCase();
  return items.filter((s) => {
    if (q && !`${s.name} ${s.description} ${s.business_name ?? ''}`.toLowerCase().includes(q)) {
      return false;
    }
    if (filters.ville && s.city_name !== filters.ville) return false;
    if (filters.categorie && s.category_name !== filters.categorie) return false;
    return true;
  });
}

export function filterDemoProducts(items: ProductCardItem[], q?: string): ProductCardItem[] {
  const query = (q ?? '').trim().toLowerCase();
  if (!query) return items;
  return items.filter((p) => p.name.toLowerCase().includes(query));
}

export function filterDemoBoutiques(items: BusinessCardItem[], q?: string): BusinessCardItem[] {
  const query = (q ?? '').trim().toLowerCase();
  if (!query) return items;
  return items.filter((b) => `${b.name} ${b.description ?? ''}`.toLowerCase().includes(query));
}
