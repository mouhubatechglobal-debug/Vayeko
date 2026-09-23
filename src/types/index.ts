// Vayeko - Types centralisés
// Tous les types de l'application
// IMPORTANT: Profession ≠ Rôle
// Rôle = ce qu'elle PEUT faire sur Vayeko (USER, SELLER, PROFESSIONAL...)
// Profession = ce qu'elle FAIT (mécanicien, coiffeur, architecte...)

export type TogoCity = 'Lomé' | 'Sokodé' | 'Kara' | 'Atakpamé' | 'Kpalimé' | 'Dapaong' | 'Tsévié' | 'Aného'

export const TOGO_CITIES: TogoCity[] = ['Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié', 'Aného']

export enum Role {
  USER = 'USER',
  SELLER = 'SELLER',
  PROFESSIONAL = 'PROFESSIONAL',
  REAL_ESTATE_AGENT = 'REAL_ESTATE_AGENT',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REFUSED = 'REFUSED',
  MODIFIED = 'MODIFIED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PropertyType {
  MAISON = 'MAISON',
  APPARTEMENT = 'APPARTEMENT',
  TERRAIN = 'TERRAIN',
  BUREAU = 'BUREAU',
  LOCAL = 'LOCAL',
  AUTRE = 'AUTRE'
}

export enum PropertyStatus {
  A_LOUER = 'A_LOUER',
  A_VENDRE = 'A_VENDRE',
  VENDU = 'VENDU',
  LOUE = 'LOUE'
}

export enum VerificationStatus {
  NON_VERIFIE = 'NON_VERIFIE',
  EN_VERIFICATION = 'EN_VERIFICATION',
  VERIFIE = 'VERIFIE',
  REJETE = 'REJETE'
}

export interface ProfessionCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
}

export interface Profession {
  id: string
  name: string
  slug: string
  categoryId: string
  description: string
  icon: string
  requiresVerification: boolean
  isActive: boolean
}

export interface ProfessionalProfile {
  id: string
  userId: string
  professionId?: string
  customProfession?: string
  profession?: Profession
  businessId?: string
  business?: Shop
  description?: string
  experience?: string
  verificationStatus: VerificationStatus
  verificationNotes?: string
  verifiedAt?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  city: TogoCity
  quartier?: string
  roles: Role[] // Ce qu'elle PEUT faire sur Vayeko
  professions?: ProfessionalProfile[] // Ce qu'elle FAIT dans la vie
  isVerified?: boolean
  createdAt?: string
  // Un USER peut acheter sans devenir SELLER/PROFESSIONAL
  // Ex: USER achète téléphone, reste USER, plus tard crée boutique => SELLER, cumule USER+SELLER
}

export interface Shop {
  id: string
  name: string
  slug: string
  logo?: string
  cover?: string
  description?: string
  category: string
  city: TogoCity
  quartier?: string
  phone?: string
  whatsapp?: string
  email?: string
  horaires?: string
  isVerified: boolean
  isActive: boolean
  rating: number
  reviewCount: number
  ownerId: string
  productsCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  category: string
  price: number // FCFA
  oldPrice?: number | null
  images: string[]
  stock: number
  isAvailable: boolean
  variants?: string[]
  delivery: boolean
  pickup: boolean
  shopId: string
  shopName?: string
  city: TogoCity
  rating: number
  reviewCount: number
  updatedAt: Date | string
  createdAt?: Date | string
}

export interface Professional {
  id: string
  businessName: string
  slug: string
  logo?: string
  cover?: string
  description?: string
  category: string
  city: TogoCity
  quartier?: string
  phone?: string
  whatsapp?: string
  email?: string
  horaires?: string
  isOpen: boolean
  isVerified: boolean
  rating: number
  reviewCount: number
  userId: string
  profession?: Profession
  verificationStatus?: VerificationStatus
}

export interface Service {
  id: string
  title: string
  slug?: string
  description?: string
  category: string
  price: number
  priceType: string
  images: string[]
  isAvailable: boolean
  professionalId: string
  professional: {
    id: string
    name: string
    logo: string
    cover?: string
    rating: number
    reviewCount: number
    city: TogoCity
    quartier: string
    phone: string
    whatsapp: string
    isOpen: boolean
    horaires: string
    profession?: Profession
    verificationStatus?: VerificationStatus
  }
  city: TogoCity
}

export interface Property {
  id: string
  title: string
  slug?: string
  description?: string
  price: number
  priceType: string
  city: TogoCity
  quartier: string
  type: string
  status: string
  pieces: number
  superficie: number
  photos: string[]
  agent: {
    name: string
    phone: string
    whatsapp: string
  }
  isAvailable: boolean
  createdAt: Date | string
  features: string[]
}

export interface JobOffer {
  id: string
  title: string
  slug?: string
  company: string
  companyLogo: string
  description: string
  competences: string[]
  city: TogoCity
  contractType: string
  salary: string
  publicationDate: Date | string
  deadline: Date | string
  isActive: boolean
}

export interface CampusPost {
  id: string
  title: string
  slug?: string
  description: string
  type: string
  city: TogoCity
  price?: number | null
  author: string
  phone: string
  createdAt: Date | string
}

export interface Listing {
  id: string
  title: string
  slug?: string
  description?: string
  price: number
  city: TogoCity
  quartier: string
  category: string
  images: string[]
  seller: string
  phone: string
  createdAt: Date | string
  status: string
}

export interface Order {
  id: string
  customerId: string
  shopId?: string
  totalPrice: number
  status: OrderStatus
  deliveryAddress?: string
  city: TogoCity
  createdAt: Date | string
  updatedAt: Date | string
  items?: OrderItem[]
  history?: OrderStatusHistory[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  priceAtOrder: number
  product?: Product
}

export interface OrderStatusHistory {
  id: string
  orderId: string
  status: OrderStatus
  changedBy?: string
  note?: string
  createdAt: Date | string
}

export interface Reservation {
  id: string
  customerId: string
  serviceId?: string
  date: string
  time: string
  status: ReservationStatus
  notes?: string
  createdAt: Date | string
  service?: Service
}

export interface Review {
  id: string
  userId: string
  userName: string
  avatar: string
  targetType: string
  targetId: string
  rating: number
  comment?: string
  createdAt: Date | string
}

export interface Favorite {
  id: string
  userId: string
  targetType: 'PRODUCT' | 'SHOP' | 'SERVICE' | 'PROPERTY' | 'JOB' | 'LISTING' | 'CAMPUS'
  targetId: string
  createdAt: Date | string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: Date | string
}

// Search
export interface SearchFilters {
  query?: string
  city?: TogoCity | 'Toutes'
  category?: string
  priceMin?: number
  priceMax?: number
  type?: string
  status?: string
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'recent'
  page?: number
  limit?: number
}

export interface SearchResults {
  products: Product[]
  shops: Shop[]
  services: Service[]
  properties: Property[]
  jobs: JobOffer[]
  listings: Listing[]
  campus: CampusPost[]
  total: number
}

// API Responses
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

// Form validation
export interface ValidationError {
  field: string
  message: string
}
