/**
 * Types de la base de données Vayeko (PostgreSQL / Supabase).
 * Ces types reflètent les migrations SQL de `supabase/migrations/*`.
 * Ils servent de contrat pour le client Supabase typé (`Database`).
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ---------------------------------------------------------------------------
// Enums applicatifs (stockés en TEXT + CHECK en base)
// ---------------------------------------------------------------------------
export type ProfileRole = 'user' | 'merchant' | 'provider' | 'admin';
export type BusinessType = 'shop' | 'service' | 'both';
export type BusinessStatus = 'pending' | 'active' | 'suspended' | 'rejected';
export type MemberRole = 'owner' | 'manager' | 'editor';
export type ProductStatus = 'draft' | 'active' | 'archived';
export type ServiceRateType = 'fixed' | 'from' | 'quote' | 'hourly';
export type ReportTarget = 'user' | 'business' | 'product' | 'service' | 'review';
export type ReportStatus = 'open' | 'in_review' | 'resolved' | 'rejected';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type ReviewTarget = 'business' | 'product' | 'service';

// ---------------------------------------------------------------------------
// Lignes de tables (Row)
// ---------------------------------------------------------------------------
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type RoleRow = {
  id: number;
  name: string;
  description: string | null;
}

export type PermissionRow = {
  id: number;
  name: string;
  description: string | null;
}

export type RolePermissionRow = {
  role_id: number;
  permission_id: number;
}

export type City = {
  id: string;
  name: string;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export type Neighborhood = {
  id: string;
  city_id: string;
  name: string;
  created_at: string;
}

export type Location = {
  id: string;
  address_line: string | null;
  city_id: string;
  neighborhood_id: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export type Business = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  type: BusinessType;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  logo_url: string | null;
  cover_url: string | null;
  location_id: string | null;
  status: BusinessStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type BusinessMember = {
  id: string;
  business_id: string;
  profile_id: string;
  member_role: MemberRole;
  created_at: string;
}

export type Shop = {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  description: string | null;
  location_id: string | null;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export type ProductCategory = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  created_at: string;
}

export type Product = {
  id: string;
  shop_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price_cfa: number;
  compare_at_price_cfa: number | null;
  available: boolean;
  stock: number | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  position: number;
  created_at: string;
}

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export type Service = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  price_cfa: number | null;
  rate_type: ServiceRateType;
  phone: string | null;
  whatsapp: string | null;
  opening_hours: Json | null;
  location_id: string | null;
  status: BusinessStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type ServiceProvider = {
  id: string;
  business_id: string;
  service_category_id: string;
  experience_years: number | null;
  certified: boolean;
  created_at: string;
}

export type Review = {
  id: string;
  author_id: string;
  target: ReviewTarget;
  business_id: string | null;
  product_id: string | null;
  service_id: string | null;
  rating: number;
  comment: string | null;
  status: 'published' | 'rejected';
  created_at: string;
  updated_at: string;
}

export type Favorite = {
  id: string;
  profile_id: string;
  target: 'business' | 'product' | 'service';
  business_id: string | null;
  product_id: string | null;
  service_id: string | null;
  created_at: string;
}

export type Report = {
  id: string;
  reporter_id: string;
  target: ReportTarget;
  business_id: string | null;
  product_id: string | null;
  service_id: string | null;
  review_id: string | null;
  reported_profile_id: string | null;
  reason: string;
  details: string | null;
  status: ReportStatus;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export type Order = {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  shop_id: string;
  note: string | null;
  status: OrderStatus;
  total_cfa: number;
  created_at: string;
  updated_at: string;
}

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name_snapshot: string;
  unit_price_cfa: number;
  quantity: number;
  created_at: string;
}

export type AdminAction = {
  id: string;
  admin_id: string;
  action: string;
  entity: string;
  entity_id: string;
  details: Json | null;
  created_at: string;
}

export type AuditLog = {
  id: string;
  profile_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Json | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Contrat générique Supabase (utilisé par lib/database.ts)
// Insert reste permissif (`Partial`) car les champs par défaut sont gérés
// par la base ; les validations métier passent par Zod côté serveur.
// ---------------------------------------------------------------------------
type Table<TRow> = {
  Row: TRow;
  Insert: Partial<TRow>;
  Update: Partial<TRow>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile>;
      roles: Table<RoleRow>;
      permissions: Table<PermissionRow>;
      role_permissions: Table<RolePermissionRow>;
      cities: Table<City>;
      neighborhoods: Table<Neighborhood>;
      locations: Table<Location>;
      businesses: Table<Business>;
      business_members: Table<BusinessMember>;
      shops: Table<Shop>;
      product_categories: Table<ProductCategory>;
      products: Table<Product>;
      product_images: Table<ProductImage>;
      service_categories: Table<ServiceCategory>;
      services: Table<Service>;
      service_providers: Table<ServiceProvider>;
      reviews: Table<Review>;
      favorites: Table<Favorite>;
      reports: Table<Report>;
      orders: Table<Order>;
      order_items: Table<OrderItem>;
      admin_actions: Table<AdminAction>;
      audit_logs: Table<AuditLog>;
    };
    Views: Record<string, never>;
    Functions: {
      is_business_member: { Args: { p_business_id: string }; Returns: boolean };
      is_shop_member: { Args: { p_shop_id: string }; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
