# MedLedger - Healthcare Record Verification Platform

🏥 **MedLedger** is a blockchain-powered healthcare record verification platform built on Stellar network with Freighter wallet integration. It ensures medical records are tamper-proof, privacy-protected, and instantly verifiable.

![MedLedger Platform](https://img.shields.io/badge/Platform-Stellar-blue) ![Status](https://img.shields.io/badge/Status-Ready-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### Core Healthcare Features
- 🔒 **Tamper-Proof Records**: Medical record hashes stored immutably on Stellar blockchain
- 🏥 **HIPAA Compliant**: Only cryptographic hashes stored on-chain, protecting patient privacy
- ✅ **Instant Verification**: Verify medical record integrity in seconds
- 📊 **Multi-Provider Support**: Works with hospitals, clinics, labs, and healthcare providers
- 🔐 **Ownership Control**: Only authorized healthcare providers can upload records
- 📈 **Analytics Dashboard**: Real-time statistics and insights for healthcare providers

### Blockchain Features
- ⛓️ **Stellar Network**: Built on Stellar blockchain for fast, low-cost transactions
- 👛 **Freighter Wallet**: Seamless wallet connection and transaction signing
- 🌐 **Testnet Ready**: Development on official Stellar testnet network
- 🔄 **Version Control**: Track every modification with complete audit trail

### Technical Features
- 🎨 **Professional UI**: Modern, responsive design optimized for healthcare workflows
- 🚀 **Fast Performance**: Lightning-fast verification with minimal blockchain fees
- 🔍 **Advanced Search**: Find records by ID, type, provider, or patient information
- 📱 **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

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

### Blockchain
- **Stellar Network**: Blockchain platform for healthcare records
- **Freighter Wallet**: Browser extension wallet for Stellar
- **Testnet**: Development and testing environment
- **Smart Contracts**: Future Soroban contract integration

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
├── package.json                 # Frontend dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── README.md                   # This file
```

## 🔒 Security Features

- **SHA-256 Hashing**: Cryptographically secure file integrity verification
- **Privacy Protection**: Only hashes stored on blockchain, not sensitive data
- **Ownership Verification**: Only record owners can modify their data
- **Immutable Records**: Blockchain prevents tampering with verification data
- **Rate Limiting**: API protection against abuse
- **CORS Protection**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive data validation and sanitization

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

## 🐛 Troubleshooting

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

- **Smart Contracts**: Soroban smart contract integration
- **Multi-chain Support**: Ethereum, Polygon integration
- **IPFS Integration**: Decentralized file storage
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Machine learning insights
- **API Rate Limiting**: Enhanced security features
- **Multi-language Support**: Internationalization
- **Advanced Access Control**: Role-based permissions

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

### Build for Production
```bash
npm run build
# Output in dist/ folder
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

*MedLedger - Securing Healthcare Records with Blockchain Technology*