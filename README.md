# Vayeko V1 — Le Togo à portée de main

Plateforme locale togolaise : recherche de **services**, découverte de **boutiques** et
consultation de **produits** avec contact direct **WhatsApp** — sans paiement en ligne
ni livraison en V1 (l'architecture reste prête pour la V2).

![Logo Vayeko](public/logos/vayeko-logo.png)

---

## Stack

| Domaine | Choix |
|---|---|
| Front-end | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Back-end | Next.js Route Handlers + Server Actions (TypeScript) |
| Base de données | PostgreSQL via Supabase (PostGIS pour la géolocalisation) |
| Auth / Storage | Supabase Auth / Supabase Storage (3 buckets RLS) |
| Validation | Zod (client + serveur) |
| Tests | Vitest (unitaires) · Playwright (E2E Desktop + Mobile) |
| Sécurité | RLS partout, RBAC, middleware de session, audit logs |

**Aucun secret côté client** : seules `NEXT_PUBLIC_*` sont exposées au navigateur ;
la clé `SUPABASE_SERVICE_ROLE_KEY` n'est utilisée que dans les server actions/route handlers.

---

## 1 · Installation

```bash
git clone <votre-repo> Vayeko
cd Vayeko
npm install
```

Prérequis : **Node.js ≥ 18.18** (Node 20+ recommandé).

## 2 · Configuration (variables d'environnement)

```bash
cp .env.example .env.local
```

Renseignez dans `.env.local` (jamais commité, voir `.gitignore`) :

| Variable | Usage | Côté |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé `anon` publique (protégée par les RLS) | public |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (ex. `http://localhost:3000`) | public |
| `NEXT_PUBLIC_WHATSAPP_COUNTRY_CODE` | code pays défaut (`228` = Togo) | public |
| `SUPABASE_SERVICE_ROLE_KEY` | clé `service_role` — **serveur uniquement**, jamais dans le navigateur | serveur |

> 💡 **Sans `.env.local`**, l'application démarre quand même en **mode démonstration** :
> les pages publiques utilisent un jeu de données fictif local (`lib/demo-data.ts`),
> idéal pour prévisualiser le design.

## 3 · Créer le projet Supabase

1. Créez un projet sur [supabase.com](https://supabase.com) (région proche de l'Afrique
   de l'Ouest de préférence — l'extension **PostGIS** est activable dans *Database → Extensions*).
2. Dans *SQL Editor* (ou avec la CLI `supabase`), exécutez **dans l'ordre** :

```
supabase/migrations/001_initial.sql
supabase/migrations/002_users.sql
supabase/migrations/003_businesses.sql
supabase/migrations/004_products.sql
supabase/migrations/005_services.sql
supabase/migrations/006_storage.sql
```

3. Chargez les données de démonstration (comptes de test, boutiques, produits, avis) :

```bash
psql $SUPABASE_DB_URL -f supabase/seed.sql
```

4. Dans *Authentication → Providers* : activez **Email** ; désactivez « Confirm email »
   en développement si besoin ; ajoutez `http://localhost:3000/auth/callback` dans
   **Redirect URLs**.
5. Récupérez *Project URL*, `anon public key` et `service_role key` dans
   *Project Settings → API* et remplissez `.env.local`.

**Comptes de démonstration** (mot de passe : `Password123!`) :

| Rôle | Identifiant |
|---|---|
| Admin | `admin@vayeko.example` |
| Commerçant | `marchand@vayeko.example` |
| Prestataire | `prestataire@vayeko.example` |
| Utilisatrice | `cliente@vayeko.example` |

Avec la CLI locale (`supabase start`), la seed s'exécute automatiquement via
`supabase db reset`.

## 4 · Lancer en développement

```bash
npm run dev        # http://localhost:3000
```

## 5 · Qualité & vérifications

```bash
npm run typecheck  # vérification TypeScript stricte
npm run lint       # ESLint (next/core-web-vitals + typescript)
npm run test       # tests unitaires Vitest
npm run build      # build de production
npm run start      # serveur de production (port 3000)
```

Tests E2E (nécessitent Chromium une fois) :

```bash
npx playwright install --with-deps chromium
npm run build && npm run test:e2e
```

## 6 · Déploiement

- **Recommandé : Vercel**
  1. Poussez le repo sur GitHub.
  2. Importez le projet dans Vercel.
  3. Ajoutez les variables d'environnement dans *Settings → Environment Variables*.
  4. Déployez ; ajoutez `https://votre-domaine.td/auth/callback` aux *Redirect URLs* Supabase.
- Toute autre plateforme Node.js fonctionne (`npm run build && npm run start`).

## 7 · Architecture & sécurité (points clés)

- **RLS partout** : chaque table métier a des politiques PostgreSQL ; les API ne font
  jamais confiance au navigateur (session + Zod + RLS).
- **RBAC** : rôle stocké dans `profiles.role`, protégé contre l'auto-élévation par un
  trigger (`prevent_role_escalation`) — la route `/api/utilisateurs` ne reçoit jamais `role`.
- **Zones privées** : `middleware.ts` exige une session ; les layouts `/dashboard` et
  `/admin` revérifient le rôle **côté serveur** — impossible d'y accéder par l'URL.
- **WhatsApp sécurisé** (`lib/whatsapp.ts`) : aucun lien fourni par l'utilisateur n'est
  accepté ; le lien `wa.me` est toujours reconstruit à partir du numéro validé.
- **Uploads contrôlés** (migration 006) : buckets image-only, ≤ 5 Mo, dossier par
  utilisateur (`<uid>/...`).
- **Audit** : changements de statut tracés dans `audit_logs` (triggers) ; actions admin
  dans `admin_actions` avec détails JSON.
- **Suppression douce** (`deleted_at`) sur profils, entreprises, produits, services.
- **Performance** : pagination bornée (≤ 50), requêtes `count(head)`, index trigrammes
  pour la recherche, images locales optimisées, `React.cache` sur le profil courant.

### Écarts documentés par rapport au cahier des charges

- **Sections Prix / Immobilier / Emploi / Campus** : visibles sur l'accueil (comme la
  maquette) mais marquées _« Bientôt »_ — hors périmètre fonctionnel V1. La nav V1
  propose Accueil / Services / Boutiques / Produits.
- **Commandes (`orders`, `order_items`)** : schéma + RLS prêts pour la V2 ; aucune UI
  en V1 (le contact reste WhatsApp).
- **`service_providers`** : modélise les *qualifications* d'une entreprise par
  catégorie (expérience/certification), plus utile qu'une simple jointure.
- **Modération admin** implémentée en **Server Actions** (`app/admin/actions.ts`)
  plutôt qu'en routes REST : audit intégré et surface d'attaque réduite ; les routes
  REST publiques demandées (`/api/services`, `/api/produits`, `/api/boutiques`,
  `/api/utilisateurs`) existent toutes.
- Ajouts utiles à la structure : `lib/api.ts`, `lib/constants.ts`, `lib/demo-data.ts`,
  `lib/data.ts`, `app/actions.ts`, `app/auth/callback` (PKCE), pages légales
  (`/a-propos`, `/contact`, `/conditions`, `/confidentialite`).

## 8 · Arborescence

Voir la structure complète dans la mission — les écarts sont listés ci-dessus.
Points d'entrée :

- `app/` : pages (App Router), `layout.tsx`, `globals.css`, Route Handlers, Server Actions
- `components/` : `ui`, `layout`, `home`, `services`, `boutiques`, `dashboard`, `admin`, `auth`, `search`
- `lib/` : clients Supabase, auth, validations Zod, permissions, WhatsApp, accès données
- `supabase/migrations` + `supabase/seed.sql` : schéma, RLS, seed de démonstration
- `tests/unit` (Vitest) · `tests/e2e` (Playwright)

## 9 · Visuels de démonstration

- **Logo officiel** : extrait de l'image fournie par le client
  (`scripts/extract-logo.py` reproduit l'extraction ; sources dans `public/logos/`).
- **Photos d'illustration** (hero, catégories, produits démo) : visuels de démonstration
  générés pour la maquette — à remplacer par les vraies photos des commerces en production.

---

© 2026 Vayeko — V1. Bon développement ! 🇹🇬
