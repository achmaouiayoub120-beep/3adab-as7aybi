@echo off
chcp 65001 >nul
color 0a

echo ====================================================
echo        🚀 LANCEMENT DU PROJET BOTOLATICKETS 🚀
echo ====================================================
echo.
echo Verification des dependances en cours...
echo.

IF NOT EXIST "node_modules" (
    echo [FRONTEND] Installation des dependances...
    npm install
)

IF NOT EXIST "backend\node_modules" (
    echo [BACKEND] Installation des dependances...
    cd backend
    npm install
    cd ..
)

echo.
echo ====================================================
echo        ✅ PRET POUR LE DEMARRAGE ! ✅
echo ====================================================
echo.

echo Demarrage du Backend sur port 4000...
start "BOTOLA BACKEND" cmd /k "cd backend && npm run dev"

timeout /t 3 >nul

echo Demarrage du Frontend Vite...
start "BOTOLA FRONTEND" cmd /k "npm run dev"

echo.
echo Le projet BotolaTickets est en cours d'execution !
echo Fermez cette fenetre pour tout arreter (ou fermez les deux consoles).
pause
