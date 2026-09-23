// Auth simplifié pour MVP Vayeko
// En production: utiliser NextAuth + Prisma + JWT httpOnly

export interface UserSession {
  id: string
  email: string
  name: string
  roles: string[]
  city?: string
  avatar?: string
}

export const mockUsers = [
  {
    id: 'user-1',
    email: 'client@vayeko.tg',
    password: 'client123',
    name: 'Afi Mensah',
    roles: ['USER'],
    city: 'Lomé',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    id: 'user-2',
    email: 'vendeur@vayeko.tg',
    password: 'vendeur123',
    name: 'Koffi TechPlus',
    roles: ['USER', 'SELLER'],
    city: 'Lomé',
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
  {
    id: 'user-3',
    email: 'pro@vayeko.tg',
    password: 'pro123',
    name: 'Salon Élégance',
    roles: ['USER', 'PROFESSIONAL'],
    city: 'Lomé',
    avatar: 'https://i.pravatar.cc/100?img=9',
  },
  {
    id: 'user-4',
    email: 'admin@vayeko.tg',
    password: 'admin123',
    name: 'Admin Vayeko',
    roles: ['USER', 'ADMIN'],
    city: 'Lomé',
    avatar: 'https://i.pravatar.cc/100?img=12',
  },
]

// Simulation stockage local - en prod utiliser cookies httpOnly + JWT
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
  return user.roles.includes(role)
}

export function canAccessDashboard(user: UserSession | null): boolean {
  if (!user) return false
  return user.roles.some(r => ['SELLER', 'PROFESSIONAL', 'REAL_ESTATE_AGENT', 'RECRUITER', 'ADMIN'].includes(r))
}
