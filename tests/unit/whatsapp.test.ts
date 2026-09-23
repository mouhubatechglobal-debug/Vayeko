import { describe, expect, it } from 'vitest';
import { buildWhatsAppLink, normalizeTogoPhone, whatsappNumber } from '@/lib/whatsapp';

describe('normalizeTogoPhone', () => {
  it('accepte un numéro local à 8 chiffres', () => {
    expect(normalizeTogoPhone('90123456')).toBe('90123456');
    expect(normalizeTogoPhone('90 12 34 56')).toBe('90123456');
  });

  it('accepte le préfixe international +228 / 00228', () => {
    expect(normalizeTogoPhone('+22890123456')).toBe('90123456');
    expect(normalizeTogoPhone('00228 90 12 34 56')).toBe('90123456');
    expect(normalizeTogoPhone('+228 22 12 34 56')).toBe('22123456');
  });

  it('accepte un 0 initial local (9 chiffres)', () => {
    expect(normalizeTogoPhone('090123456')).toBe('90123456');
  });

  it('rejette les numéros trop courts ou trop longs', () => {
    expect(normalizeTogoPhone('9012345')).toBeNull();
    expect(normalizeTogoPhone('+228 90 12 345 67')).toBeNull();
    expect(normalizeTogoPhone('')).toBeNull();
    expect(normalizeTogoPhone(null)).toBeNull();
    expect(normalizeTogoPhone(undefined)).toBeNull();
  });

  it('rejette les préfixes non togolais plausibles', () => {
    expect(normalizeTogoPhone('+228 01 23 45 67')).toBeNull(); // commence par 0
    expect(normalizeTogoPhone('45123456')).toBeNull(); // ne commence pas par 2/7/9
  });

  it("nettoye les caractères non numériques et ignore le texte parasite", () => {
    expect(normalizeTogoPhone('Tel: +228 (90) 12-34-56 ext 9')).toBeNull(); // trop long après nettoyage
    expect(normalizeTogoPhone('wa.me/22890123456?text=hi')).toBeNull();
  });
});

describe('whatsappNumber', () => {
  it('construit le numéro international', () => {
    expect(whatsappNumber('+228 90 12 34 56')).toBe('22890123456');
  });

  it('utilise le code pays passé en paramètre', () => {
    expect(whatsappNumber('90123456', '233')).toBe('23390123456');
  });

  it('renvoie null si le numéro est invalide', () => {
    expect(whatsappNumber('123')).toBeNull();
  });
});

describe('buildWhatsAppLink', () => {
  it('génère un lien wa.me sûr', () => {
    expect(buildWhatsAppLink('+228 90 12 34 56')).toBe('https://wa.me/22890123456');
  });

  it('encode correctement le message', () => {
    const link = buildWhatsAppLink('90123456', "Bonjour, j'ai vu votre service sur Vayeko !");
    expect(link).toBe(
      'https://wa.me/22890123456?text=' +
        encodeURIComponent("Bonjour, j'ai vu votre service sur Vayeko !"),
    );
    expect(link).not.toContain(' ');
  });

  it('ne fait JAMAIS confiance à une URL WhatsApp fournie par un utilisateur', () => {
    expect(buildWhatsAppLink('https://wa.me/22890123456')).toBeNull();
    expect(buildWhatsAppLink('javascript:alert(1)')).toBeNull();
    expect(buildWhatsAppLink('https://malware.example')).toBeNull();
  });

  it('renvoie null pour un numéro invalide', () => {
    expect(buildWhatsAppLink('00')).toBeNull();
    expect(buildWhatsAppLink('')).toBeNull();
  });
});
