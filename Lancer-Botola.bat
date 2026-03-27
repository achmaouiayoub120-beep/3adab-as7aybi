@echo off
chcp 65001 >nul
title Lancement de la plateforme BotolaTickets
color 0B

echo ========================================================
echo        BOTOLA TICKETS - INITIALISATION DU PROJET
echo ========================================================
echo.

echo [1/4] Preparation du Backend...
cd backend
echo - Installation des dependances...
call npm install --silent

echo - Configuration de la Base de Donnees Prisma...
call npx prisma generate
call npx prisma db push --accept-data-loss
echo - Injection des donnees de test (Equipes, Matchs, Stades)...
call npx tsx prisma/seed.ts

echo.
echo [2/4] Lancement du Serveur Backend (Port 4000)...
start "BOTOLA BACKEND (API)" cmd /k "npx tsx src/server.ts"

echo.
echo [3/4] Preparation du Frontend...
cd ..
echo - Installation des dependances...
call npm install --silent

echo.
echo [4/4] Lancement de l'Interface Web (Port 8090)...
start "BOTOLA FRONTEND (React)" cmd /k "npm run dev"

echo.
echo ========================================================
echo.
echo    TOUT EST EXCLLENT ! 
echo    L'API tourne sur http://localhost:4000
echo    Le Site tourne sur http://localhost:8090
echo.
echo    Comptes de test (Mot de passe : Admin2026! / User2026!)
echo    - admin@botola.ma (Acces a /admin)
echo    - user@botola.ma  (Acces au Dashboard Client)
echo.
echo    Laissez les deux fenetres noires ouvertes pendant 
echo    votre utilisation du site.
echo ========================================================
echo.
pause
