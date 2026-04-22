# MedLedger Smart Contract

A Soroban smart contract for secure medical record verification on the Stellar blockchain.

## Features

- **Medical Record Storage**: Store cryptographic hashes of medical records
- **Provider Registration**: Register and manage healthcare providers
- **Record Verification**: Verify record integrity by comparing file hashes
- **Access Control**: Only registered providers can store records
- **Audit Trail**: Complete history of record operations
- **Emergency Controls**: Admin functions for contract management

## Contract Functions

### Administrative Functions

- `initialize(admin: Address)` - Initialize contract with admin address
- `register_provider(provider: Address, license_number: String)` - Register healthcare provider
- `emergency_pause(admin: Address)` - Emergency pause functionality

### Core Functions

- `store_record(record_id, file_hash, provider, patient_id, record_type, metadata)` - Store medical record hash
- `verify_record(record_id: String, file_hash: String)` - Verify record integrity
- `get_record_info(record_id: String)` - Get record metadata
- `update_metadata(record_id, new_metadata, provider)` - Update record metadata

### Query Functions

- `get_provider_records(provider: Address)` - Get all records for a provider
- `is_provider_registered(provider: Address)` - Check provider registration status
- `get_stats()` - Get contract statistics (total records, providers)

## Data Structures

### MedicalRecord
```rust
pub struct MedicalRecord {
    pub record_id: String,
    pub file_hash: String,           // SHA-256 hash of the medical file
    pub provider_address: Address,   // Healthcare provider's Stellar address
    pub patient_id: String,          // Patient identifier (hashed for privacy)
    pub record_type: String,         // Type of medical record (X-RAY, LAB, etc.)
    pub timestamp: u64,              // When record was stored
    pub metadata: String,            // Additional metadata (encrypted if needed)
}
```

### VerificationResult
```rust
pub struct VerificationResult {
    pub is_valid: bool,              // Overall verification result
    pub record_exists: bool,         // Whether record exists in contract
    pub hash_matches: bool,          // Whether file hash matches stored hash
    pub original_timestamp: u64,     // When record was originally stored
    pub verification_timestamp: u64, // When verification was performed
}
```

## Development

### Prerequisites

1. Install Rust and Cargo
2. Install Soroban CLI:
   ```bash
   cargo install --locked soroban-cli
   ```

### Build Contract

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

### Run Tests

```bash
cargo test
```

### Deploy to Testnet

1. Configure Soroban for testnet:
   ```bash
   soroban config network add testnet \
     --rpc-url https://soroban-testnet.stellar.org:443 \
     --network-passphrase "Test SDF Network ; September 2015"
   ```

2. Create and fund identity:
   ```bash
   soroban config identity generate alice
   soroban config identity fund alice --network testnet
   ```

3. Build and deploy:
   ```bash
   soroban contract build
   soroban contract deploy \
     --wasm target/wasm32-unknown-unknown/release/medledger_contract.wasm \
     --source alice \
     --network testnet
   ```

4. Initialize contract:
   ```bash
   soroban contract invoke \
     --id <CONTRACT_ID> \
     --source alice \
     --network testnet \
     -- initialize \
     --admin <ADMIN_ADDRESS>
   ```

## Usage Examples

### Register a Provider

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source alice \
  --network testnet \
  -- register_provider \
  --provider <PROVIDER_ADDRESS> \
  --license_number "LIC123456"
```

### Store a Medical Record

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source provider \
  --network testnet \
  -- store_record \
  --record_id "REC001" \
  --file_hash "a1b2c3d4e5f6..." \
  --provider <PROVIDER_ADDRESS> \
  --patient_id "PAT001" \
  --record_type "X-RAY" \
  --metadata "Chest X-Ray - Normal"
```

### Verify a Record

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  -- verify_record \
  --record_id "REC001" \
  --file_hash "a1b2c3d4e5f6..."
```

## Security Considerations

- **Privacy**: Only file hashes are stored, never actual medical data
- **Access Control**: Only registered providers can store records
- **Immutability**: Records cannot be deleted, only metadata can be updated
- **Authentication**: All operations require proper Stellar signatures
- **Emergency Controls**: Admin can pause contract in emergencies

## Integration with Frontend

The contract integrates with the MedLedger frontend through:

1. **Wallet Connection**: Uses Freighter wallet for Stellar authentication
2. **Hash Generation**: Frontend calculates SHA-256 hashes before contract calls
3. **Provider Management**: Admin interface for provider registration
4. **Record Operations**: Upload and verification interfaces

## License

This smart contract is part of the MedLedger project and follows the same licensing terms.