// MedLedger Smart Contract Service
// Service layer for interacting with the Soroban smart contract

import { 
  Contract, 
  SorobanRpc, 
  TransactionBuilder, 
  Networks, 
  BASE_FEE,
  xdr
} from '@stellar/stellar-sdk';
import { CONTRACT_CONFIG, ContractHelpers } from './contract-config.js';

export class MedLedgerContractService {
  constructor(network = 'testnet') {
    this.network = network;
    this.config = ContractHelpers.getNetworkConfig(network);
    this.server = new SorobanRpc.Server(this.config.rpcUrl);
    this.contract = new Contract(this.config.contractId);
  }

  /**
   * Initialize the contract with admin address
   */
  async initialize(adminKeypair) {
    try {
      const account = await this.server.getAccount(adminKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.config.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_CONFIG.FUNCTIONS.INITIALIZE,
            adminKeypair.publicKey()
          )
        )
        .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
        .build();

      transaction.sign(adminKeypair);
      
      const result = await this.server.sendTransaction(transaction);
      return this._handleTransactionResult(result);
    } catch (error) {
      throw new Error(`Failed to initialize contract: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  /**
   * Register a healthcare provider
   */
  async registerProvider(adminKeypair, providerAddress, licenseNumber) {
    if (!ContractHelpers.validateLicenseNumber(licenseNumber)) {
      throw new Error('Invalid license number format');
    }

    try {
      const account = await this.server.getAccount(adminKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.config.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_CONFIG.FUNCTIONS.REGISTER_PROVIDER,
            providerAddress,
            licenseNumber
          )
        )
        .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
        .build();

      transaction.sign(adminKeypair);
      
      const result = await this.server.sendTransaction(transaction);
      return this._handleTransactionResult(result);
    } catch (error) {
      throw new Error(`Failed to register provider: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  /**
   * Store a medical record hash
   */
  async storeRecord(providerKeypair, recordData) {
    const { recordId, fileHash, patientId, recordType, metadata } = recordData;

    // Validate input data
    if (!ContractHelpers.validateRecordId(recordId)) {
      throw new Error('Invalid record ID format');
    }
    if (!ContractHelpers.validateFileHash(fileHash)) {
      throw new Error('Invalid file hash format');
    }
    if (!ContractHelpers.validatePatientId(patientId)) {
      throw new Error('Invalid patient ID format');
    }
    if (!ContractHelpers.isValidRecordType(recordType)) {
      throw new Error('Invalid record type');
    }

    try {
      const account = await this.server.getAccount(providerKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.config.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_CONFIG.FUNCTIONS.STORE_RECORD,
            recordId,
            fileHash,
            providerKeypair.publicKey(),
            patientId,
            recordType,
            metadata || ''
          )
        )
        .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
        .build();

      transaction.sign(providerKeypair);
      
      const result = await this.server.sendTransaction(transaction);
      return this._handleTransactionResult(result);
    } catch (error) {
      throw new Error(`Failed to store record: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  /**
   * Verify a medical record
   */
  async verifyRecord(recordId, fileHash) {
    if (!ContractHelpers.validateRecordId(recordId)) {
      throw new Error('Invalid record ID format');
    }
    if (!ContractHelpers.validateFileHash(fileHash)) {
      throw new Error('Invalid file hash format');
    }

    try {
      const result = await this.server.simulateTransaction(
        new TransactionBuilder(
          await this.server.getAccount(this.config.contractId), // Use contract as source for read-only
          {
            fee: BASE_FEE,
            networkPassphrase: this.config.networkPassphrase,
          }
        )
          .addOperation(
            this.contract.call(
              CONTRACT_CONFIG.FUNCTIONS.VERIFY_RECORD,
              recordId,
              fileHash
            )
          )
          .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
          .build()
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return this._parseVerificationResult(result.result?.retval);
    } catch (error) {
      throw new Error(`Failed to verify record: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  /**
   * Get record information
   */
  async getRecordInfo(recordId) {
    if (!ContractHelpers.validateRecordId(recordId)) {
      throw new Error('Invalid record ID format');
    }

    try {
      const result = await this.server.simulateTransaction(
        new TransactionBuilder(
          await this.server.getAccount(this.config.contractId),
          {
            fee: BASE_FEE,
            networkPassphrase: this.config.networkPassphrase,
          }
        )
          .addOperation(
            this.contract.call(
              CONTRACT_CONFIG.FUNCTIONS.GET_RECORD_INFO,
              recordId
            )
          )
          .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
          .build()
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return this._parseRecordInfo(result.result?.retval);
    } catch (error) {
      throw new Error(`Failed to get record info: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  /**
   * Get all records for a provider
   */
  async getProviderRecords(providerAddress) {
    try {
      const result = await this.server.simulateTransaction(
        new TransactionBuilder(
          await this.server.getAccount(this.config.contractId),
          {
            fee: BASE_FEE,
            networkPassphrase: this.config.networkPassphrase,
          }
        )
          .addOperation(
            this.contract.call(
              CONTRACT_CONFIG.FUNCTIONS.GET_PROVIDER_RECORDS,
              providerAddress
            )
          )
          .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
          .build()
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return this._parseStringArray(result.result?.retval);
    } catch (error) {
      throw new Error(`Failed to get provider records: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  /**
   * Check if provider is registered
   */
  async isProviderRegistered(providerAddress) {
    try {
      const result = await this.server.simulateTransaction(
        new TransactionBuilder(
          await this.server.getAccount(this.config.contractId),
          {
            fee: BASE_FEE,
            networkPassphrase: this.config.networkPassphrase,
          }
        )
          .addOperation(
            this.contract.call(
              CONTRACT_CONFIG.FUNCTIONS.IS_PROVIDER_REGISTERED,
              providerAddress
            )
          )
          .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
          .build()
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return result.result?.retval?.value() === true;
    } catch (error) {
      throw new Error(`Failed to check provider registration: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  /**
   * Get contract statistics
   */
  async getStats() {
    try {
      const result = await this.server.simulateTransaction(
        new TransactionBuilder(
          await this.server.getAccount(this.config.contractId),
          {
            fee: BASE_FEE,
            networkPassphrase: this.config.networkPassphrase,
          }
        )
          .addOperation(
            this.contract.call(CONTRACT_CONFIG.FUNCTIONS.GET_STATS)
          )
          .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
          .build()
      );

      if (result.error) {
        throw new Error(result.error);
      }

      const stats = result.result?.retval?.value();
      return {
        totalRecords: stats?.[0]?.value() || 0,
        totalProviders: stats?.[1]?.value() || 0,
      };
    } catch (error) {
      throw new Error(`Failed to get contract stats: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  /**
   * Update record metadata
   */
  async updateMetadata(providerKeypair, recordId, newMetadata) {
    if (!ContractHelpers.validateRecordId(recordId)) {
      throw new Error('Invalid record ID format');
    }

    try {
      const account = await this.server.getAccount(providerKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.config.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_CONFIG.FUNCTIONS.UPDATE_METADATA,
            recordId,
            newMetadata,
            providerKeypair.publicKey()
          )
        )
        .setTimeout(CONTRACT_CONFIG.TRANSACTION_SETTINGS.timeout)
        .build();

      transaction.sign(providerKeypair);
      
      const result = await this.server.sendTransaction(transaction);
      return this._handleTransactionResult(result);
    } catch (error) {
      throw new Error(`Failed to update metadata: ${ContractHelpers.formatContractError(error)}`);
    }
  }

  // Private helper methods

  async _handleTransactionResult(result) {
    if (result.status === 'PENDING') {
      // Wait for transaction to be included in ledger
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const txResult = await this.server.getTransaction(result.hash);
        
        if (txResult.status === 'SUCCESS') {
          return { success: true, hash: result.hash, result: txResult };
        } else if (txResult.status === 'FAILED') {
          throw new Error(`Transaction failed: ${txResult.resultXdr}`);
        }
        
        attempts++;
      }
      
      throw new Error('Transaction timeout');
    } else if (result.status === 'SUCCESS') {
      return { success: true, hash: result.hash, result };
    } else {
      throw new Error(`Transaction failed: ${result.resultXdr}`);
    }
  }

  _parseVerificationResult(retval) {
    if (!retval) return null;
    
    const value = retval.value();
    return {
      isValid: value.is_valid?.value() || false,
      recordExists: value.record_exists?.value() || false,
      hashMatches: value.hash_matches?.value() || false,
      originalTimestamp: value.original_timestamp?.value() || 0,
      verificationTimestamp: value.verification_timestamp?.value() || 0,
    };
  }

  _parseRecordInfo(retval) {
    if (!retval) return null;
    
    const value = retval.value();
    if (!value) return null;
    
    return {
      recordId: value.record_id?.value() || '',
      fileHash: value.file_hash?.value() || '',
      providerAddress: value.provider_address?.value() || '',
      patientId: value.patient_id?.value() || '',
      recordType: value.record_type?.value() || '',
      timestamp: value.timestamp?.value() || 0,
      metadata: value.metadata?.value() || '',
    };
  }

  _parseStringArray(retval) {
    if (!retval) return [];
    
    const array = retval.value();
    return array.map(item => item.value());
  }
}

export default MedLedgerContractService;