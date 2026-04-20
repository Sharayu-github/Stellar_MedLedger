#!/bin/bash

# MedLedger Setup Script
# Automated setup for the MedLedger Healthcare Record Verification Platform

echo "🏥 MedLedger - Healthcare Record Verification Platform Setup"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "Installing backend dependencies..."
cd backend && npm install && cd ..

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create environment files if they don't exist
echo ""
echo "⚙️  Setting up environment configuration..."

if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cat > .env << EOL
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_FREIGHTER_ENABLED=true
VITE_APP_NAME=MedLedger
VITE_APP_VERSION=1.0.0
EOL
    echo "✅ Frontend .env created"
else
    echo "✅ Frontend .env already exists"
fi

if [ ! -f backend/.env ]; then
    echo "Creating backend .env file..."
    cat > backend/.env << EOL
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
JWT_SECRET=medledger_jwt_secret_change_in_production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOL
    echo "✅ Backend .env created"
else
    echo "✅ Backend .env already exists"
fi

# Setup complete
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start the MedLedger platform:"
echo "   npm run dev"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   API:      http://localhost:5000/api"
echo ""
echo "👛 Wallet Options:"
echo "   • Install Freighter wallet: https://www.freighter.app/"
echo "   • Or use TEST MODE (automatic fallback)"
echo ""
echo "📚 Documentation:"
echo "   • README.md - Setup and usage guide"
echo "   • FEATURES.md - Complete feature list"
echo "   • PROJECT_OVERVIEW.md - Technical architecture"
echo "   • DEPLOYMENT.md - Production deployment guide"
echo ""
echo "🏥 Ready to secure healthcare records with blockchain technology!"