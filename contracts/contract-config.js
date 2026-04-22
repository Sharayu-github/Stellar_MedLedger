// MedLedger Smart Contract Configuration
// This file contains contract configuration for frontend integration

export const CONTRACT_CONFIG = {
  // Contract addresses (update after deployment)
  TESTNET: {
    contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47HH6XH6XM6IP32LJNVKEW', // Example - update after deployment
    networkPassphrase: 'Test SDF Network ; September 2015',
    rpcUrl: 'https://soroban-testnet.stellar.org:443',
    horizonUrl: 'https://horizon-testnet.stellar.org',
  },
  
  MAINNET: {
    contractId: '', // Update when deploying to mainnet
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    rpcUrl: 'https://soroban-mainnet.stellar.org:443',
    horizonUrl: 'https://horizon.stellar.org',
  },
  
  // Contract function names
  FUNCTIONS: {
    // Admin functions
    INITIALIZE: 'initialize',
    REGISTER_PROVIDER: 'register_provider',
    EMERGENCY_PAUSE: 'emergency_pause',
    
    // Core functions
    STORE_RECORD: 'store_record',
    VERIFY_RECORD: 'verify_record',
    GET_RECORD_INFO: 'get_record_info',
    UPDATE_METADATA: 'update_metadata',
    
    // Query functions
    GET_PROVIDER_RECORDS: 'get_provider_records',
    IS_PROVIDER_REGISTERED: 'is_provider_registered',
    GET_STATS: 'get_stats',
  },
  
  // Record types
  RECORD_TYPES: {
    XRAY: 'X-RAY',
    LAB_RESULT: 'LAB_RESULT',
    PRESCRIPTION: 'PRESCRIPTION',
    DIAGNOSIS: 'DIAGNOSIS',
    SURGERY_REPORT: 'SURGERY_REPORT',
    DISCHARGE_SUMMARY: 'DISCHARGE_SUMMARY',
    VACCINATION: 'VACCINATION',
    ALLERGY_INFO: 'ALLERGY_INFO',
    OTHER: 'OTHER',
  },
  
  // Error codes and messages
  ERRORS: {
    CONTRACT_NOT_INITIALIZED: 'Contract not initialized',
    PROVIDER_NOT_REGISTERED: 'Provider not registered',
    RECORD_ALREADY_EXISTS: 'Record ID already exists',
    RECORD_NOT_FOUND: 'Record not found',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_HASH: 'Invalid file hash format',
    CONTRACT_PAUSED: 'Contract is paused',
  },
  
  // Gas and fee settings
  TRANSACTION_SETTINGS: {
    fee: '100000', // 0.01 XLM
    timeout: 30, // 30 seconds
  },
  
  // Validation rules
  VALIDATION: {
    RECORD_ID: {
      minLength: 3,
      maxLength: 64,
      pattern: /^[A-Z0-9_-]+$/,
    },
    FILE_HASH: {
      length: 64, // SHA-256 hash length
      pattern: /^[a-fA-F0-9]{64}$/,
    },
    PATIENT_ID: {
      minLength: 3,
      maxLength: 32,
      pattern: /^[A-Z0-9_-]+$/,
    },
    LICENSE_NUMBER: {
      minLength: 5,
      maxLength: 20,
      pattern: /^[A-Z0-9_-]+$/,
    },
  },
};

// Helper functions for contract interaction
export const ContractHelpers = {
  /**
   * Validate record ID format
   */
  validateRecordId(recordId) {
    const { minLength, maxLength, pattern } = CONTRACT_CONFIG.VALIDATION.RECORD_ID;
    return recordId && 
           recordId.length >= minLength && 
           recordId.length <= maxLength && 
           pattern.test(recordId);
  },

  /**
   * Validate file hash format (SHA-256)
   */
  validateFileHash(hash) {
    const { length, pattern } = CONTRACT_CONFIG.VALIDATION.FILE_HASH;
    return hash && hash.length === length && pattern.test(hash);
  },

  /**
   * Validate patient ID format
   */
  validatePatientId(patientId) {
    const { minLength, maxLength, pattern } = CONTRACT_CONFIG.VALIDATION.PATIENT_ID;
    return patientId && 
           patientId.length >= minLength && 
           patientId.length <= maxLength && 
           pattern.test(patientId);
  },

  /**
   * Validate license number format
   */
  validateLicenseNumber(licenseNumber) {
    const { minLength, maxLength, pattern } = CONTRACT_CONFIG.VALIDATION.LICENSE_NUMBER;
    return licenseNumber && 
           licenseNumber.length >= minLength && 
           licenseNumber.length <= maxLength && 
           pattern.test(licenseNumber);
  },

  /**
   * Generate a unique record ID
   */
  generateRecordId(prefix = 'REC') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}_${timestamp}_${random}`.toUpperCase();
  },

  /**
   * Format contract error for display
   */
  formatContractError(error) {
    if (typeof error === 'string') {
      return CONTRACT_CONFIG.ERRORS[error] || error;
    }
    
    if (error.message) {
      // Check if it's a known error
      for (const [key, message] of Object.entries(CONTRACT_CONFIG.ERRORS)) {
        if (error.message.includes(key.toLowerCase().replace(/_/g, ' '))) {
          return message;
        }
      }
      return error.message;
    }
    
    return 'Unknown contract error';
  },

  /**
   * Get network configuration
   */
  getNetworkConfig(network = 'testnet') {
    return CONTRACT_CONFIG[network.toUpperCase()] || CONTRACT_CONFIG.TESTNET;
  },

  /**
   * Check if record type is valid
   */
  isValidRecordType(recordType) {
    return Object.values(CONTRACT_CONFIG.RECORD_TYPES).includes(recordType);
  },
};

export default CONTRACT_CONFIG;