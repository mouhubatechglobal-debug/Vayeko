-- =============================================================================
-- Vayeko V1 — seed.sql : données de DÉMONSTRATION (100 % fictives)
-- Exécuté automatiquement après les migrations par `supabase db reset`
-- ou manuellement :  psql $DATABASE_URL -f supabase/seed.sql
-- Mot de passe de TOUS les comptes démo : Password123!
--   admin@vayeko.example      (admin)
--   marchand@vayeko.example   (commerçant : 2 boutiques, produits)
--   prestataire@vayeko.example (prestataire : 2 services)
--   cliente@vayeko.example    (utilisatrice : avis + favoris + signalement)
-- =============================================================================

-- ---------- 1. Utilisateurs démo (auth.users) ----------
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000000', 'e0000001-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
   'admin@vayeko.example', crypt('Password123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Administratrice Vayeko"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e0000002-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
   'marchand@vayeko.example', crypt('Password123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Aïcha Mensah"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e0000003-0000-4000-8000-000000000003', 'authenticated', 'authenticated',
   'prestataire@vayeko.example', crypt('Password123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Kodjo Agbeko"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e0000004-0000-4000-8000-000000000004', 'authenticated', 'authenticated',
   'cliente@vayeko.example', crypt('Password123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Afi Dossou"}', now(), now())
on conflict (id) do nothing;

-- ---------- 2. Rôles/compléments des profils (créés par le trigger) ----------
update public.profiles set role = 'admin', username = 'admin' where id = 'e0000001-0000-4000-8000-000000000001';
update public.profiles set role = 'merchant', username = 'aicha.wax', whatsapp = '+228 90 00 00 21'
  where id = 'e0000002-0000-4000-8000-000000000002';
update public.profiles set role = 'provider', username = 'kodjo.services', whatsapp = '+228 90 00 00 13'
  where id = 'e0000003-0000-4000-8000-000000000003';

-- ---------- 3. Géographie ----------
insert into public.cities (id, name, region, latitude, longitude) values
  ('c0000001-0000-4000-8000-000000000001', 'Lomé', 'Maritime', 6.13, 1.22),
  ('c0000002-0000-4000-8000-000000000002', 'Tsévié', 'Maritime', 6.43, 1.21),
  ('c0000003-0000-4000-8000-000000000003', 'Kpalimé', 'Plateaux', 6.90, 0.63),
  ('c0000004-0000-4000-8000-000000000004', 'Atakpamé', 'Plateaux', 7.53, 1.13),
  ('c0000005-0000-4000-8000-000000000005', 'Sokodé', 'Centrale', 8.98, 1.13),
  ('c0000006-0000-4000-8000-000000000006', 'Kara', 'Kara', 9.55, 1.19),
  ('c0000007-0000-4000-8000-000000000007', 'Dapaong', 'Savanes', 10.86, 0.21)
on conflict (id) do nothing;

insert into public.neighborhoods (city_id, name) values
  ('c0000001-0000-4000-8000-000000000001', 'Tokoin'),
  ('c0000001-0000-4000-8000-000000000001', 'Bè'),
  ('c0000001-0000-4000-8000-000000000001', 'Adidogomé'),
  ('c0000001-0000-4000-8000-000000000001', 'Agoè'),
  ('c0000006-0000-4000-8000-000000000006', 'Tomdè'),
  ('c0000005-0000-4000-8000-000000000005', 'Centre-ville')
on conflict do nothing;

insert into public.locations (id, address_line, city_id, latitude, longitude) values
  ('d0000001-0000-4000-8000-000000000001', 'Grand marché, allée des tisserands', 'c0000001-0000-4000-8000-000000000001', 6.1319, 1.2228),
  ('d0000002-0000-4000-8000-000000000002', 'Quartier Bè-Kpota', 'c0000001-0000-4000-8000-000000000001', 6.1832, 1.2064),
  ('d0000003-0000-4000-8000-000000000003', 'Centre-ville, rue des commerçants', 'c0000002-0000-4000-8000-000000000002', 6.4262, 1.2132),
  ('d0000004-0000-4000-8000-000000000004', 'Marché central', 'c0000005-0000-4000-8000-000000000005', 8.9833, 1.1333)
on conflict (id) do nothing;

-- ---------- 4. Catégories ----------
insert into public.service_categories (id, name, slug, icon) values
  ('a0000001-0000-4000-8000-000000000001', 'Mécanique & Auto', 'mecanique-auto', 'wrench'),
  ('a0000002-0000-4000-8000-000000000002', 'Coiffure & Beauté', 'coiffure-beaute', 'scissors'),
  ('a0000003-0000-4000-8000-000000000003', 'Maison & Bricolage', 'maison-bricolage', 'home'),
  ('a0000004-0000-4000-8000-000000000004', 'Couture & Mode', 'couture-mode', 'needle'),
  ('a0000005-0000-4000-8000-000000000005', 'Informatique & Numérique', 'informatique-numerique', 'computer'),
  ('a0000006-0000-4000-8000-000000000006', 'Transport & Logistique', 'transport-logistique', 'truck')
on conflict (id) do nothing;

insert into public.product_categories (id, name, slug) values
  ('b0000001-0000-4000-8000-000000000001', 'Alimentation', 'alimentation'),
  ('b0000002-0000-4000-8000-000000000002', 'Mode & Pagne', 'mode-pagne'),
  ('b0000003-0000-4000-8000-000000000003', 'Fruits & Légumes', 'fruits-legumes'),
  ('b0000004-0000-4000-8000-000000000004', 'Cosmétique & Bien-être', 'cosmetique-bien-etre'),
  ('b0000005-0000-4000-8000-000000000005', 'Artisanat', 'artisanat')
on conflict (id) do nothing;

-- ---------- 5. Commerces (le trigger ajoute les propriétaires comme membres) ----------
insert into public.businesses (id, owner_id, name, slug, type, description, phone, whatsapp, location_id, status) values
  ('b1000001-0000-4000-8000-000000000001', 'e0000002-0000-4000-8000-000000000002',
   'Aïcha Wax & Tissus', 'boutique-aicha-wax-tissus', 'shop',
   'Pagnes wax authentiques, bazins et accessoires de couture au grand marché de Lomé.',
   '+228 90 00 00 21', '+228 90 00 00 21', 'd0000001-0000-4000-8000-000000000001', 'active'),
  ('b1000002-0000-4000-8000-000000000002', 'e0000002-0000-4000-8000-000000000002',
   'Marché Bio Améyo', 'marche-bio-ameyo', 'shop',
   'Fruits et légumes locaux de saison issus de petits producteurs togolais.',
   '+228 90 00 00 22', '+228 90 00 00 22', 'd0000002-0000-4000-8000-000000000002', 'active'),
  ('b1000003-0000-4000-8000-000000000003', 'e0000003-0000-4000-8000-000000000003',
   'Kodjo Services', 'kodjo-services', 'service',
   'Électricien professionnel : installations, dépannages et mises aux normes.',
   null, '+228 90 00 00 13', 'd0000003-0000-4000-8000-000000000003', 'active'),
  ('b1000004-0000-4000-8000-000000000004', 'e0000003-0000-4000-8000-000000000003',
   'Salon Belle Ébène', 'salon-belle-ebene', 'service',
   'Coiffure femme et homme, tresses, soins capillaires et manucure à Sokodé.',
   '+228 90 00 00 12', '+228 90 00 00 12', 'd0000004-0000-4000-8000-000000000004', 'pending')
on conflict (id) do nothing;

insert into public.shops (id, business_id, name, slug, description, location_id, status) values
  ('f1000001-0000-4000-8000-000000000001', 'b1000001-0000-4000-8000-000000000001',
   'Aïcha Wax & Tissus', 'boutique-aicha-wax-tissus',
   'Pagnes wax authentiques, bazins et accessoires de couture au grand marché de Lomé.',
   'd0000001-0000-4000-8000-000000000001', 'active'),
  ('f1000002-0000-4000-8000-000000000002', 'b1000002-0000-4000-8000-000000000002',
   'Marché Bio Améyo', 'marche-bio-ameyo',
   'Fruits et légumes locaux de saison.',
   'd0000002-0000-4000-8000-000000000002', 'active')
on conflict (id) do nothing;

-- ---------- 6. Produits ----------
insert into public.products (id, shop_id, category_id, name, slug, description, price_cfa, available, stock, status) values
  ('d1000001-0000-4000-8000-000000000001', 'f1000002-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000001',
   'Arachide', 'arachide-bio-1kg', 'Arachide produite localement, vendue au kg.', 1500, true, 100, 'active'),
  ('d1000002-0000-4000-8000-000000000002', 'f1000001-0000-4000-8000-000000000001', 'b0000002-0000-4000-8000-000000000002',
   'Pagne wax', 'pagne-wax-6-metres', 'Vrai wax 6 mètres, motifs exclusifs.', 10000, true, 40, 'active'),
  ('d1000003-0000-4000-8000-000000000003', 'f1000002-0000-4000-8000-000000000002', 'b0000003-0000-4000-8000-000000000003',
   'Tomate', 'tomate-fraiche-1kg', 'Tomates fraîches du potager, le kg.', 800, true, 200, 'active'),
  ('d1000004-0000-4000-8000-000000000004', 'f1000002-0000-4000-8000-000000000002', 'b0000003-0000-4000-8000-000000000003',
   'Panier de légumes', 'panier-legumes-frais', 'Panier hebdomadaire de légumes de saison.', 2500, true, 30, 'active'),
  ('d1000005-0000-4000-8000-000000000005', 'f1000001-0000-4000-8000-000000000001', 'b0000002-0000-4000-8000-000000000002',
   'Bazin riche teinté', 'bazin-riche-teinte', 'Bazin riche premium, 5 mètres.', 8500, false, 0, 'active')
on conflict (id) do nothing;

insert into public.product_images (product_id, url, position) values
  ('d1000001-0000-4000-8000-000000000001', '/images/produits/arachide.jpg', 0),
  ('d1000002-0000-4000-8000-000000000002', '/images/produits/pagne-wax.jpg', 0),
  ('d1000003-0000-4000-8000-000000000003', '/images/produits/tomate.jpg', 0),
  ('d1000004-0000-4000-8000-000000000004', '/images/categories/prix.jpg', 0)
on conflict do nothing;

-- ---------- 7. Services ----------
insert into public.services (id, business_id, category_id, name, slug, description, price_cfa, rate_type, phone, whatsapp, opening_hours, location_id, status) values
  ('a1000003-0000-4000-8000-000000000003', 'b1000003-0000-4000-8000-000000000003', 'a0000003-0000-4000-8000-000000000003',
   'Électricité Pro Kodjo', 'electricite-pro-kodjo',
   'Installation et dépannage électrique pour maisons et commerces. Devis gratuit, pièces de qualité garanties.',
   null, 'quote', null, '+228 90 00 00 13',
   '{"mon":"07:30 – 17:30","tue":"07:30 – 17:30","wed":"07:30 – 17:30","sat":"08:00 – 13:00"}'::jsonb,
   'd0000003-0000-4000-8000-000000000003', 'active'),
  ('a1000002-0000-4000-8000-000000000002', 'b1000004-0000-4000-8000-000000000004', 'a0000002-0000-4000-8000-000000000002',
   'Salon Belle Ébène', 'salon-belle-ebene',
   'Coiffure femme et homme, tresses, tissage, soins capillaires et manucure. Sur rendez-vous ou sans.',
   3000, 'from', '+228 90 00 00 12', '+228 90 00 00 12',
   '{"mon":"09:00 – 19:00","wed":"09:00 – 19:00","fri":"09:00 – 19:00","sun":"10:00 – 16:00"}'::jsonb,
   'd0000004-0000-4000-8000-000000000004', 'active')
on conflict (id) do nothing;

insert into public.service_providers (business_id, service_category_id, experience_years, certified) values
  ('b1000003-0000-4000-8000-000000000003', 'a0000003-0000-4000-8000-000000000003', 8, true),
  ('b1000004-0000-4000-8000-000000000004', 'a0000002-0000-4000-8000-000000000002', 6, false)
on conflict do nothing;

-- ---------- 8. Avis ----------
insert into public.reviews (author_id, target, business_id, product_id, service_id, rating, comment, status) values
  ('e0000001-0000-4000-8000-000000000001', 'business', 'b1000001-0000-4000-8000-000000000001', null, null,
   5, 'Pagnes magnifiques et accueil très chaleureux. Je recommande !', 'published'),
  ('e0000004-0000-4000-8000-000000000004', 'product', null, 'd1000003-0000-4000-8000-000000000003', null,
   4, 'Tomates bien mûres, livrées à temps. Petit point de prolongation possible sur l’affichage des stocks.', 'published'),
  ('e0000004-0000-4000-8000-000000000004', 'service', null, null, 'a1000003-0000-4000-8000-000000000003',
   5, 'Kodjo est intervenu le jour même. Travail propre et facture conforme au devis.', 'published'),
  ('e0000002-0000-4000-8000-000000000002', 'service', null, null, 'a1000002-0000-4000-8000-000000000002',
   5, 'Tresses parfaites, le salon est accueillant et propre.', 'published')
on conflict do nothing;

-- ---------- 9. Favoris ----------
insert into public.favorites (profile_id, target, business_id, product_id, service_id) values
  ('e0000004-0000-4000-8000-000000000004', 'business', 'b1000001-0000-4000-8000-000000000001', null, null),
  ('e0000004-0000-4000-8000-000000000004', 'product', null, 'd1000002-0000-4000-8000-000000000002', null)
on conflict do nothing;

-- ---------- 10. Un signalement ouvert (pour la démo admin) ----------
insert into public.reports (reporter_id, target, product_id, reason, details, status) values
  ('e0000004-0000-4000-8000-000000000004', 'product', 'd1000005-0000-4000-8000-000000000004',
   'Prix incohérent', 'Le prix affiché ne correspond pas à celui annoncé sur WhatsApp.', 'open')
on conflict do nothing;
