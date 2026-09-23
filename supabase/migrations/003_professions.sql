-- Vayeko - Système Professions
-- Profession ≠ Rôle
-- Rôle = ce qu'elle PEUT faire sur Vayeko (USER, SELLER, PROFESSIONAL...)
-- Profession = ce qu'elle FAIT (mécanicien, coiffeur, architecte...)
-- Structure évolutive : ajouter profession sans modifier cœur

-- Table profession_categories
CREATE TABLE profession_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table professions
CREATE TABLE professions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  category_id TEXT NOT NULL REFERENCES profession_categories(id) ON DELETE CASCADE,
  description TEXT,
  icon TEXT,
  requires_verification BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_professions_category ON professions(category_id);
CREATE INDEX idx_professions_active ON professions(is_active);
CREATE INDEX idx_professions_verification ON professions(requires_verification);

-- Table professional_profiles - profil pro lié à user + profession
CREATE TYPE verification_status AS ENUM ('NON_VERIFIE', 'EN_VERIFICATION', 'VERIFIE', 'REJETE');

CREATE TABLE professional_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profession_id TEXT REFERENCES professions(id) ON DELETE SET NULL,
  custom_profession TEXT CHECK (char_length(custom_profession) <= 100),
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  description TEXT CHECK (char_length(description) <= 2000),
  experience TEXT CHECK (char_length(experience) <= 1000),
  verification_status verification_status DEFAULT 'NON_VERIFIE',
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (profession_id IS NOT NULL AND custom_profession IS NULL) OR
    (profession_id IS NULL AND custom_profession IS NOT NULL) OR
    (profession_id = 'autre' AND custom_profession IS NOT NULL)
  )
);
CREATE INDEX idx_pro_profiles_user ON professional_profiles(user_id);
CREATE INDEX idx_pro_profiles_profession ON professional_profiles(profession_id);
CREATE INDEX idx_pro_profiles_business ON professional_profiles(business_id);
CREATE INDEX idx_pro_profiles_verification ON professional_profiles(verification_status);
CREATE INDEX idx_pro_profiles_active ON professional_profiles(is_active);

-- Trigger updated_at
CREATE TRIGGER update_pro_profiles_updated_at BEFORE UPDATE ON professional_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE profession_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE professions ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;

-- Lecture publique des catégories et professions actives
CREATE POLICY "Catégories professions publiques" ON profession_categories
  FOR SELECT USING (is_active = true OR is_admin());

CREATE POLICY "Professions actives publiques" ON professions
  FOR SELECT USING (is_active = true OR is_admin());

-- Professional profiles : public si vérifié ou propriétaire ou admin
CREATE POLICY "Profils pro vérifiés publics" ON professional_profiles
  FOR SELECT USING (
    (is_active = true AND verification_status IN ('VERIFIE', 'NON_VERIFIE')) OR
    user_id = auth.uid() OR
    is_admin()
  );

CREATE POLICY "Utilisateurs peuvent créer leur profil pro" ON professional_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Utilisateurs peuvent modifier leur profil pro" ON professional_profiles
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Utilisateurs peuvent supprimer leur profil pro" ON professional_profiles
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- Seed catégories
INSERT INTO profession_categories (id, name, slug, description, icon, color) VALUES
('maison', 'Maison / Construction', 'maison-construction', 'Bâtiment, construction, rénovation', '🏗️', '#F59E0B'),
('informatique', 'Informatique / Technologie', 'informatique-technologie', 'Numérique, développement, design', '💻', '#06B6D4'),
('commerce', 'Commerce', 'commerce', 'Vente, distribution, boutique', '🛒', '#7C3AED'),
('restauration', 'Restauration / Alimentation', 'restauration-alimentation', 'Cuisine, food, livraison', '🍽️', '#EF4444'),
('beaute', 'Beauté / Bien-être', 'beaute-bien-etre', 'Coiffure, esthétique, bien-être', '💄', '#EC4899'),
('transport', 'Transport / Automobile', 'transport-automobile', 'Mécanique, conduite, livraison', '🚗', '#6366F1'),
('education', 'Éducation', 'education', 'Enseignement, formation, coaching', '📚', '#0E9F6E'),
('sante', 'Santé', 'sante', 'Médical, paramédical - vérification requise', '🏥', '#E11D48'),
('juridique', 'Juridique / Finance', 'juridique-finance', 'Droit, compta, assurance', '⚖️', '#1F2937'),
('immobilier', 'Immobilier', 'immobilier', 'Agence, gestion, promotion', '🏠', '#06B6D4'),
('emploi', 'Emploi / Entreprise', 'emploi-entreprise', 'Recrutement, RH, coaching pro', '💼', '#E11D48'),
('art', 'Art / Culture / Événementiel', 'art-culture-evenementiel', 'Artiste, photo, événement', '🎨', '#8B5CF6'),
('services_particuliers', 'Services aux particuliers', 'services-particuliers', 'Nettoyage, jardinage, aide', '🧹', '#10B981'),
('agriculture', 'Agriculture', 'agriculture', 'Agriculteur, éleveur, pêcheur', '🌾', '#84CC16'),
('services_pro', 'Services professionnels', 'services-professionnels', 'Consultant, traducteur, freelance', '💼', '#6B7280');

-- Seed professions (extrait - les plus courantes, reste via app)
INSERT INTO professions (id, name, slug, category_id, description, icon, requires_verification) VALUES
('architecte', 'Architecte', 'architecte', 'maison', 'Conception plans, suivi chantier', '📐', true),
('macon', 'Maçon', 'macon', 'maison', 'Construction gros œuvre', '🧱', false),
('electricien', 'Électricien', 'electricien', 'maison', 'Installation, dépannage électrique', '⚡', false),
('plombier', 'Plombier', 'plombier', 'maison', 'Plomberie, sanitaire', '🚿', false),
('menuisier', 'Menuisier', 'menuisier', 'maison', 'Bois, portes, fenêtres', '🪚', false),
('dev_web', 'Développeur web', 'developpeur-web', 'informatique', 'Sites web, applications web', '🌐', false),
('dev_mobile', 'Développeur mobile', 'developpeur-mobile', 'informatique', 'Apps iOS/Android', '📱', false),
('graphiste', 'Graphiste', 'graphiste', 'informatique', 'Design graphique', '🖌️', false),
('photographe', 'Photographe', 'photographe', 'informatique', 'Photo pro, événement', '📸', false),
('commercant', 'Commerçant', 'commercant', 'commerce', 'Commerce général', '🏪', false),
('vendeur', 'Vendeur', 'vendeur', 'commerce', 'Vente détail', '🛍️', false),
('restaurant', 'Restaurant', 'restaurant', 'restauration', 'Restaurant, maquis', '🍽️', false),
('cuisinier', 'Cuisinier', 'cuisinier', 'restauration', 'Cuisine pro', '👨‍🍳', false),
('coiffeur', 'Coiffeur', 'coiffeur', 'beaute', 'Coiffure homme', '💇‍♂️', false),
('coiffeuse', 'Coiffeuse', 'coiffeuse', 'beaute', 'Coiffure femme', '💇‍♀️', false),
('couturier', 'Couturier', 'couturier', 'beaute', 'Couture, retouches', '👗', false),
('mecanicien', 'Mécanicien', 'mecanicien', 'transport', 'Réparation auto/moto', '🔧', false),
('vulcanisateur', 'Vulcanisateur', 'vulcanisateur', 'transport', 'Pneus, vulcanisation', '🛞', false),
('conducteur', 'Conducteur', 'conducteur', 'transport', 'Chauffeur, conducteur', '🚕', false),
('enseignant', 'Enseignant', 'enseignant', 'education', 'Enseignement scolaire', '👨‍🏫', false),
('formateur', 'Formateur', 'formateur', 'education', 'Formation pro', '📖', false),
('medecin', 'Médecin', 'medecin', 'sante', 'Médecine générale/spécialisée', '👨‍⚕️', true),
('infirmier', 'Infirmier', 'infirmier', 'sante', 'Soins infirmiers', '💉', true),
('pharmacien', 'Pharmacien', 'pharmacien', 'sante', 'Pharmacie', '💊', true),
('avocat', 'Avocat', 'avocat', 'juridique', 'Conseil juridique', '⚖️', true),
('comptable', 'Comptable', 'comptable', 'juridique', 'Comptabilité', '🧮', true),
('agent_immobilier', 'Agent immobilier', 'agent-immobilier', 'immobilier', 'Transaction immo', '🏠', false),
('recruteur', 'Recruteur', 'recruteur', 'emploi', 'Recrutement', '🤝', false),
('artiste', 'Artiste', 'artiste', 'art', 'Art, création', '🎨', false),
('photographe_event', 'Photographe événementiel', 'photographe-evenementiel', 'art', 'Photo mariage, événement', '📸', false),
('nettoyage', 'Agent de nettoyage', 'agent-nettoyage', 'services_particuliers', 'Nettoyage, ménage', '🧹', false),
('agriculteur', 'Agriculteur', 'agriculteur', 'agriculture', 'Culture, maraîchage', '🌾', false),
('consultant', 'Consultant', 'consultant', 'services_pro', 'Conseil entreprise', '💡', false),
('freelance', 'Freelance', 'freelance', 'services_pro', 'Indépendant', '💻', false),
('autre', 'Autre profession', 'autre-profession', 'services_pro', 'Profession non listée - saisie libre', '➕', false);
