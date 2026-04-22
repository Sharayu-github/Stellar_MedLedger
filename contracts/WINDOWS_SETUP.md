# Windows Setup Guide for MedLedger Smart Contract

Since you're on Windows, you'll need to install some additional tools to build and deploy Soroban smart contracts.

## Option 1: Install Visual Studio Build Tools (Recommended)

1. **Download Visual Studio Build Tools**:
   - Go to https://visualstudio.microsoft.com/downloads/
   - Download "Build Tools for Visual Studio 2022"

2. **Install with C++ Build Tools**:
   - Run the installer
   - Select "C++ build tools" workload
   - Make sure "Windows 10/11 SDK" is selected
   - Install

3. **Install Rust and Soroban**:
   ```bash
   # Rust should already be installed, but ensure MSVC toolchain
   rustup toolchain install stable-x86_64-pc-windows-msvc
   rustup default stable-x86_64-pc-windows-msvc
   
   # Install Soroban CLI
   cargo install --locked soroban-cli
   ```

4. **Deploy the Contract**:
   ```bash
   cd contracts
   ./deploy.sh
   ```

## Option 2: Use Windows Subsystem for Linux (WSL)

1. **Install WSL**:
   ```cmd
   wsl --install
   ```

2. **Install Ubuntu and setup**:
   ```bash
   # In WSL Ubuntu terminal
   sudo apt update && sudo apt upgrade
   sudo apt install build-essential
   
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   rustup target add wasm32-unknown-unknown
   
   # Install Soroban CLI
   cargo install --locked soroban-cli
   ```

3. **Deploy from WSL**:
   ```bash
   cd /mnt/d/path/to/your/project/contracts
   ./deploy.sh
   ```

## Option 3: Use Docker (Alternative)

1. **Create Dockerfile**:
   ```dockerfile
   FROM rust:1.70
   RUN rustup target add wasm32-unknown-unknown
   RUN cargo install --locked soroban-cli
   WORKDIR /contracts
   COPY . .
   RUN cargo build --target wasm32-unknown-unknown --release
   ```

2. **Build and Deploy**:
   ```bash
   docker build -t medledger-contract .
   docker run -v $(pwd):/contracts medledger-contract ./deploy.sh
   ```

## Quick Test (Without Full Deployment)

For now, you can test the contract logic without deploying:

```bash
cd contracts
cargo test  # This should work once build tools are installed
```

## What the Deployment Would Do

When you run `./deploy.sh`, it will:

1. **Build the Contract**: Compile Rust code to WASM
2. **Deploy to Testnet**: Upload WASM to Stellar testnet
3. **Initialize Contract**: Set up admin account
4. **Test Basic Functions**: Verify deployment worked
5. **Save Contract Info**: Store contract ID and details

## Expected Output

```
🏥 MedLedger Smart Contract Deployment
=====================================
🔨 Building contract...
✅ Contract built successfully
🌐 Configuring Stellar testnet...
🔑 Creating deployment identity...
💰 Funding deployment account...
🚀 Deploying contract to testnet...
✅ Contract deployed successfully!
📋 Contract ID: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW
🔧 Initializing contract...
✅ Contract initialized with admin: GAIUIZPHLIHQEMNJGSZKCEKCWYCM2CXWC6LFZQ6KZFXBQY2HNXND2JKL
🧪 Testing basic contract functionality...
   ✅ Provider registration test passed
   ✅ Record storage test passed
   ✅ Record verification test passed

🎉 Deployment completed successfully!

📋 Summary:
   Contract ID: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW
   Network: Stellar Testnet
   Admin Address: GAIUIZPHLIHQEMNJGSZKCEKCWYCM2CXWC6LFZQ6KZFXBQY2HNXND2JKL
```

## Next Steps After Deployment

1. **Update Frontend Config**:
   ```javascript
   // In contracts/contract-config.js
   TESTNET: {
     contractId: 'YOUR_DEPLOYED_CONTRACT_ID', // Update this
     // ... rest of config
   }
   ```

2. **Test Integration**:
   ```bash
   npm run contract:test-js
   ```

3. **Update Your Frontend**:
   - Import the contract service
   - Connect to deployed contract
   - Test upload and verification

## Troubleshooting

- **Link.exe errors**: Install Visual Studio Build Tools
- **Permission errors**: Run as administrator
- **Network errors**: Check internet connection
- **Funding errors**: Testnet friendbot might be slow

Choose the option that works best for your setup!