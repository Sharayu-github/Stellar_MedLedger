@echo off
REM MedLedger Setup Script for Windows
REM Automated setup for the MedLedger Healthcare Record Verification Platform

echo 🏥 MedLedger - Healthcare Record Verification Platform Setup
echo ==========================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm detected
npm --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...
echo Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend
call npm install
cd ..

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Create environment files if they don't exist
echo.
echo ⚙️  Setting up environment configuration...

if not exist .env (
    echo Creating frontend .env file...
    (
        echo VITE_API_BASE_URL=http://localhost:5000/api
        echo VITE_STELLAR_NETWORK=testnet
        echo VITE_HORIZON_URL=https://horizon-testnet.stellar.org
        echo VITE_FREIGHTER_ENABLED=true
        echo VITE_APP_NAME=MedLedger
        echo VITE_APP_VERSION=1.0.0
    ) > .env
    echo ✅ Frontend .env created
) else (
    echo ✅ Frontend .env already exists
)

if not exist backend\.env (
    echo Creating backend .env file...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo FRONTEND_URL=http://localhost:5173
        echo STELLAR_NETWORK=testnet
        echo STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
        echo JWT_SECRET=medledger_jwt_secret_change_in_production
        echo RATE_LIMIT_WINDOW_MS=900000
        echo RATE_LIMIT_MAX_REQUESTS=100
    ) > backend\.env
    echo ✅ Backend .env created
) else (
    echo ✅ Backend .env already exists
)

REM Setup complete
echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo 🚀 To start the MedLedger platform:
echo    npm run dev
echo.
echo 🌐 Access URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo    API:      http://localhost:5000/api
echo.
echo 👛 Wallet Options:
echo    • Install Freighter wallet: https://www.freighter.app/
echo    • Or use TEST MODE (automatic fallback)
echo.
echo 📚 Documentation:
echo    • README.md - Setup and usage guide
echo    • FEATURES.md - Complete feature list
echo    • PROJECT_OVERVIEW.md - Technical architecture
echo    • DEPLOYMENT.md - Production deployment guide
echo.
echo 🏥 Ready to secure healthcare records with blockchain technology!
echo.
pause