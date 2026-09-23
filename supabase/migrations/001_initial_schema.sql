-- Vayeko - Schéma initial Supabase
-- PostgreSQL avec RLS obligatoire

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Types ENUM
CREATE TYPE user_role AS ENUM ('USER', 'SELLER', 'PROFESSIONAL', 'REAL_ESTATE_AGENT', 'RECRUITER', 'ADMIN');
CREATE TYPE order_status AS ENUM ('NEW', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED');
CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'REFUSED', 'MODIFIED', 'CANCELLED', 'COMPLETED');
CREATE TYPE property_type AS ENUM ('MAISON', 'APPARTEMENT', 'TERRAIN', 'BUREAU', 'LOCAL', 'AUTRE');
CREATE TYPE property_status AS ENUM ('A_LOUER', 'A_VENDRE', 'VENDU', 'LOUE');
CREATE TYPE contract_type AS ENUM ('CDI', 'CDD', 'STAGE', 'FREELANCE', 'INTERIM', 'ALTERNANCE');
CREATE TYPE listing_category AS ENUM ('ELECTRONIQUE', 'VEHICULES', 'MAISON', 'VETEMENTS', 'SERVICES', 'MATERIEL', 'EMPLOI', 'AUTRE');
CREATE TYPE listing_status AS ENUM ('ACTIVE', 'VENDU', 'EXPIRE', 'SUSPENDU');
CREATE TYPE favorite_target AS ENUM ('PRODUCT', 'SHOP', 'SERVICE', 'PROPERTY', 'JOB', 'LISTING', 'CAMPUS');
CREATE TYPE review_target AS ENUM ('PRODUCT', 'SHOP', 'SERVICE', 'PROPERTY', 'PROFESSIONAL');

-- Table profiles (étend auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL CHECK (char_length(full_name) >= 2 AND char_length(full_name) <= 100),
  phone TEXT CHECK (phone ~ '^(\+228)?[0-9]{8}$'),
  avatar_url TEXT,
  city TEXT NOT NULL DEFAULT 'Lomé' CHECK (city IN ('Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié', 'Aného')),
  quartier TEXT,
  bio TEXT CHECK (char_length(bio) <= 1000),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table user_roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- Table business_categories
CREATE TABLE business_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table businesses (boutiques / services)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  logo_url TEXT,
  cover_url TEXT,
  description TEXT CHECK (char_length(description) <= 2000),
  category_id UUID REFERENCES business_categories(id),
  category TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié', 'Aného')),
  quartier TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  horaires TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_active ON businesses(is_active);

-- Table product_categories
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 200),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT CHECK (char_length(description) <= 5000),
  category_id UUID REFERENCES product_categories(id),
  category TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0 AND price <= 100000000),
  old_price INTEGER CHECK (old_price IS NULL OR (old_price >= 0 AND old_price <= 100000000)),
  images JSONB DEFAULT '[]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_available BOOLEAN DEFAULT TRUE,
  variants JSONB DEFAULT '[]'::jsonb,
  delivery BOOLEAN DEFAULT TRUE,
  pickup BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  shop_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id),
  city TEXT NOT NULL DEFAULT 'Lomé',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_shop ON products(shop_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_city ON products(city);
CREATE INDEX idx_products_updated ON products(updated_at);

-- Table services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  slug TEXT NOT NULL UNIQUE,
  description TEXT CHECK (char_length(description) <= 5000),
  category TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  price_type TEXT DEFAULT 'À partir de',
  images JSONB DEFAULT '[]'::jsonb,
  is_available BOOLEAN DEFAULT TRUE,
  professional_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_services_pro ON services(professional_id);
CREATE INDEX idx_services_city ON services(city);
CREATE INDEX idx_services_category ON services(category);

-- Table real_estate_listings
CREATE TABLE real_estate_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  price_type TEXT DEFAULT 'par mois',
  city TEXT NOT NULL,
  quartier TEXT,
  type property_type NOT NULL,
  status property_status DEFAULT 'A_LOUER',
  pieces INTEGER DEFAULT 0,
  superficie INTEGER NOT NULL,
  photos JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_real_estate_city ON real_estate_listings(city);
CREATE INDEX idx_real_estate_type ON real_estate_listings(type);
CREATE INDEX idx_real_estate_status ON real_estate_listings(status);

-- Table job_listings
CREATE TABLE job_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_logo TEXT,
  description TEXT NOT NULL,
  competences JSONB DEFAULT '[]'::jsonb,
  city TEXT NOT NULL,
  contract_type contract_type NOT NULL,
  salary TEXT,
  publication_date TIMESTAMPTZ DEFAULT NOW(),
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  recruiter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_jobs_city ON job_listings(city);
CREATE INDEX idx_jobs_contract ON job_listings(contract_type);

-- Table classified_ads
CREATE TABLE classified_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  images JSONB DEFAULT '[]'::jsonb,
  city TEXT NOT NULL,
  quartier TEXT,
  category listing_category NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  seller_name TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  status listing_status DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_classified_city ON classified_ads(city);
CREATE INDEX idx_classified_category ON classified_ads(category);

-- Table orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  total_price INTEGER NOT NULL CHECK (total_price >= 0),
  status order_status DEFAULT 'NEW',
  delivery_address TEXT,
  city TEXT NOT NULL DEFAULT 'Lomé',
  payment_method TEXT DEFAULT 'CASH',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_shop ON orders(shop_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Table order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 100),
  price_at_order INTEGER NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Table order_status_history
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_order_history_order ON order_status_history(order_id);

-- Table reservations
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status reservation_status DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (date >= CURRENT_DATE)
);
CREATE INDEX idx_reservations_customer ON reservations(customer_id);
CREATE INDEX idx_reservations_service ON reservations(service_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_date ON reservations(date);

-- Table favorites (privé par utilisateur)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type favorite_target NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);
CREATE INDEX idx_favorites_user ON favorites(user_id);

-- Table reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type review_target NOT NULL,
  target_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT CHECK (char_length(comment) <= 1000),
  response TEXT,
  is_reported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Table notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Table admin_actions (audit)
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_admin_actions_actor ON admin_actions(actor_id);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at);

-- Function pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
