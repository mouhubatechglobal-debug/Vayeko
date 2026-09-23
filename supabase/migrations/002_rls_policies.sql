-- Vayeko - RLS Policies (Row Level Security)
-- Sécurité obligatoire : aucun utilisateur ne doit accéder aux données privées d'un autre

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE classified_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Helper function pour vérifier rôle admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper pour vérifier propriétaire boutique
CREATE OR REPLACE FUNCTION is_business_owner(business_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = business_id AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
-- Lecture publique limitée (nom, avatar, ville) mais données sensibles privées
CREATE POLICY "Profils publics lisibles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent modifier leur propre profil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Utilisateurs peuvent créer leur profil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- USER_ROLES
CREATE POLICY "Rôles lisibles par tous" ON user_roles
  FOR SELECT USING (true);

CREATE POLICY "Seul admin peut modifier rôles" ON user_roles
  FOR ALL USING (is_admin());

-- BUSINESSES
CREATE POLICY "Boutiques actives publiques" ON businesses
  FOR SELECT USING (is_active = true OR owner_id = auth.uid() OR is_admin());

CREATE POLICY "Propriétaires peuvent créer boutiques" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Propriétaires peuvent modifier leurs boutiques" ON businesses
  FOR UPDATE USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "Propriétaires peuvent supprimer leurs boutiques" ON businesses
  FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- PRODUCTS
CREATE POLICY "Produits disponibles publics" ON products
  FOR SELECT USING (is_available = true OR seller_id = auth.uid() OR is_admin() OR EXISTS (SELECT 1 FROM businesses WHERE id = shop_id AND owner_id = auth.uid()));

CREATE POLICY "Vendeurs peuvent créer produits dans leurs boutiques" ON products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE id = shop_id AND owner_id = auth.uid()) OR is_admin()
  );

CREATE POLICY "Vendeurs peuvent modifier leurs produits" ON products
  FOR UPDATE USING (
    seller_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM businesses WHERE id = shop_id AND owner_id = auth.uid()) OR 
    is_admin()
  );

CREATE POLICY "Vendeurs peuvent supprimer leurs produits" ON products
  FOR DELETE USING (
    seller_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM businesses WHERE id = shop_id AND owner_id = auth.uid()) OR 
    is_admin()
  );

-- SERVICES
CREATE POLICY "Services disponibles publics" ON services
  FOR SELECT USING (is_available = true OR is_admin() OR is_business_owner(professional_id));

CREATE POLICY "Pros peuvent gérer leurs services" ON services
  FOR ALL USING (is_business_owner(professional_id) OR is_admin());

-- REAL ESTATE
CREATE POLICY "Annonces immo disponibles publiques" ON real_estate_listings
  FOR SELECT USING (is_available = true OR agent_id = auth.uid() OR is_admin());

CREATE POLICY "Agents peuvent gérer leurs annonces immo" ON real_estate_listings
  FOR ALL USING (agent_id = auth.uid() OR is_admin());

-- JOBS
CREATE POLICY "Offres emploi actives publiques" ON job_listings
  FOR SELECT USING (is_active = true OR recruiter_id = auth.uid() OR is_admin());

CREATE POLICY "Recruteurs peuvent gérer leurs offres" ON job_listings
  FOR ALL USING (recruiter_id = auth.uid() OR is_admin());

-- CLASSIFIED
CREATE POLICY "Annonces actives publiques" ON classified_ads
  FOR SELECT USING (status = 'ACTIVE' OR seller_id = auth.uid() OR is_admin());

CREATE POLICY "Utilisateurs peuvent gérer leurs annonces" ON classified_ads
  FOR ALL USING (seller_id = auth.uid() OR is_admin());

-- ORDERS - CRITIQUE : un client ne voit que ses commandes, un vendeur que celles de sa boutique
CREATE POLICY "Clients voient leurs commandes" ON orders
  FOR SELECT USING (customer_id = auth.uid() OR is_admin() OR EXISTS (SELECT 1 FROM businesses WHERE id = shop_id AND owner_id = auth.uid()));

CREATE POLICY "Clients peuvent créer commandes" ON orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Vendeurs et clients peuvent modifier statut selon règles" ON orders
  FOR UPDATE USING (customer_id = auth.uid() OR is_admin() OR EXISTS (SELECT 1 FROM businesses WHERE id = shop_id AND owner_id = auth.uid()));

-- ORDER_ITEMS
CREATE POLICY "Items visibles si commande visible" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (customer_id = auth.uid() OR is_admin() OR EXISTS (SELECT 1 FROM businesses WHERE id = shop_id AND owner_id = auth.uid())))
  );

CREATE POLICY "Création items avec commande" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
  );

-- ORDER_HISTORY
CREATE POLICY "Historique visible si commande visible" ON order_status_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (customer_id = auth.uid() OR is_admin() OR EXISTS (SELECT 1 FROM businesses WHERE id = shop_id AND owner_id = auth.uid())))
  );

CREATE POLICY "Système peut créer historique" ON order_status_history
  FOR INSERT WITH CHECK (true);

-- RESERVATIONS
CREATE POLICY "Réservations visibles par client et pro" ON reservations
  FOR SELECT USING (
    customer_id = auth.uid() OR 
    is_admin() OR 
    EXISTS (SELECT 1 FROM businesses WHERE id = professional_id AND owner_id = auth.uid())
  );

CREATE POLICY "Clients peuvent créer réservations" ON reservations
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Client et pro peuvent modifier réservations" ON reservations
  FOR UPDATE USING (
    customer_id = auth.uid() OR 
    is_admin() OR 
    EXISTS (SELECT 1 FROM businesses WHERE id = professional_id AND owner_id = auth.uid())
  );

-- FAVORITES - PRIVÉ PAR UTILISATEUR (critique)
CREATE POLICY "Favoris privés par utilisateur" ON favorites
  FOR ALL USING (user_id = auth.uid());

-- REVIEWS
CREATE POLICY "Avis publics lisibles" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent créer avis" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Auteurs peuvent modifier leurs avis" ON reviews
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Auteurs et admin peuvent supprimer avis" ON reviews
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- NOTIFICATIONS - PRIVÉ
CREATE POLICY "Notifications privées par utilisateur" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- ADMIN_ACTIONS - SEUL ADMIN
CREATE POLICY "Seul admin voit actions admin" ON admin_actions
  FOR SELECT USING (is_admin());

CREATE POLICY "Seul admin peut créer actions audit" ON admin_actions
  FOR INSERT WITH CHECK (is_admin());

-- Storage buckets RLS (à configurer dans Supabase Dashboard)
-- Buckets: avatars, logos, couvertures, produits, services, immobilier, annonces
-- Politiques storage exemple :
-- - avatars: public read, owner write
-- - produits: public read, vendeur write dans son dossier
