// Simple test script for MedLedger smart contract
// Run with: node test-contract.js

import { Keypair } from '@stellar/stellar-sdk';
import MedLedgerContractService, { ContractHelpers } from './contract-service.js';

async function testContract() {
  console.log('🧪 Testing MedLedger Smart Contract');
  console.log('==================================');

  try {
    // Initialize contract service
    const contractService = new MedLedgerContractService('testnet');
    
    // Generate test keypairs
    const adminKeypair = Keypair.random();
    const providerKeypair = Keypair.random();
    
    console.log('👤 Generated test accounts:');
    console.log(`   Admin: ${adminKeypair.publicKey()}`);
    console.log(`   Provider: ${providerKeypair.publicKey()}`);
    
    // Test helper functions
    console.log('\n🔧 Testing helper functions...');
    
    const testRecordId = ContractHelpers.generateRecordId('TEST');
    console.log(`   Generated Record ID: ${testRecordId}`);
    console.log(`   Valid Record ID: ${ContractHelpers.validateRecordId(testRecordId)}`);
    
    const testHash = 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890';
    console.log(`   Valid Hash: ${ContractHelpers.validateFileHash(testHash)}`);
    
    const testPatientId = 'PAT001';
    console.log(`   Valid Patient ID: ${ContractHelpers.validatePatientId(testPatientId)}`);
    
    const testLicense = 'LIC123456';
    console.log(`   Valid License: ${ContractHelpers.validateLicenseNumber(testLicense)}`);
    
    // Test record type validation
    console.log(`   Valid Record Type (X-RAY): ${ContractHelpers.isValidRecordType('X-RAY')}`);
    console.log(`   Invalid Record Type: ${ContractHelpers.isValidRecordType('INVALID')}`);
    
    console.log('\n✅ Helper function tests completed');
    
    // Note: Actual contract interaction tests would require:
    // 1. Funded accounts on testnet
    // 2. Deployed contract address in config
    // 3. Network connectivity
    
    console.log('\n📝 To test actual contract interaction:');
    console.log('   1. Deploy contract using: ./deploy.sh');
    console.log('   2. Update contract ID in contract-config.js');
    console.log('   3. Fund test accounts with testnet XLM');
    console.log('   4. Run integration tests');
    
    console.log('\n🎉 Basic tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testContract();
}

export { testContract };