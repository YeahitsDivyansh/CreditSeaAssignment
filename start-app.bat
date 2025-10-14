@echo off
echo 🚀 Starting CreditSea Application...
echo.

echo 📦 Starting backend server...
start "CreditSea Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo 📦 Starting frontend server...
start "CreditSea Frontend" cmd /k "cd client && npm run dev"

echo.
echo 🎉 CreditSea Application is starting up!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:5000
echo ❤️  Health Check: http://localhost:5000/health
echo.
echo 📝 Sample XML files are available in server/sample-data/
echo.
echo Press any key to exit...
pause >nul
