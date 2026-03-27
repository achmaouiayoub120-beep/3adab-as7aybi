# Diagrammes UML et Conception - BotolaTickets

Ce document détaille l'architecture des données sous forme de diagrammes relationnels (Entity Relationship Diagrams) générés via syntaxe Mermaid.

## Schéma de Base de Données (Modèle Relationnel Prisma)

```mermaid
erDiagram
    User {
        int id PK
        string email
        string password
        string firstName
        string lastName
        string phone
        string role "ADMIN | USER"
        boolean isActive
    }

    Stadium {
        int id PK
        string name
        string city
        int capacity
        string imageUrl
        string description
        string locationUrl
    }

    Team {
        int id PK
        string name
        string shortName
        string city
        string color1
        string color2
        string logoUrl
        int stadiumId FK
    }

    Match {
        int id PK
        int homeTeamId FK
        int awayTeamId FK
        int stadiumId FK
        datetime date
        int matchday
        int priceVip
        int priceTribune
        int pricePopulaire
        int seatsTotal
        int seatsAvailable
        int seatsVip
        int seatsTribune
        int seatsPopulaire
        string status "SCHEDULED | ONGOING | FINISHED | CANCELLED"
    }

    Reservation {
        int id PK
        string userId FK
        int matchId FK
        string zone "VIP | Tribune | Populaire"
        int quantity
        float totalPrice
        string status "PENDING | CONFIRMED | CANCELLED"
        string paymentIntentId
    }

    Ticket {
        int id PK
        string ticketCode "UUID"
        int reservationId FK
        boolean isUsed
        datetime usedAt
    }

    AuditLog {
        int id PK
        string adminId FK
        string action
        string targetType "USER | MATCH | RESERVATION"
        string targetId
        json details
    }

    %% Relations
    Stadium ||--o{ Team : "héberge"
    Stadium ||--o{ Match : "accueille"
    Team ||--o{ Match : "joue à domicile"
    Team ||--o{ Match : "joue à l'extérieur"
    User ||--o{ Reservation : "effectue"
    Match ||--o{ Reservation : "réservé pour"
    Reservation ||--|{ Ticket : "génère"
    User ||--o{ AuditLog : "enregistre (si ADMIN)"
```

## Cycle de Vie d'une Réservation (Flux de Données)

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Base de Données (Prisma)

    U->>F: Sélectionne un match et une zone
    F->>B: GET /api/matches/:id (Vérifie dispo)
    B->>DB: SELECT * FROM Match
    DB-->>B: Retourne MatchData
    B-->>F: Disponibilité OK
    U->>F: Soumet Réservation (x billets)
    F->>B: POST /api/reservations/create
    B->>DB: Démarre Transaction
    DB->>DB: UPDATE Match SET seats...
    DB->>DB: INSERT Reservation
    DB->>DB: INSERT x Tickets (QR UUID)
    B-->>F: Transaction OK (Reservation ID)
    U->>F: Accède au Dashboard
    F->>B: GET /api/reservations/mine
    B-->>F: Retourne Billets
    F->>U: Affiche code QR scannable
```
