import type { ProfileRole } from './database';

/** Utilisateur exposé côté application (jamais de données sensibles). */
export interface AppUser {
  id: string;
  email: string | null;
}

/** Profil enrichi pour l'affichage public (fiches, avis, etc.). */
export interface PublicProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export interface AuthSession {
  user: AppUser;
  role: ProfileRole;
}

export interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}
