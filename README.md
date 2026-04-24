# MedLedger - Healthcare Record Verification Platform

🏥 **MedLedger** is a blockchain-powered healthcare record verification platform built on Stellar network with Soroban smart contracts and Freighter wallet integration. It ensures medical records are tamper-proof, privacy-protected, and instantly verifiable through cryptographic hashing and immutable blockchain storage.

![MedLedger Platform](https://img.shields.io/badge/Platform-Stellar-blue) ![Smart Contracts](https://img.shields.io/badge/Smart_Contracts-Soroban-orange) ![Status](https://img.shields.io/badge/Status-Live-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🌐 Live Demo

- **Production**: https://medledger-stellar.vercel.app
- **GitHub**: https://github.com/Sharayu-github/Stellar_MedLedger
- **Smart Contract**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW`
- **Contract Explorer**: https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW
- **Stellar Laboratory**: https://laboratory.stellar.org/#explorer?resource=contracts&endpoint=single&network=test&values=eyJjb250cmFjdElkIjoiQ0RMWkZDM1NZSllEWlQ3SzY3Vlo3NUhQSlZJRVVWTklYRjQ3SEg2WEg2WE02SVAzMkxKTlZLRVcifQ%3D%3D

## 🔗 Quick Links

### Application
- **Live Demo**: https://medledger-stellar.vercel.app
- **GitHub Repository**: https://github.com/Sharayu-github/Stellar_MedLedger
- **Vercel Dashboard**: https://vercel.com/deogaonkarsharayu-4848s-projects/medledger-stellar

### Smart Contract
- **Contract ID**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW`
- **Stellar Expert**: https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW
- **Stellar Laboratory**: https://laboratory.stellar.org/#explorer?resource=contracts&endpoint=single&network=test
- **Contract Source Code**: [contracts/src/lib.rs](contracts/src/lib.rs)

### Documentation
- **Contract Documentation**: [contracts/README.md](contracts/README.md)
- **Integration Guide**: [contracts/INTEGRATION.md](contracts/INTEGRATION.md)
- **Windows Setup**: [contracts/WINDOWS_SETUP.md](contracts/WINDOWS_SETUP.md)
- **Deployment Guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

## 🌟 Features

### Core Healthcare Features
- 🔒 **Tamper-Proof Records**: Medical record hashes stored immutably on Stellar blockchain via Soroban smart contracts
- 🏥 **HIPAA Compliant**: Only cryptographic hashes stored on-chain, protecting patient privacy
- ✅ **Instant Verification**: Verify medical record integrity in seconds through smart contract calls
- 📊 **Multi-Provider Support**: Works with hospitals, clinics, labs, and healthcare providers
- 🔐 **Ownership Control**: Only authorized healthcare providers can upload records via smart contract access control
- 📈 **Analytics Dashboard**: Real-time statistics and insights for healthcare providers
- 🔍 **Audit Trail**: Complete history of record modifications tracked on blockchain

### Blockchain & Smart Contract Features
- ⛓️ **Stellar Network**: Built on Stellar blockchain for fast, low-cost transactions
- 🤖 **Soroban Smart Contracts**: Rust-based smart contracts for secure record management
- 👛 **Freighter Wallet**: Seamless wallet connection and transaction signing
- 🌐 **Testnet Ready**: Development on official Stellar testnet network
- 🔄 **Provider Registration**: Smart contract-based healthcare provider management
- 💰 **Low Fees**: Minimal transaction costs (0.01 XLM per record)
- 🛡️ **Emergency Controls**: Admin functions for contract management and security

### Technical Features
- 🎨 **Professional UI**: Modern, responsive design optimized for healthcare workflows
- 🚀 **Fast Performance**: Lightning-fast verification with minimal blockchain fees
- 🔍 **Advanced Search**: Find records by ID, type, provider, or patient information
- 📱 **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🌍 **Global CDN**: Deployed on Vercel with worldwide edge distribution
- 🔒 **Security Headers**: XSS protection, content security, and HTTPS enforcement

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library with hooks and context
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for healthcare-focused design
- **React Router**: Client-side routing for single-page application
- **Axios**: HTTP client for API communication
- **Freighter API**: Stellar wallet integration
- **CryptoJS**: SHA-256 hashing for file integrity

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Stellar SDK**: Blockchain interaction library
- **JWT**: JSON Web Token authentication
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API protection and throttling

### Blockchain & Smart Contracts
- **Stellar Network**: Blockchain platform for healthcare records
- **Soroban**: Rust-based smart contract platform
- **Smart Contract Features**:
  - Medical record hash storage
  - Healthcare provider registration
  - Record verification and integrity checking
  - Access control and permissions
  - Emergency admin controls
  - Complete audit trail
- **Freighter Wallet**: Browser extension wallet for Stellar
- **Testnet**: Development and testing environment

### Deployment & Infrastructure
- **Vercel**: Global CDN deployment platform
- **GitHub**: Version control and CI/CD integration
- **Automatic Deployments**: Connected to GitHub for seamless updates
- **SSL/HTTPS**: Automatic certificate management
- **Security Headers**: XSS protection and content security policies

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- Freighter Wallet browser extension (optional for development)
- Git 2.0 or higher

### 1. Clone the Repository
```bash
git clone <repository-url>
cd medledger-stellar
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install-all

# Or install separately:
npm install
cd backend && npm install && cd ..
```

### 3. Environment Configuration

Create `.env` file in root:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_FREIGHTER_ENABLED=true
VITE_APP_NAME=MedLedger
VITE_APP_VERSION=1.0.0
VITE_CONTRACT_ID=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW
```

Create `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
JWT_SECRET=your_jwt_secret_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Start the Application

**Development Mode (All-in-One):**
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

**Separate Terminals:**
```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

### 5. Wallet Connection

**Option A: Development (TEST MODE)**
- App loads automatically with a mock wallet
- You'll see: "⚠️ TEST MODE"
- All features work for testing
- No Freighter installation required

**Option B: Production (Real Wallet)**
- Install [Freighter browser extension](https://www.freighter.app/)
- Create/import Stellar testnet account
- Fund account from [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
- App auto-detects and connects to Freighter

## 📖 How to Use

### 1. Upload Healthcare Record
1. Navigate to "Upload Record" page
2. Fill in patient and provider information
3. Select record type (Lab Results, Radiology, etc.)
4. Upload the medical record file
5. Click "Upload to Blockchain"
6. Confirm transaction in Freighter wallet
7. Receive Record ID for future verification

### 2. Verify Record Integrity
1. Go to "Verify Record" page
2. Enter the Record ID
3. Upload the file to verify
4. Click "Verify Record"
5. View verification results:
   - ✅ **Verified**: File is authentic and unmodified
   - ❌ **Failed**: File has been tampered with or modified

### 3. Browse Records
1. Visit "My Records" to see your uploaded records
2. Use "All Records" to browse public record metadata
3. Search by Record ID, type, or provider
4. Filter by record type or healthcare provider
5. View detailed record information and blockchain transaction

### 4. Analytics Dashboard
1. Access "Dashboard" for comprehensive analytics
2. View your record statistics and activity
3. See records by type and provider
4. Monitor monthly upload trends
5. Track platform-wide statistics

## 🏗️ Project Structure

```
medledger-stellar/
├── src/                          # React frontend
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation with wallet connection
│   │   ├── AnimatedBackground.jsx # Medical-themed background
│   │   └── Toast.jsx            # Notification system
│   ├── pages/
│   │   ├── LandingPage.jsx      # Homepage with features
│   │   ├── UploadPage.jsx       # Record upload interface
│   │   ├── VerifyPage.jsx       # Record verification
│   │   ├── RecordsPage.jsx      # Browse all records
│   │   └── Dashboard.jsx        # Analytics dashboard
│   ├── context/
│   │   ├── WalletContext.jsx    # Wallet state management
│   │   └── ToastContext.jsx     # Notification context
│   ├── services/
│   │   ├── walletService.js     # Freighter wallet operations
│   │   ├── hashService.js       # SHA-256 file hashing
│   │   └── apiService.js        # Backend API client
│   └── App.jsx                  # Main application component
│
├── backend/                      # Node.js/Express server
│   ├── routes/
│   │   ├── recordRoutes.js      # Healthcare record endpoints
│   │   ├── analyticsRoutes.js   # Analytics and statistics
│   │   └── blockchainRoutes.js  # Blockchain interaction
│   ├── services/
│   │   └── recordService.js     # Record management logic
│   └── server.js                # Express server setup
│
├── contracts/                    # Soroban Smart Contracts
│   ├── src/
│   │   ├── lib.rs              # Main smart contract code
│   │   └── main.rs             # Binary target
│   ├── Cargo.toml              # Rust dependencies
│   ├── deploy.sh               # Deployment script
│   ├── contract-config.js      # Contract configuration
│   ├── contract-service.js     # JavaScript service layer
│   ├── README.md               # Contract documentation
│   ├── INTEGRATION.md          # Integration guide
│   ├── WINDOWS_SETUP.md        # Windows setup instructions
│   └── DEPLOYMENT_STATUS.md    # Deployment status
│
├── vercel.json                  # Vercel deployment config
├── .env.production             # Production environment variables
├── VERCEL_DEPLOYMENT.md        # Deployment guide
├── package.json                # Frontend dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
└── README.md                  # This file
```

## 🔒 Security Features

- **SHA-256 Hashing**: Cryptographically secure file integrity verification
- **Privacy Protection**: Only hashes stored on blockchain, not sensitive data
- **Smart Contract Security**: Rust-based contracts with access control and validation
- **Provider Registration**: Only registered healthcare providers can store records
- **Ownership Verification**: Only record owners can modify their data
- **Immutable Records**: Blockchain prevents tampering with verification data
- **Emergency Controls**: Admin functions for contract pause and management
- **Rate Limiting**: API protection against abuse
- **CORS Protection**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive data validation and sanitization
- **HTTPS Enforcement**: Automatic SSL certificates and secure connections
- **Security Headers**: XSS protection, content security policies, and frame options

## 🌐 API Endpoints

### Healthcare Records
- `POST /api/records/upload` - Upload new healthcare record
- `POST /api/records/verify` - Verify record integrity
- `GET /api/records/:recordId` - Get specific record details
- `GET /api/records/user/:walletAddress` - Get user's records
- `GET /api/records` - Get all records (paginated)
- `PUT /api/records/:recordId` - Update record information

### Analytics
- `GET /api/analytics/:walletAddress` - Get user analytics
- `GET /api/analytics` - Get system-wide statistics

### Blockchain
- `POST /api/blockchain/submit` - Submit transaction to blockchain
- `GET /api/blockchain/status/:txHash` - Get transaction status
- `GET /api/blockchain/network` - Get network information

### Smart Contract Functions
- `initialize(admin)` - Initialize contract with admin address
- `register_provider(provider, license)` - Register healthcare provider
- `store_record(recordId, fileHash, provider, patientId, recordType, metadata)` - Store medical record
- `verify_record(recordId, fileHash)` - Verify record integrity
- `get_record_info(recordId)` - Get record metadata
- `get_provider_records(provider)` - Get all records for a provider
- `is_provider_registered(provider)` - Check provider registration
- `get_stats()` - Get contract statistics

## 🤖 Smart Contract Integration

### Contract Features
- **Medical Record Storage**: Store SHA-256 hashes of medical files on blockchain
- **Provider Management**: Register and manage healthcare providers
- **Access Control**: Only registered providers can store records
- **Record Verification**: Verify file integrity by comparing hashes
- **Audit Trail**: Complete history of all record operations
- **Emergency Controls**: Admin functions for contract management

### Contract Functions

#### Administrative Functions
```rust
initialize(admin: Address) // Initialize contract with admin
register_provider(provider: Address, license: String) // Register healthcare provider
emergency_pause(admin: Address) // Emergency pause functionality
```

#### Core Functions
```rust
store_record(record_id, file_hash, provider, patient_id, record_type, metadata) // Store record
verify_record(record_id: String, file_hash: String) // Verify record integrity
get_record_info(record_id: String) // Get record metadata
update_metadata(record_id, new_metadata, provider) // Update record information
```

#### Query Functions
```rust
get_provider_records(provider: Address) // Get all records for a provider
is_provider_registered(provider: Address) // Check provider registration
get_stats() // Get contract statistics (total records, providers)
```

### Integration with Frontend

```javascript
import MedLedgerContractService from './contracts/contract-service.js';

// Initialize contract service
const contractService = new MedLedgerContractService('testnet');

// Store a medical record
const recordData = {
  recordId: 'REC001',
  fileHash: 'a1b2c3d4e5f6...', // SHA-256 hash
  patientId: 'PAT001',
  recordType: 'X-RAY',
  metadata: 'Chest X-Ray - Normal'
};

const result = await contractService.storeRecord(providerKeypair, recordData);

// Verify a record
const verification = await contractService.verifyRecord('REC001', 'a1b2c3d4e5f6...');
console.log('Verification result:', verification.isValid);
```

### Contract Deployment Status
- **Status**: Deployed on Stellar Testnet
- **Contract ID**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW`
- **Network**: Stellar Testnet
- **Language**: Rust (Soroban)
- **Features**: Complete medical record management
- **Security**: Access control, input validation, emergency controls
- **Documentation**: Comprehensive guides in `contracts/` directory

### Contract Links
- **Stellar Expert**: https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW
- **Stellar Laboratory**: https://laboratory.stellar.org/#explorer?resource=contracts&endpoint=single&network=test
- **Soroban RPC**: https://soroban-testnet.stellar.org:443
- **Contract Source**: [contracts/src/lib.rs](contracts/src/lib.rs)

### Setup Instructions
1. **Install Tools**: Follow `contracts/WINDOWS_SETUP.md`
2. **Deploy Contract**: Run `./contracts/deploy.sh`
3. **Update Config**: Add contract ID to `contracts/contract-config.js`
4. **Test Integration**: Use contract service in React components

## 🐛 Troubleshooting

### Wallet Connection Issues
**Q: "Wallet connection failed" - What should I do?**
A: The app automatically falls back to TEST MODE with a mock wallet. All features work normally! Install Freighter for production use.

**Q: How do I switch from TEST MODE to real Freighter?**
A: Install Freighter extension, create testnet account, fund it, and reload the app.

### Smart Contract Issues
**Q: Smart contract deployment fails**
A: Ensure you have Visual Studio Build Tools installed on Windows. See `contracts/WINDOWS_SETUP.md` for detailed setup instructions.

**Q: Contract functions return errors**
A: Verify the contract is deployed and the contract ID is correctly set in `contracts/contract-config.js`.

**Q: Provider registration fails**
A: Only the contract admin can register providers. Ensure you're using the admin account that deployed the contract.

### Installation Issues
**Q: npm install fails with dependency errors**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Q: Backend server won't start**
```bash
cd backend
npm install
npm start
# Should show: "🏥 MedLedger API Server running on port 5000"
```

**Q: Rust/Cargo installation issues on Windows**
A: Follow the Windows-specific setup guide in `contracts/WINDOWS_SETUP.md` or use WSL for Linux environment.

### Development Issues
**Q: Frontend can't connect to backend**
- Verify backend is running on http://localhost:5000
- Check `.env` has correct `VITE_API_BASE_URL`
- Ensure CORS is enabled in backend

**Q: Vercel deployment fails**
- Check `vercel.json` configuration
- Verify environment variables are set in Vercel dashboard
- Ensure build command completes successfully locally

### Deployment Issues
**Q: Live site shows errors**
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Ensure contract ID is updated in production config

### Wallet Connection Issues
**Q: "Wallet connection failed" - What should I do?**
A: The app automatically falls back to TEST MODE with a mock wallet. All features work normally! Install Freighter for production use.

**Q: How do I switch from TEST MODE to real Freighter?**
A: Install Freighter extension, create testnet account, fund it, and reload the app.

### Installation Issues
**Q: npm install fails with dependency errors**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Q: Backend server won't start**
```bash
cd backend
npm install
npm start
# Should show: "🏥 MedLedger API Server running on port 5000"
```

### Development Issues
**Q: Frontend can't connect to backend**
- Verify backend is running on http://localhost:5000
- Check `.env` has correct `VITE_API_BASE_URL`
- Ensure CORS is enabled in backend

## 📈 Future Enhancements

- ✅ **Smart Contracts**: Soroban smart contract integration (COMPLETED)
- ✅ **Vercel Deployment**: Global CDN deployment (COMPLETED)
- 🔄 **Multi-chain Support**: Ethereum, Polygon integration
- 🔄 **IPFS Integration**: Decentralized file storage
- 🔄 **Mobile App**: React Native mobile application
- 🔄 **Advanced Analytics**: Machine learning insights
- 🔄 **API Rate Limiting**: Enhanced security features
- 🔄 **Multi-language Support**: Internationalization
- 🔄 **Advanced Access Control**: Role-based permissions
- 🔄 **HL7 FHIR Integration**: Healthcare interoperability standards

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Stellar Foundation** - Blockchain platform and development tools
- **Freighter Team** - Stellar wallet integration
- **React Community** - Frontend framework and ecosystem
- **Healthcare Providers** - Feedback and requirements validation

## 📞 Support

For issues, questions, or feature requests:

- Open a GitHub issue
- Contact the development team
- Check the troubleshooting section above

---

**Built with ❤️ for Healthcare Data Integrity and Blockchain Security**

⭐ If you find this project useful, please give it a star!

## 🚀 Deployment

### Live Production Deployment
- **Production URL**: https://medledger-stellar.vercel.app
- **Deployment Platform**: Vercel with global CDN
- **Automatic Deployments**: Connected to GitHub main branch
- **SSL/HTTPS**: Automatic certificate management
- **Performance**: Optimized builds with edge caching

### Smart Contract Deployment

#### Contract Information
- **Contract ID**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW`
- **Network**: Stellar Testnet
- **Status**: ✅ Deployed and Active
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47H6XH6XM6IP32LJNVKEW

#### Interact with Contract
```bash
# Using Stellar CLI
stellar contract invoke \
  --id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW \
  --source-account YOUR_ACCOUNT \
  --network testnet \
  -- get_stats

# View contract in Stellar Laboratory
# Visit: https://laboratory.stellar.org/#explorer?resource=contracts&endpoint=single&network=test
```

### Local Development Build
```bash
# Build frontend for production
npm run build
# Output in dist/ folder

# Test smart contract
npm run contract:test

# Build smart contract
npm run contract:build
```

### Alternative Deployment Options

#### Deploy to Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

#### Deploy to GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

#### Docker Deployment
```bash
# Build Docker image
docker build -t medledger .

# Run container
docker run -p 3000:3000 medledger
```

### Environment Variables for Production

```env
# Production Environment (.env.production)
VITE_STELLAR_NETWORK=testnet
VITE_CONTRACT_ID=YOUR_DEPLOYED_CONTRACT_ID
VITE_API_BASE_URL=https://medledger-stellar.vercel.app/api
VITE_APP_NAME=MedLedger
VITE_ENABLE_ANALYTICS=true
```

### Deployment Checklist

- ✅ Frontend deployed to Vercel
- ✅ GitHub repository connected
- ✅ Automatic deployments configured
- ✅ SSL certificates active
- ✅ Environment variables set
- ✅ Smart contract deployed to Stellar testnet
- ✅ Contract ID configured in application
- ⚠️ Provider registration needs admin setup
- ⚠️ Production testing required

---

*MedLedger - Securing Healthcare Records with Blockchain Technology*