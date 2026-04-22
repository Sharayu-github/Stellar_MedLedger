#!/bin/bash

# MedLedger Smart Contract Deployment Script
# This script builds and deploys the MedLedger contract to Stellar testnet

set -e

echo "🏥 MedLedger Smart Contract Deployment"
echo "====================================="

# Check if soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo "❌ Soroban CLI not found. Please install it first:"
    echo "   cargo install --locked soroban-cli"
    exit 1
fi

# Build the contract
echo "🔨 Building contract..."
cargo build --target wasm32-unknown-unknown --release

# Check if build was successful
if [ ! -f "target/wasm32-unknown-unknown/release/medledger_contract.wasm" ]; then
    echo "❌ Build failed. WASM file not found."
    exit 1
fi

echo "✅ Contract built successfully"

# Configure network (testnet)
echo "🌐 Configuring Stellar testnet..."
soroban config network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" 2>/dev/null || true

# Check if identity exists, create if not
if ! soroban config identity ls | grep -q "medledger-deployer"; then
    echo "🔑 Creating deployment identity..."
    soroban config identity generate medledger-deployer
    
    echo "💰 Funding deployment account..."
    soroban config identity fund medledger-deployer --network testnet
    
    echo "⏳ Waiting for funding to complete..."
    sleep 5
fi

# Deploy the contract
echo "🚀 Deploying contract to testnet..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/medledger_contract.wasm \
  --source medledger-deployer \
  --network testnet)

echo "✅ Contract deployed successfully!"
echo "📋 Contract ID: $CONTRACT_ID"

# Get deployer address for initialization
DEPLOYER_ADDRESS=$(soroban config identity address medledger-deployer)

# Initialize the contract
echo "🔧 Initializing contract..."
soroban contract invoke \
  --id $CONTRACT_ID \
  --source medledger-deployer \
  --network testnet \
  -- initialize \
  --admin $DEPLOYER_ADDRESS

echo "✅ Contract initialized with admin: $DEPLOYER_ADDRESS"

# Save contract info
echo "💾 Saving deployment info..."
cat > deployment-info.json << EOF
{
  "contractId": "$CONTRACT_ID",
  "network": "testnet",
  "adminAddress": "$DEPLOYER_ADDRESS",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
EOF

echo "📄 Deployment info saved to deployment-info.json"

# Test basic functionality
echo "🧪 Testing basic contract functionality..."

# Test provider registration
echo "   Testing provider registration..."
soroban contract invoke \
  --id $CONTRACT_ID \
  --source medledger-deployer \
  --network testnet \
  -- register_provider \
  --provider $DEPLOYER_ADDRESS \
  --license_number "TEST123456" > /dev/null

# Test provider check
PROVIDER_REGISTERED=$(soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- is_provider_registered \
  --provider $DEPLOYER_ADDRESS)

if [ "$PROVIDER_REGISTERED" = "true" ]; then
    echo "   ✅ Provider registration test passed"
else
    echo "   ❌ Provider registration test failed"
fi

# Test record storage
echo "   Testing record storage..."
soroban contract invoke \
  --id $CONTRACT_ID \
  --source medledger-deployer \
  --network testnet \
  -- store_record \
  --record_id "TEST001" \
  --file_hash "abcdef123456789" \
  --provider $DEPLOYER_ADDRESS \
  --patient_id "PAT001" \
  --record_type "TEST" \
  --metadata "Test record for deployment verification" > /dev/null

# Test record verification
echo "   Testing record verification..."
VERIFICATION_RESULT=$(soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- verify_record \
  --record_id "TEST001" \
  --file_hash "abcdef123456789")

echo "   Verification result: $VERIFICATION_RESULT"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Summary:"
echo "   Contract ID: $CONTRACT_ID"
echo "   Network: Stellar Testnet"
echo "   Admin Address: $DEPLOYER_ADDRESS"
echo "   RPC URL: https://soroban-testnet.stellar.org:443"
echo ""
echo "🔗 Next steps:"
echo "   1. Update your frontend configuration with the contract ID"
echo "   2. Register healthcare providers using the admin account"
echo "   3. Test the integration with your web application"
echo ""
echo "📚 View contract on Stellar Expert:"
echo "   https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"