/**
 * Génération sécurisée de liens WhatsApp (wa.me).
 *
 * Règles :
 *  - on ne fait JAMAIS confiance à une URL WhatsApp fournie par un utilisateur ;
 *  - on reconstruit toujours le lien depuis le numéro nettoyé ;
 *  - le code pays Togo (228) est appliqué par défaut, configurable via
 *    NEXT_PUBLIC_WHATSAPP_COUNTRY_CODE.
 */

const DEFAULT_COUNTRY_CODE = '228';

export const WHATSAPP_COUNTRY_CODE = (
  process.env.NEXT_PUBLIC_WHATSAPP_COUNTRY_CODE ?? DEFAULT_COUNTRY_CODE
).replace(/\D/g, '');

/**
 * Normalise un numéro togolais vers son format national à 8 chiffres.
 * Accepte : "90 12 34 56", "+228 90 12 34 56", "0022890123456", "wa.me/22890123456…", etc.
 * Retourne `null` si le numéro n'est pas plausible pour le Togo.
 */
export function normalizeTogoPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Jamais d'URL ou de texte : seuls les caractères téléphoniques sont acceptés
  // (chiffres, +, espaces, tirets, points, parenthèses). Toute URL — même « wa.me/… »
  // — est rejetée : on ne fait jamais confiance à une URL fournie par un utilisateur.
  if (!/^[+\d][\d\s().-]{6,19}$/.test(raw.trim())) return null;
  let digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  // Retire le préfixe international 228 / 00228 éventuel
  if (digits.startsWith('00228')) digits = digits.slice(5);
  else if (digits.startsWith('228')) digits = digits.slice(3);
  // Numéro tapé avec un 0 initial (habitude locale)
  if (digits.startsWith('0') && digits.length === 9) digits = digits.slice(1);

  if (!/^\d{8}$/.test(digits)) return null;
  // Les lignes togolaises démarrent par 2, 7, 9 (fixe 2x, mobiles 7x/9x)
  if (!/^[279]/.test(digits)) return null;
  return digits;
}

/** Numéro complet au format international sans "+" (ex. 22890123456). */
export function whatsappNumber(
  raw: string | null | undefined,
  countryCode: string = WHATSAPP_COUNTRY_CODE,
): string | null {
  const national = normalizeTogoPhone(raw);
  return national ? `${countryCode}${national}` : null;
}

/**
 * Construit un lien https://wa.me sûr. Retourne `null` si le numéro est invalide —
 * l'appelant doit alors masquer le bouton plutôt que d'afficher un lien cassé.
 */
export function buildWhatsAppLink(
  rawPhone: string | null | undefined,
  message = '',
  countryCode: string = WHATSAPP_COUNTRY_CODE,
): string | null {
  const number = whatsappNumber(rawPhone, countryCode);
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  const text = message.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
