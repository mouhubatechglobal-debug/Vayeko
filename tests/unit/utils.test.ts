import { describe, expect, it } from 'vitest';
import { clampInt, cn, formatCfa, slugify, truncate } from '@/lib/utils';

describe('slugify', () => {
  it('produit un slug URL-safe', () => {
    expect(slugify('Aïcha Wax & Tissus !')).toBe('aicha-wax-tissus');
    expect(slugify('Électricité Pro (Lomé)')).toBe('electricite-pro-lome');
    expect(slugify('  espaces    multiples  ')).toBe('espaces-multiples');
  });
  it('plafonne la longueur', () => {
    expect(slugify('a'.repeat(100)).length).toBeLessThanOrEqual(80);
  });
});

describe('formatCfa', () => {
  it('formate les montants en francs CFA', () => {
    const out = formatCfa(25000);
    expect(out.replace(/[^0-9]/g, '')).toBe('25000');
    expect(out.toLowerCase()).toMatch(/cfa/);
  });
  it('gère les valeurs nulles', () => {
    expect(formatCfa(null)).toBe('Sur devis');
    expect(formatCfa(undefined)).toBe('Sur devis');
  });
});

describe('truncate / clampInt / cn', () => {
  it('tronque proprement avec ellipse', () => {
    expect(truncate('Un texte très long qui dépasse la limite fixée', 20)).toMatch(/…$/);
    expect(truncate('court', 20)).toBe('court');
  });
  it('borne les entiers (pagination)', () => {
    expect(clampInt('5', 1, 50, 12)).toBe(5);
    expect(clampInt('999', 1, 50, 12)).toBe(50);
    expect(clampInt('abc', 1, 50, 12)).toBe(12);
    expect(clampInt('-3', 1, 50, 12)).toBe(1);
  });
  it('concatène les classes en ignorant le falsy', () => {
    expect(cn('a', false, 'b', null, undefined, 'c')).toBe('a b c');
  });
});
