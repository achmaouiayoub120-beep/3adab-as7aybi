# Référence de l'API REST BotolaTickets

Le backend expose ses données via une API REST sous l'URL de base `/api`. L'authentification utilise le protocole `Bearer Token (JWT)`.

## 1. Moteur d'Authentification (`/auth`)

| Méthode | Endpoint       | Description | Authentification requise |
|---------|----------------|-------------|----------------------------|
| POST    | `/register`    | Crée un nouveau compte utilisateur `role: 'USER'` | Non |
| POST    | `/login`       | Authentifie et retourne un token JWT local | Non |
| GET     | `/me`          | Formate et retourne l'utilisateur courant + ses ID | Oui (USER) |

## 2. Accès Publics (`/matches`, `/teams`, `/stadiums`)

| Méthode | Endpoint       | Description | Authentification requise |
|---------|----------------|-------------|----------------|
| GET     | `/matches`     | Liste tous les matchs avec équipes liées | Non |
| GET     | `/matches/:id` | Détails d'un match (Disponibilité des places) | Non |
| GET     | `/teams`       | Liste des équipes du championnat et stades | Non |
| GET     | `/stadiums`    | Liste des infrastructures sportives | Non |

## 3. Plateforme Réservation (`/reservations`)

| Méthode | Endpoint       | Description | Authentification requise |
|---------|----------------|-------------|----------------|
| GET     | `/mine`        | Historique et billets actifs de l'utilisateur courant | Oui (USER) |
| POST    | `/create`      | Génère une transaction (Réservation + M.A.J des places restantes) | Oui (USER) |
| GET     | `/:id`         | Récupère la réservation et ses tickets via son ID | Oui (Propriétaire) |

## 4. Administration Sécurisée (`/admin`)

Toutes les requêtes d'administration nécessitent un token appartenant à un compte identifié comme `role: 'ADMIN'` via le Middleware `requireAdmin`.

| Méthode | Endpoint       | Description |
|---------|----------------|-------------|
| GET     | `/analytics`   | Retourne des agrégats mathématiques (CA, ventes, KPIs interactifs du Dashboard Frontend) |
| GET     | `/users`       | Liste structurée de l'ensemble de la base utilisateurs |
| PUT     | `/users/:id/toggle` | Bloque / Débloque le compte utilisateur désigné |
| POST    | `/validate-ticket/:code` | (Scanner PFE) Marque dynamiquement un Entry Pass (code unique UUID) comme `'isUsed': true` |

> *Les blocs CRUD (Create/Update/Delete) pour les Equipes, Matchs et Stades sont également implémentés en mode Admin sous `/admin/matches/create`, etc.*
