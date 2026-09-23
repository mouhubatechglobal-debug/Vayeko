import type { MemberRole, ProfileRole } from '@/types/database';

/**
 * Règles d'autorisation Vayeko (fonctions pures — testées unitairement).
 *
 * Ces fonctions servent la couche UI / serveur, mais la DERNIÈRE ligne de
 * défense reste toujours les politiques RLS PostgreSQL côté base.
 */

export const PROFILE_ROLES: readonly ProfileRole[] = ['user', 'merchant', 'provider', 'admin'];
export const MEMBER_ROLES: readonly MemberRole[] = ['owner', 'manager', 'editor'];

/** Un profil peut-il accéder à l'espace admin ? */
export function canAccessAdmin(role: ProfileRole | null | undefined): boolean {
  return role === 'admin';
}

/** Le tableau de bord pro (commerce / prestations) requiert un rôle adapté. */
export function canAccessDashboard(role: ProfileRole | null | undefined): boolean {
  return role === 'merchant' || role === 'provider' || role === 'admin';
}

/** Un membre d'une entreprise peut-il gérer ses informations ? */
export function canManageBusiness(memberRole: MemberRole | null | undefined): boolean {
  return memberRole === 'owner' || memberRole === 'manager';
}

/** Les éditeurs peuvent gérer le contenu mais pas les paramètres sensibles. */
export function canEditContent(memberRole: MemberRole | null | undefined): boolean {
  return memberRole === 'owner' || memberRole === 'manager' || memberRole === 'editor';
}

/** Un utilisateur authentifié peut-il laisser un avis ? */
export function canReview(userId: string | null | undefined): boolean {
  return Boolean(userId);
}

/** Labels FR pour l'UI admin. */
export const ROLE_LABELS: Record<ProfileRole, string> = {
  user: 'Utilisateur',
  merchant: 'Commerçant',
  provider: 'Prestataire',
  admin: 'Administrateur',
};

export function isProfileRole(value: unknown): value is ProfileRole {
  return typeof value === 'string' && (PROFILE_ROLES as readonly string[]).includes(value);
}
