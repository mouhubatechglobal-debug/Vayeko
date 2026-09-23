# Vayeko — Le Togo à portée de main 🇹🇬

**Vayeko** est une plateforme numérique locale tout-en-un qui centralise les services, commerces, produits, professionnels, logements, emplois, opportunités étudiantes et annonces disponibles au Togo.

> Slogan officiel : « Le Togo à portée de main. »

Aujourd'hui, l'information locale est dispersée entre WhatsApp, Facebook, groupes communautaires, boutiques physiques et bouche-à-oreille. Vayeko réunit tout dans une seule plateforme.

---

## 🎯 Vision

Permettre à toute personne au Togo de passer progressivement de :

**RECHERCHE → DÉCOUVERTE → COMPARAISON → CHOIX → CONTACT / COMMANDE / RÉSERVATION → SUIVI → AVIS**

### Villes ciblées (phase 1)
- Lomé
- Sokodé
- Kara
- Atakpamé
- Kpalimé
- Dapaong

- Langue principale : Français
- Monnaie : FCFA
- Identité : blanc/crème base, vert #0E9F6E, jaune #FFB800, rouge, turquoise, violet, motifs africains subtils

---

## 👥 Rôles

- `USER` : client classique
- `SELLER` : vendeur boutique
- `PROFESSIONAL` : prestataire services
- `REAL_ESTATE_AGENT` : immobilier
- `RECRUITER` : emploi
- `ADMIN` : administration

Un même compte peut avoir plusieurs rôles (ex: USER + SELLER). Permissions vérifiées côté serveur + RLS.

---

## ✨ Fonctionnalités implémentées

### 🔍 Recherche globale
- Texte, catégorie, ville, quartier, prix, disponibilité, type, statut, tri, pagination
- Retourne produits, boutiques, services, pros, logements, emplois, annonces, campus
- Exemple : « téléphone Samsung » → produits + boutiques + prix + localisation

### 🛍️ Boutiques & Produits
- Création boutique (nom, logo, couverture, description, catégorie, ville, quartier, téléphone, WhatsApp, email, horaires)
- Produits (nom, description, catégorie, prix, ancien prix, images, stock, variantes, livraison/retrait, date maj)
- Page produit avec prix, vendeur, dispo, localisation, date maj, contact

### 💰 Comparateur de prix
- Comparaison prix / vendeur / boutique / localisation / dispo / date maj
- Jamais présenter ancien prix comme prix actuel vérifié
- Date de mise à jour visible

### 🔧 Services & Professionnels
- Page publique pro (logo, couverture, nom, description, catégorie, localisation, téléphone, WhatsApp, email, horaires, ouvert/fermé, services, photos, avis, note)
- Boutons : Contacter, WhatsApp, Réserver, Demander infos

### 📦 Commandes
- Statuts : NEW → CONFIRMED → PREPARING → READY → DELIVERED → COMPLETED → CANCELLED
- Suivi + historique statuts conservé
- Vendeur modifie statut selon permissions

### 📅 Réservations
- Calendrier, disponibilités, créneaux
- Client demande → Pro CONFIRME / REFUSE / MODIFIE
- Notifications

### 🏠 Immobilier
- Maisons, appartements, terrains, bureaux, locaux
- Filtres : ville, quartier, prix, type, pièces, superficie, dispo

### 💼 Emploi
- Offres avec entreprise, description, compétences, localisation, type contrat, dates

### 🎓 Campus
- Logements étudiants, stages, formations, événements, opportunités, annonces étudiantes

### 📢 Annonces
- Électronique, véhicules, maison, vêtements, services, matériel, emploi, autres

### ❤️ Favoris
- Produits, boutiques, services, logements, emplois, annonces — privé par utilisateur

### ⭐ Avis
- Note + commentaire + utilisateur + objet + date
- Moyenne, distribution, commentaires, réponse pro, signalement

### 💬 WhatsApp
- Boutons « Contacter sur WhatsApp », « Commander sur WhatsApp », message prérempli
- Ouverture déclenchée par utilisateur uniquement

### 📊 Dashboards
- Vendeur/pro : créer activité, gérer profil, produits, services, dispos, commandes, réservations, avis, stats, revenus
- Admin : gestion utilisateurs, vendeurs, pros, produits, services, commandes, réservations, immobilier, emplois, campus, annonces, avis, signalements, transactions, paramètres — actions auditées

### 🔔 Notifications
- Nouvelle commande, changement commande, réservation, changement réservation, message, avis, activité compte

---

## 🏗️ Architecture technique

- **Frontend** : Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend** : API Routes Next.js (prêt pour Prisma)
- **Base de données** : Prisma ORM + SQLite (dev) / PostgreSQL (prod) — schéma complet dans `prisma/schema.prisma`
- **Auth** : Mock auth localStorage pour MVP (prod: NextAuth + JWT httpOnly + bcrypt)
- **Design** : Mobile-first, responsive 360px → 1440px, cartes modernes, coins arrondis, ombres légères, african-pattern subtil
- **Sécurité** : Permissions serveur, RLS, favoris privés, audit logs, prix avec date maj

### Schéma Prisma (extrait)
- User, UserRole, Shop, Product, ProfessionalProfile, Service, Property, JobOffer, CampusPost, Listing, Order, OrderItem, OrderStatusHistory, Reservation, Favorite, Review, Notification, AuditLog

Voir `prisma/schema.prisma` pour le schéma complet.

---

## 🚀 Lancer le projet

```bash
npm install
npm run dev
# http://localhost:3000
```

Build prod :
```bash
npm run build
npm start
```

Prisma (quand réseau disponible) :
```bash
npx prisma generate
npx prisma db push
npx prisma studio
```

---

## 🔑 Comptes démo

- Client : `client@vayeko.tg` / `client123`
- Vendeur : `vendeur@vayeko.tg` / `vendeur123`
- Professionnel : `pro@vayeko.tg` / `pro123`
- Admin : `admin@vayeko.tg` / `admin123`

---

## 📱 Pages principales

- `/` : Accueil (Hero, catégories, produits populaires, services, immobilier, emploi, campus, annonces, comparateur, CTA vendeur)
- `/recherche?q=&ville=` : Recherche globale avec filtres
- `/produits/[id]` : Détail produit + comparateur + avis + boutique
- `/boutiques` & `/boutiques/[id]` : Liste + détail boutique
- `/services` & `/services/[id]` : Services + réservation
- `/immobilier` & `/immobilier/[id]` : Immobilier
- `/emploi` & `/emploi/[id]` : Emploi
- `/campus` : Campus
- `/annonces` & `/annonces/[id]` : Annonces
- `/comparateur` : Comparateur prix avec date maj
- `/favoris` : Favoris privés
- `/commandes` : Suivi commandes + historique statuts
- `/reservations` : Réservations avec workflow CONFIRMER/REFUSER/MODIFIER
- `/dashboard` : Dashboard vendeur/pro (stats, produits, commandes, activité)
- `/profil` : Profil + création activité (Boutique, Service, Immobilier, Emploi...)
- `/admin` : Admin (utilisateurs, boutiques, commandes, audit, sécurité)
- `/auth/login` & `/auth/register` : Auth

---

## 🎨 Identité visuelle Vayeko

Conservée et étendue :

- Base : #FFFEFB (blanc chaud) / #FFFBEB (crème)
- Vert principal : #0E9F6E (confiance, Togo)
- Jaune : #FFB800 (énergie)
- Rouge : #E11D48 (alertes)
- Turquoise : #06B6D4 (immobilier)
- Violet : #7C3AED (campus)
- Typo : Inter / système, lisible
- Composants : rounded-full / rounded-[20px], ombres douces, glass, motifs africains radiaux subtils

---

## 🔒 Sécurité & bonnes pratiques

- Permissions jamais uniquement UI — vérif serveur + RLS
- Favoris privés par user (unique constraint)
- Prix : ancien prix jamais présenté comme prix actuel vérifié — date maj visible
- WhatsApp : message prérempli mais envoi déclenché par utilisateur
- AuditLog pour actions admin
- OrderStatusHistory conservé
- Notifications pour changements importants

---

## 📦 Prochaines étapes prod

- [ ] Migrer auth mock → NextAuth + JWT httpOnly + bcrypt + Prisma
- [ ] Activer Prisma (generate + db push) + seed données Togo réelles
- [ ] Upload images (S3 / Cloudinary)
- [ ] Paiement Flooz / TMoney / Cash
- [ ] Realtime notifications (WebSocket / Pusher)
- [ ] PWA + offline
- [ ] Tests e2e responsive 360/390/430/768/1024/1280/1440

---

## 📄 Licence

Projet privé Vayeko — Tous droits réservés. Fait avec ❤️ au Togo 🇹🇬
