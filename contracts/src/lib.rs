#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Map, String, Symbol, Vec,
};

// Data structures for medical records
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MedicalRecord {
    pub record_id: String,
    pub file_hash: String,
    pub provider_address: Address,
    pub patient_id: String,
    pub record_type: String,
    pub timestamp: u64,
    pub metadata: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VerificationResult {
    pub is_valid: bool,
    pub record_exists: bool,
    pub hash_matches: bool,
    pub original_timestamp: u64,
    pub verification_timestamp: u64,
}

// Storage keys
const RECORDS: Symbol = symbol_short!("RECORDS");
const PROVIDERS: Symbol = symbol_short!("PROVIDER");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[contract]
pub struct MedLedgerContract;

#[contractimpl]
impl MedLedgerContract {
    /// Initialize the contract with an admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("Contract already initialized");
        }
        
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
    }

    /// Register a healthcare provider
    pub fn register_provider(env: Env, provider: Address, license_number: String) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        let mut providers: Map<Address, String> = env
            .storage()
            .persistent()
            .get(&PROVIDERS)
            .unwrap_or(Map::new(&env));

        providers.set(provider, license_number);
        env.storage().persistent().set(&PROVIDERS, &providers);
    }

    /// Store a medical record hash on the blockchain
    pub fn store_record(
        env: Env,
        record_id: String,
        file_hash: String,
        provider: Address,
        patient_id: String,
        record_type: String,
        metadata: String,
    ) -> String {
        // Verify provider is registered
        let providers: Map<Address, String> = env
            .storage()
            .persistent()
            .get(&PROVIDERS)
            .unwrap_or(Map::new(&env));

        if !providers.contains_key(provider.clone()) {
            panic!("Provider not registered");
        }

        provider.require_auth();

        // Check if record already exists
        let mut records: Map<String, MedicalRecord> = env
            .storage()
            .persistent()
            .get(&RECORDS)
            .unwrap_or(Map::new(&env));

        if records.contains_key(record_id.clone()) {
            panic!("Record ID already exists");
        }

        let timestamp = env.ledger().timestamp();

        let record = MedicalRecord {
            record_id: record_id.clone(),
            file_hash,
            provider_address: provider,
            patient_id,
            record_type,
            timestamp,
            metadata,
        };

        records.set(record_id.clone(), record);
        env.storage().persistent().set(&RECORDS, &records);

        // Emit event
        env.events().publish(
            (symbol_short!("STORED"), record_id.clone()),
            (symbol_short!("provider"), record.provider_address.clone()),
        );

        record_id
    }

    /// Verify a medical record by comparing file hash
    pub fn verify_record(env: Env, record_id: String, file_hash: String) -> VerificationResult {
        let records: Map<String, MedicalRecord> = env
            .storage()
            .persistent()
            .get(&RECORDS)
            .unwrap_or(Map::new(&env));

        let verification_timestamp = env.ledger().timestamp();

        if let Some(record) = records.get(record_id.clone()) {
            let hash_matches = record.file_hash == file_hash;
            
            // Emit verification event
            env.events().publish(
                (symbol_short!("VERIFIED"), record_id),
                (symbol_short!("result"), hash_matches),
            );

            VerificationResult {
                is_valid: hash_matches,
                record_exists: true,
                hash_matches,
                original_timestamp: record.timestamp,
                verification_timestamp,
            }
        } else {
            VerificationResult {
                is_valid: false,
                record_exists: false,
                hash_matches: false,
                original_timestamp: 0,
                verification_timestamp,
            }
        }
    }

    /// Get record details (without sensitive data)
    pub fn get_record_info(env: Env, record_id: String) -> Option<MedicalRecord> {
        let records: Map<String, MedicalRecord> = env
            .storage()
            .persistent()
            .get(&RECORDS)
            .unwrap_or(Map::new(&env));

        records.get(record_id)
    }

    /// Get all records for a specific provider
    pub fn get_provider_records(env: Env, provider: Address) -> Vec<String> {
        let records: Map<String, MedicalRecord> = env
            .storage()
            .persistent()
            .get(&RECORDS)
            .unwrap_or(Map::new(&env));

        let mut provider_records = Vec::new(&env);

        for (record_id, record) in records.iter() {
            if record.provider_address == provider {
                provider_records.push_back(record_id);
            }
        }

        provider_records
    }

    /// Update record metadata (only by original provider)
    pub fn update_metadata(
        env: Env,
        record_id: String,
        new_metadata: String,
        provider: Address,
    ) -> bool {
        provider.require_auth();

        let mut records: Map<String, MedicalRecord> = env
            .storage()
            .persistent()
            .get(&RECORDS)
            .unwrap_or(Map::new(&env));

        if let Some(mut record) = records.get(record_id.clone()) {
            if record.provider_address != provider {
                panic!("Only original provider can update metadata");
            }

            record.metadata = new_metadata;
            records.set(record_id.clone(), record);
            env.storage().persistent().set(&RECORDS, &records);

            // Emit update event
            env.events().publish(
                (symbol_short!("UPDATED"), record_id),
                (symbol_short!("provider"), provider),
            );

            true
        } else {
            false
        }
    }

    /// Get contract statistics
    pub fn get_stats(env: Env) -> (u32, u32) {
        let records: Map<String, MedicalRecord> = env
            .storage()
            .persistent()
            .get(&RECORDS)
            .unwrap_or(Map::new(&env));

        let providers: Map<Address, String> = env
            .storage()
            .persistent()
            .get(&PROVIDERS)
            .unwrap_or(Map::new(&env));

        (records.len(), providers.len())
    }

    /// Check if provider is registered
    pub fn is_provider_registered(env: Env, provider: Address) -> bool {
        let providers: Map<Address, String> = env
            .storage()
            .persistent()
            .get(&PROVIDERS)
            .unwrap_or(Map::new(&env));

        providers.contains_key(provider)
    }

    /// Emergency function to pause contract (admin only)
    pub fn emergency_pause(env: Env, admin: Address) {
        let stored_admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        if admin != stored_admin {
            panic!("Only admin can pause contract");
        }
        
        admin.require_auth();
        
        // Set pause flag
        env.storage().instance().set(&symbol_short!("PAUSED"), &true);
        
        env.events().publish(
            (symbol_short!("PAUSED"),),
            admin,
        );
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_initialize_contract() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MedLedgerContract);
        let client = MedLedgerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        // Test that we can't initialize twice
        assert!(std::panic::catch_unwind(|| {
            client.initialize(&admin);
        }).is_err());
    }

    #[test]
    fn test_provider_registration() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MedLedgerContract);
        let client = MedLedgerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let provider = Address::generate(&env);
        
        client.initialize(&admin);
        client.register_provider(&provider, &String::from_str(&env, "LIC123456"));

        assert!(client.is_provider_registered(&provider));
    }

    #[test]
    fn test_record_storage_and_verification() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MedLedgerContract);
        let client = MedLedgerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let provider = Address::generate(&env);
        
        client.initialize(&admin);
        client.register_provider(&provider, &String::from_str(&env, "LIC123456"));

        let record_id = String::from_str(&env, "REC001");
        let file_hash = String::from_str(&env, "abc123hash");
        let patient_id = String::from_str(&env, "PAT001");
        let record_type = String::from_str(&env, "X-RAY");
        let metadata = String::from_str(&env, "Chest X-Ray");

        // Store record
        client.store_record(
            &record_id,
            &file_hash,
            &provider,
            &patient_id,
            &record_type,
            &metadata,
        );

        // Verify with correct hash
        let result = client.verify_record(&record_id, &file_hash);
        assert!(result.is_valid);
        assert!(result.record_exists);
        assert!(result.hash_matches);

        // Verify with incorrect hash
        let wrong_hash = String::from_str(&env, "wronghash");
        let result = client.verify_record(&record_id, &wrong_hash);
        assert!(!result.is_valid);
        assert!(result.record_exists);
        assert!(!result.hash_matches);
    }

    #[test]
    fn test_get_provider_records() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MedLedgerContract);
        let client = MedLedgerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let provider = Address::generate(&env);
        
        client.initialize(&admin);
        client.register_provider(&provider, &String::from_str(&env, "LIC123456"));

        // Store multiple records
        for i in 1..=3 {
            let record_id = String::from_str(&env, &format!("REC{:03}", i));
            let file_hash = String::from_str(&env, &format!("hash{}", i));
            let patient_id = String::from_str(&env, &format!("PAT{:03}", i));
            
            client.store_record(
                &record_id,
                &file_hash,
                &provider,
                &patient_id,
                &String::from_str(&env, "TEST"),
                &String::from_str(&env, "Test record"),
            );
        }

        let provider_records = client.get_provider_records(&provider);
        assert_eq!(provider_records.len(), 3);
    }
}