// Vayeko - Auth & RBAC
// IMPORTANT: Comptes démo uniquement pour développement/tests, jamais en production
// Un utilisateur peut être acheteur sans devenir SELLER/PROFESSIONAL
// Rôle = ce qu'il PEUT faire sur Vayeko, Profession = ce qu'il FAIT dans la vie

export interface UserSession {
  id: string
  email: string
  name: string
  roles: string[] // USER, SELLER, PROFESSIONAL, REAL_ESTATE_AGENT, RECRUITER, ADMIN
  city?: string
  avatar?: string
  professions?: string[] // IDs des professions
}

// Comptes démo DEV uniquement - NE PAS utiliser en production
// Mots de passe doivent être définis via env vars en dev, jamais exposés en public
// client@vayeko.tg RETIRÉ : un USER peut acheter sans rôle SELLER/PROFESSIONAL
export const mockUsers = [
  {
    id: 'user-2',
    email: 'vendeur@vayeko.tg',
    // En prod, mot de passe via NEXT_PUBLIC_DEMO_SELLER_PASSWORD ou Supabase Auth
    password: process.env.NEXT_PUBLIC_DEMO_SELLER_PASSWORD || 'vendeur123',
    name: 'Koffi TechPlus',
    roles: ['USER', 'SELLER'],
    city: 'Lomé',
    avatar: 'https://i.pravatar.cc/100?img=8',
    professions: ['commercant', 'vendeur'],
  },
  {
    id: 'user-3',
    email: 'pro@vayeko.tg',
    password: process.env.NEXT_PUBLIC_DEMO_PRO_PASSWORD || 'pro123',
    name: 'Salon Élégance',
    roles: ['USER', 'PROFESSIONAL'],
    city: 'Lomé',
    avatar: 'https://i.pravatar.cc/100?img=9',
    professions: ['coiffeur', 'esthetique'],
  },
  {
    id: 'user-4',
    email: 'admin@vayeko.tg',
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'admin123',
    name: 'Admin Vayeko',
    roles: ['USER', 'ADMIN'],
    city: 'Lomé',
    avatar: 'https://i.pravatar.cc/100?img=12',
    professions: [],
  },
]

// Simulation stockage local - en prod utiliser Supabase Auth cookies httpOnly + JWT
// Supabase permet RBAC avec table user_roles + custom claims dans RLS
export function getStoredUser(): UserSession | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('vayeko_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function storeUser(user: UserSession) {
  if (typeof window === 'undefined') return
  localStorage.setItem('vayeko_user', JSON.stringify(user))
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('vayeko_user')
}

export function hasRole(user: UserSession | null, role: string): boolean {
  if (!user) return false
  // Ne jamais utiliser email comme mécanisme permanent d'autorisation
  // Vérification via vraie structure rôles côté serveur/DB
  return user.roles.includes(role)
}

export function hasAnyRole(user: UserSession | null, roles: string[]): boolean {
  if (!user) return false
  return roles.some(r => user.roles.includes(r))
}

export function canAccessDashboard(user: UserSession | null): boolean {
  if (!user) return false
  return hasAnyRole(user, ['SELLER', 'PROFESSIONAL', 'REAL_ESTATE_AGENT', 'RECRUITER', 'ADMIN'])
}

export function canBuyWithoutSellerRole(user: UserSession | null): boolean {
  // Un USER peut acheter sans devenir SELLER ou PROFESSIONAL
  // Ex: USER achète téléphone, reste USER, plus tard peut créer boutique => SELLER
  if (!user) return false
  return user.roles.includes('USER')
}

// Vérification côté serveur (à utiliser dans API routes / Server Components avec Supabase)
// Ne jamais faire: if (user.email === "admin@vayeko.tg") { admin = true }
export function isAdminServerSide(userRoles: string[]): boolean {
  return userRoles.includes('ADMIN')
}
