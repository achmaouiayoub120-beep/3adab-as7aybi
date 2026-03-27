# Architecture Technique - BotolaTickets

Ce projet PFE adopte une architecture moderne et modulaire, séparant clairement les responsabilités Frontend et Backend.

## Stack Technologique

### 1. Frontend (Interface Utilisateur)
- **Framework** : React 18 avec TypeScript
- **Build Tool** : Vite (SWC pour une compilation ultra-rapide)
- **Design System** : Tailwind CSS + shadcn/ui pour les composants
- **Animations** : Framer Motion (Glassmorphism, Micro-interactions)
- **State Management & Fetching** : TanStack Query (React Query)
- **Routage** : React Router DOM v6
- **Génération PDF** : jsPDF + QRCode.react

### 2. Backend (API REST)
- **Environnement** : Node.js
- **Framework** : Express.js
- **Base de données** : SQLite (via Prisma ORM)
- **Sécurité** : 
  - JWT (JSON Web Tokens) pour l'authentification state-less
  - bcryptjs pour le hachage des mots de passe
  - Zod pour la validation stricte des payloads entrants
- **CORS & Middlewares** : Express CORS, ErrorHandler centralisé

---

## Modèle de Sécurité (Guards)

L'application utilise un système de protection des routes (AuthGuards) basé sur le rôle côté Frontend et des middlewares côté Backend.

*   `authenticate` (Middleware Express) : Décrypte le JWT, attache le `userId` à la requête.
*   `requireAdmin` (Middleware Express) : Vérifie que le `role` de l'utilisateur est `ADMIN`.
*   `AuthGuard` (React) : Redirige vers `/login` si non authentifié.
*   `AdminGuard` (React) : Redirige vers `/` (Home) si l'utilisateur connecté n'est pas Administrateur.
