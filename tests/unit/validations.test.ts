import { describe, expect, it } from 'vitest';
import {
  productInputSchema,
  reportInputSchema,
  reviewInputSchema,
  serviceInputSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
  uuidSchema,
} from '@/lib/validations';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('uuidSchema', () => {
  it('accepte un UUID valide', () => {
    expect(uuidSchema.safeParse(UUID).success).toBe(true);
  });
  it('rejette autre chose', () => {
    expect(uuidSchema.safeParse('123').success).toBe(false);
    expect(uuidSchema.safeParse('../../../etc').success).toBe(false);
  });
});

describe('signUpSchema / signInSchema', () => {
  it('accepte une inscription valide', () => {
    const parsed = signUpSchema.safeParse({
      fullName: 'Aïcha Mensah',
      email: 'AICHA@example.com',
      password: 'motdepasse1',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe('aicha@example.com');
  });
  it('rejette les mots de passe faibles et les emails invalides', () => {
    expect(signUpSchema.safeParse({ fullName: 'Aïcha', email: 'a@b.c', password: 'abc' }).success).toBe(false);
    expect(signUpSchema.safeParse({ fullName: 'Aïcha', email: 'pas-un-email', password: 'abcdef12' }).success).toBe(false);
    expect(signUpSchema.safeParse({ fullName: 'Aïcha', email: 'a@example.com', password: 'abcdefgh' }).success).toBe(false); // sans chiffre
  });
  it('connexion tolère tout mot de passe non vide côté schéma', () => {
    expect(signInSchema.safeParse({ email: 'a@example.com', password: 'x' }).success).toBe(true);
    expect(signInSchema.safeParse({ email: 'a@example.com', password: '' }).success).toBe(false);
  });
});

describe('productInputSchema', () => {
  const base = { name: 'Pagne wax authentique', shop_id: UUID, price_cfa: 5000, available: true };
  it('accepte un produit valide', () => {
    expect(productInputSchema.safeParse(base).success).toBe(true);
  });
  it('rejette un prix négatif ou abusif', () => {
    expect(productInputSchema.safeParse({ ...base, price_cfa: -10 }).success).toBe(false);
    expect(productInputSchema.safeParse({ ...base, price_cfa: 1_000_000_000 }).success).toBe(false);
  });
  it('limite le nombre d’images à 5', () => {
    expect(
      productInputSchema.safeParse({
        ...base,
        image_urls: Array(6).fill('https://example.com/a.jpg'),
      }).success,
    ).toBe(false);
  });
});

describe('serviceInputSchema', () => {
  const base = {
    name: 'Réparation moto',
    description: 'Diagnostic et réparation de motos toutes marques, à domicile dans Lomé.',
    business_id: UUID,
    rate_type: 'quote' as const,
  };
  it('accepte un service valide', () => {
    expect(serviceInputSchema.safeParse(base).success).toBe(true);
  });
  it('exige une description suffisante et un type de tarif connu', () => {
    expect(serviceInputSchema.safeParse({ ...base, description: 'ok' }).success).toBe(false);
    expect(serviceInputSchema.safeParse({ ...base, rate_type: 'gratuit' }).success).toBe(false);
  });
});

describe('reviewInputSchema', () => {
  it('exige une note 1-5', () => {
    expect(
      reviewInputSchema.safeParse({ target: 'product', product_id: UUID, rating: 6, comment: 'Super produit' }).success,
    ).toBe(false);
    expect(
      reviewInputSchema.safeParse({ target: 'product', product_id: UUID, rating: 4, comment: 'Super produit' }).success,
    ).toBe(true);
  });
  it('rejette les commentaires trop courts', () => {
    expect(
      reviewInputSchema.safeParse({ target: 'service', service_id: UUID, rating: 4, comment: 'ok' }).success,
    ).toBe(false);
  });
});

describe('reportInputSchema', () => {
  it('accepte un signalement valide', () => {
    expect(
      reportInputSchema.safeParse({ target: 'product', product_id: UUID, reason: 'Prix incohérent' }).success,
    ).toBe(true);
  });
  it('exige un motif significatif', () => {
    expect(reportInputSchema.safeParse({ target: 'product', product_id: UUID, reason: 'a' }).success).toBe(false);
  });
});

describe('updateProfileSchema', () => {
  it('ne contient JAMAIS le champ role (aucune élévation possible via l’API)', () => {
    const parsed = updateProfileSchema.safeParse({ fullName: 'Aïcha', role: 'admin' });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect('role' in parsed.data).toBe(false);
    }
  });
});
