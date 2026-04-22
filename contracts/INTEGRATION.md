# MedLedger Smart Contract Integration Guide

This guide explains how to integrate the MedLedger Soroban smart contract with your frontend application.

## Prerequisites

1. **Rust and Cargo**: Install from [rustup.rs](https://rustup.rs/)
2. **Soroban CLI**: Install with `cargo install --locked soroban-cli`
3. **WASM target**: Add with `rustup target add wasm32-unknown-unknown`

## Quick Start

### 1. Deploy the Contract

```bash
# Build and deploy to testnet
npm run contract:deploy

# Or manually:
cd contracts
./deploy.sh
```

This will:
- Build the contract
- Deploy to Stellar testnet
- Initialize with admin account
- Save deployment info to `deployment-info.json`

### 2. Update Frontend Configuration

After deployment, update the contract ID in your frontend:

```javascript
// In your frontend service file
import { CONTRACT_CONFIG } from '../contracts/contract-config.js';

// Update the contract ID from deployment-info.json
CONTRACT_CONFIG.TESTNET.contractId = 'YOUR_DEPLOYED_CONTRACT_ID';
```

### 3. Install Frontend Dependencies

Make sure your frontend has the required Stellar SDK:

```bash
npm install @stellar/stellar-sdk
```

### 4. Use the Contract Service

```javascript
import MedLedgerContractService from '../contracts/contract-service.js';
import { Keypair } from '@stellar/stellar-sdk';

// Initialize service
const contractService = new MedLedgerContractService('testnet');

// Example: Store a medical record
const providerKeypair = Keypair.fromSecret('PROVIDER_SECRET_KEY');
const recordData = {
  recordId: 'REC001',
  fileHash: 'a1b2c3d4e5f6...', // SHA-256 hash of file
  patientId: 'PAT001',
  recordType: 'X-RAY',
  metadata: 'Chest X-Ray - Normal'
};

try {
  const result = await contractService.storeRecord(providerKeypair, recordData);
  console.log('Record stored:', result);
} catch (error) {
  console.error('Failed to store record:', error.message);
}

// Example: Verify a record
try {
  const verification = await contractService.verifyRecord('REC001', 'a1b2c3d4e5f6...');
  console.log('Verification result:', verification);
} catch (error) {
  console.error('Verification failed:', error.message);
}
```

## Integration with Existing Frontend

### 1. Update Upload Page

Modify `src/pages/UploadPage.jsx` to use the smart contract:

```javascript
import MedLedgerContractService from '../../contracts/contract-service.js';
import { ContractHelpers } from '../../contracts/contract-config.js';

// In your upload handler
const handleUpload = async (file, metadata) => {
  try {
    // Calculate file hash (existing code)
    const fileHash = await calculateSHA256(file);
    
    // Generate record ID
    const recordId = ContractHelpers.generateRecordId();
    
    // Store on blockchain
    const contractService = new MedLedgerContractService('testnet');
    const result = await contractService.storeRecord(providerKeypair, {
      recordId,
      fileHash,
      patientId: metadata.patientId,
      recordType: metadata.recordType,
      metadata: JSON.stringify(metadata)
    });
    
    // Update UI with success
    showToast('Record stored on blockchain successfully!', 'success');
    
  } catch (error) {
    showToast(`Failed to store record: ${error.message}`, 'error');
  }
};
```

### 2. Update Verification Page

Modify `src/pages/VerifyPage.jsx` to use smart contract verification:

```javascript
import MedLedgerContractService from '../../contracts/contract-service.js';

// In your verification handler
const handleVerification = async (recordId, file) => {
  try {
    // Calculate file hash
    const fileHash = await calculateSHA256(file);
    
    // Verify with smart contract
    const contractService = new MedLedgerContractService('testnet');
    const result = await contractService.verifyRecord(recordId, fileHash);
    
    // Update UI with result
    setVerificationResult({
      isValid: result.isValid,
      recordExists: result.recordExists,
      hashMatches: result.hashMatches,
      timestamp: new Date(result.originalTimestamp * 1000),
      verificationTime: new Date(result.verificationTimestamp * 1000)
    });
    
  } catch (error) {
    showToast(`Verification failed: ${error.message}`, 'error');
  }
};
```

### 3. Update Wallet Integration

Modify `src/context/WalletContext.jsx` to support contract operations:

```javascript
import MedLedgerContractService from '../../contracts/contract-service.js';

// Add contract service to context
const [contractService, setContractService] = useState(null);

// Initialize contract service when wallet connects
useEffect(() => {
  if (publicKey) {
    const service = new MedLedgerContractService('testnet');
    setContractService(service);
  }
}, [publicKey]);

// Add provider registration function
const registerAsProvider = async (licenseNumber) => {
  if (!contractService || !keypair) {
    throw new Error('Wallet not connected or contract not initialized');
  }
  
  return await contractService.registerProvider(adminKeypair, publicKey, licenseNumber);
};
```

## Environment Configuration

### Development (.env)

```env
# Stellar Network Configuration
VITE_STELLAR_NETWORK=testnet
VITE_CONTRACT_ID=YOUR_DEPLOYED_CONTRACT_ID
VITE_ADMIN_SECRET=YOUR_ADMIN_SECRET_KEY

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

### Production (.env.production)

```env
# Stellar Network Configuration
VITE_STELLAR_NETWORK=mainnet
VITE_CONTRACT_ID=YOUR_MAINNET_CONTRACT_ID

# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com
```

## Testing

### Unit Tests

```bash
# Test Rust contract
npm run contract:test

# Test JavaScript integration
npm run contract:test-js
```

### Integration Testing

1. Deploy contract to testnet
2. Fund test accounts with testnet XLM
3. Run frontend in development mode
4. Test complete workflow:
   - Connect wallet
   - Register as provider
   - Upload and store record
   - Verify record

## Deployment Checklist

### Testnet Deployment

- [ ] Contract deployed and initialized
- [ ] Admin account funded and secured
- [ ] Contract ID updated in frontend config
- [ ] Provider accounts registered
- [ ] Integration tested end-to-end

### Mainnet Deployment

- [ ] Contract audited and tested thoroughly
- [ ] Mainnet accounts funded
- [ ] Contract deployed to mainnet
- [ ] Frontend updated with mainnet config
- [ ] Monitoring and alerting set up
- [ ] Backup and recovery procedures documented

## Troubleshooting

### Common Issues

1. **Contract not found**: Verify contract ID in config
2. **Insufficient funds**: Ensure accounts have XLM for fees
3. **Provider not registered**: Register provider before storing records
4. **Invalid hash format**: Ensure SHA-256 hash is 64 hex characters
5. **Network timeout**: Check Stellar network status

### Debug Mode

Enable debug logging in your frontend:

```javascript
// Add to your main.jsx or App.jsx
if (import.meta.env.DEV) {
  window.DEBUG_CONTRACT = true;
}

// In contract service
if (window.DEBUG_CONTRACT) {
  console.log('Contract operation:', operation, params);
}
```

## Security Considerations

1. **Private Keys**: Never expose private keys in frontend code
2. **Validation**: Always validate input data before contract calls
3. **Error Handling**: Implement proper error handling and user feedback
4. **Rate Limiting**: Implement rate limiting for contract operations
5. **Monitoring**: Monitor contract usage and costs

## Support

- **Documentation**: See contract README.md for detailed API reference
- **Issues**: Report bugs in the project repository
- **Community**: Join Stellar Discord for Soroban support

---

For more detailed information, see the individual files:
- `contract-config.js` - Configuration and validation helpers
- `contract-service.js` - Service layer for contract interaction
- `lib.rs` - Smart contract implementation
- `deploy.sh` - Deployment script