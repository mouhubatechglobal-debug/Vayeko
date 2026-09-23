import { z } from 'zod';

/**
 * Schémas de validation Zod — utilisés à la fois côté client (formulaires)
 * et côté serveur (route handlers / server actions). Ne jamais faire
 * confiance aux données entrantes sans passer par l'un de ces schémas.
 */

// ---------------------------------------------------------------------------
// Champs de base réutilisables
// ---------------------------------------------------------------------------
export const uuidSchema = z.string().uuid("Identifiant invalide.");

export const phoneSchema = z
  .string()
  .min(8, 'Le numéro est trop court.')
  .max(20, 'Le numéro est trop long.')
  .regex(/^[+\d][\d\s\-().]*$/, 'Format de numéro invalide.');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

// ---------------------------------------------------------------------------
// Authentification & profil
// ---------------------------------------------------------------------------
export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'Nom trop court.').max(80, 'Nom trop long.'),
  email: z.string().trim().toLowerCase().email('Adresse e-mail invalide.'),
  password: z
    .string()
    .min(8, '8 caractères minimum.')
    .max(72, 'Mot de passe trop long.')
    .regex(/[A-Za-z]/, 'Ajoutez au moins une lettre.')
    .regex(/\d/, 'Ajoutez au moins un chiffre.'),
  accountType: z.enum(['user', 'merchant', 'provider']).default('user'),
});

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email('Adresse e-mail invalide.'),
  password: z.string().min(1, 'Mot de passe requis.').max(72),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Adresse e-mail invalide.'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(80).optional(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.-]{3,30}$/, '3 à 30 caractères : lettres, chiffres, tirets, points.')
    .optional(),
  phone: phoneSchema.nullable().optional(),
  whatsapp: phoneSchema.nullable().optional(),
  avatarUrl: z.string().url().max(500).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Recherche & paramètres d'URL
// ---------------------------------------------------------------------------
export const searchQuerySchema = z.object({
  q: z.string().trim().max(80).optional().default(''),
  ville: z.string().trim().max(80).optional().default(''),
  categorie: z.string().trim().max(80).optional().default(''),
});

export const servicesQuerySchema = searchQuerySchema.extend({
  slug: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

// ---------------------------------------------------------------------------
// Contenu métier (création / édition)
// ---------------------------------------------------------------------------
export const productInputSchema = z.object({
  name: z.string().trim().min(3, 'Nom trop court.').max(100, 'Nom trop long.'),
  description: z.string().trim().max(2000).nullable().optional(),
  category_id: uuidSchema.nullable().optional(),
  shop_id: uuidSchema,
  price_cfa: z.number().int().min(0, 'Prix invalide.').max(100_000_000),
  compare_at_price_cfa: z.number().int().min(0).max(100_000_000).nullable().optional(),
  available: z.boolean().default(true),
  stock: z.number().int().min(0).max(1_000_000).nullable().optional(),
  image_urls: z.array(z.string().url().max(500)).max(5, '5 images maximum.').optional(),
});

export const serviceInputSchema = z.object({
  name: z.string().trim().min(3, 'Nom trop court.').max(120, 'Nom trop long.'),
  description: z.string().trim().min(10, 'Décrivez le service (10 caractères min).').max(3000),
  business_id: uuidSchema,
  category_id: uuidSchema.nullable().optional(),
  price_cfa: z.number().int().min(0).max(100_000_000).nullable().optional(),
  rate_type: z.enum(['fixed', 'from', 'quote', 'hourly']).default('quote'),
  phone: phoneSchema.nullable().optional(),
  whatsapp: phoneSchema.nullable().optional(),
  opening_hours: z.record(z.string(), z.string().max(40)).nullable().optional(),
});

export const boutiqueInputSchema = z.object({
  name: z.string().trim().min(3, 'Nom trop court.').max(100, 'Nom trop long.'),
  description: z.string().trim().max(2000).nullable().optional(),
  type: z.enum(['shop', 'service', 'both']).default('shop'),
  phone: phoneSchema.nullable().optional(),
  whatsapp: phoneSchema.nullable().optional(),
  city_id: uuidSchema,
  address_line: z.string().trim().max(200).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Avis, favoris, signalements
// ---------------------------------------------------------------------------
export const reviewInputSchema = z.object({
  target: z.enum(['business', 'product', 'service']),
  business_id: uuidSchema.nullable().optional(),
  product_id: uuidSchema.nullable().optional(),
  service_id: uuidSchema.nullable().optional(),
  rating: z.number().int().min(1, 'Note entre 1 et 5.').max(5, 'Note entre 1 et 5.'),
  comment: z.string().trim().min(5, 'Commentaire trop court.').max(1000),
});

export const reportInputSchema = z.object({
  target: z.enum(['user', 'business', 'product', 'service', 'review']),
  business_id: uuidSchema.nullable().optional(),
  product_id: uuidSchema.nullable().optional(),
  service_id: uuidSchema.nullable().optional(),
  review_id: uuidSchema.nullable().optional(),
  reported_profile_id: uuidSchema.nullable().optional(),
  reason: z.string().trim().min(4, 'Motif requis.').max(80),
  details: z.string().trim().max(1000).nullable().optional(),
});

export const reportResolutionSchema = z.object({
  report_id: uuidSchema,
  status: z.enum(['resolved', 'rejected']),
});

// ---------------------------------------------------------------------------
// Administration
// ---------------------------------------------------------------------------
export const adminBusinessStatusSchema = z.object({
  business_id: uuidSchema,
  status: z.enum(['pending', 'active', 'suspended', 'rejected']),
});

export const adminUserRoleSchema = z.object({
  profile_id: uuidSchema,
  role: z.enum(['user', 'merchant', 'provider', 'admin']),
});

export const moderateReviewSchema = z.object({
  review_id: uuidSchema,
  status: z.enum(['published', 'rejected']),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type ServiceInput = z.infer<typeof serviceInputSchema>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type ReportInput = z.infer<typeof reportInputSchema>;
