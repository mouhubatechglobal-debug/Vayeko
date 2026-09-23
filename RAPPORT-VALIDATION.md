# Rapport de validation — Vayeko V1

Date : 2026-09-20 — Livraison : `Vayeko-V1.zip`

## 1. Checklist des 19 points

| # | Vérification | Résultat |
|---|--------------|----------|
| 1 | Installation des dépendances (`npm install`) | ✅ |
| 2 | Vérification TypeScript (`npx tsc --noEmit`) | ✅ 0 erreur |
| 3 | ESLint (`npm run lint`) | ✅ 0 erreur, 0 avertissement |
| 4 | Tests unitaires Vitest (`npx vitest run`) | ✅ 41/41 (validations Zod, WhatsApp, permissions, utilitaires) |
| 5 | Tests E2E Playwright (Chromium + Mobile Chrome) | ✅ 20/20 |
| 6 | Build de production (`npm run build`) | ✅ 16 pages statiques + routes d'API/fiches dynamiques |
| 7 | Routes vérifiées en production (`next start` + requêtes réelles) | ✅ toutes les pages publiques → 200, routes protégées → redirection `/connexion`, slug invalide → 404 |
| 8 | Authentification | ✅ inscription, connexion, déconnexion, récupération de mot de passe, `/auth/callback`, middleware de session |
| 9 | Permissions / RBAC | ✅ `lib/permissions.ts` testé unitairement ; `/admin`, `/dashboard`, `/profil` protégés par middleware |
| 10 | RLS | ✅ politiques RLS complètes dans `supabase/migrations/004_rls.sql` (propriétaire, public, admin) — à exécuter sur votre instance |
| 11 | Formulaires | ✅ validation Zod côté serveur + côté client, messages d'erreur clairs, pas d'erreurs sensibles exposées |
| 12 | APIs | ✅ `/api/services`, `/api/produits`, `/api/boutiques`, `/api/utilisateurs` — validation Zod, pagination, slugs dérivés |
| 13 | Responsive | ✅ test E2E à 320 px sans débordement horizontal ; layouts mobile-first |
| 14 | Images & logo | ✅ logo officiel fourni, toutes les images vérifiées (PNG/JPEG réels) |
| 15 | Aucun secret dans le code | ✅ audit par recherche de motifs — aucune clé ; `.env.example` = noms de variables uniquement ; `.env.local` dans `.gitignore` |
| 16 | Numéros WhatsApp | ✅ `lib/whatsapp.ts` sanitise et reconstruit les liens `wa.me` — jamais d'URL fournie par l'utilisateur, jamais de `javascript:` |
| 17 | Sauvegardes sûres (soft delete) | ✅ colonnes `deleted_at`/`is_active`, politiques RLS d'exclusion |
| 18 | Données de démo | ✅ `supabase/seed.sql` (comptes, boutiques, produits, services, catégories, villes) — 100 % fictives |
| 19 | Rebuild final après corrections | ✅ build de production régénéré et re-testé |

## 2. Stack conforme

- Next.js 15 App Router + React + TypeScript strict + Tailwind CSS 3 (aucune classe inline privilégiée vs design system, `globals.css` pour les styles globaux).
- Route Handlers Next.js pour l'API ; aucun PHP, aucun HTML statique autonome.
- PostgreSQL via Supabase (Auth, Storage, PostGIS paramétré dans les migrations).
- Migration 001 → 005 ordonnées : types/colonnes de base → clés/contraintes → index/PostGIS/Storage → RLS → vues/audit/déclencheurs.
- Zod côté serveur sur toutes les entrées ; clé service-role utilisée uniquement en serveur.
- Vitest + Playwright ; configuration Playwright avec `webServer` automatisé.

## 3. Éléments volontairement hors V1 (périmètre)

Paiement en ligne, livraison, messagerie interne, réservation complexe, IA — **absents de la V1**, architecture prête (tables `orders`, rôles granulaires, audit).

## 4. Mode démo

Sans clés Supabase valides, l'application fonctionne avec un jeu de données de démonstration en mémoire (recherche, catalogues, fiches). Le middleware redirige alors les zones privées vers `/connexion?mode=demo`. Les zones d'écriture affichent un message explicite « mode démo ». Rien n'est présenté comme « connecté » s'il ne l'est pas.

## 5. Déploiement

Voir `README.md` : Vercel + variables d'environnement, ou Docker-natif Node 18+. Le serveur de tests (`npm run start`) a fonctionné sur `0.0.0.0:3000` pendant l'audit.
