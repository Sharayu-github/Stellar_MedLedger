import { Server } from '@stellar/stellar-sdk'

class WalletService {
  constructor() {
    this.server = null
    this.isTestMode = false
  }

  getServer() {
    if (!this.server) {
      const horizonUrl = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org'
      this.server = new Server(horizonUrl)
    }
    return this.server
  }

  async connectWallet() {
    try {
      // Check if Freighter is available
      if (typeof window !== 'undefined' && window.freighter) {
        return await this.connectFreighter()
      } else {
        // Fallback to test mode
        return this.connectTestMode()
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      return this.connectTestMode()
    }
  }

  async connectFreighter() {
    try {
      const isAllowed = await window.freighter.isAllowed()
      
      if (!isAllowed) {
        await window.freighter.setAllowed()
      }

      const publicKey = await window.freighter.getPublicKey()
      const balance = await this.getBalance(publicKey)

      return {
        success: true,
        address: publicKey,
        balance: balance,
        isTestMode: false
      }
    } catch (error) {
      console.error('Freighter connection failed:', error)
      throw error
    }
  }

  connectTestMode() {
    console.warn('⚠️ Using TEST MODE - Freighter wallet not detected')
    
    // Generate a mock testnet address
    const mockAddress = 'GBMEDLEDGERTEST' + 'X'.repeat(32) + 'TESTNET'
    const mockBalance = '9999.99'

    this.isTestMode = true

    return {
      success: true,
      address: mockAddress,
      balance: mockBalance,
      isTestMode: true
    }
  }

  async getBalance(publicKey) {
    if (this.isTestMode) {
      return '9999.99'
    }

    try {
      const server = this.getServer()
      const account = await server.loadAccount(publicKey)
      const xlmBalance = account.balances.find(balance => balance.asset_type === 'native')
      return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : '0.00'
    } catch (error) {
      console.error('Error fetching balance:', error)
      return '0.00'
    }
  }

  async signTransaction(transaction) {
    if (this.isTestMode) {
      // Mock transaction signing for test mode
      return {
        success: true,
        signedTransaction: 'mock_signed_transaction_' + Date.now(),
        transactionHash: 'mock_hash_' + Date.now()
      }
    }

    try {
      const signedTransaction = await window.freighter.signTransaction(transaction, {
        network: import.meta.env.VITE_STELLAR_NETWORK,
        accountToSign: await window.freighter.getPublicKey()
      })

      return {
        success: true,
        signedTransaction: signedTransaction
      }
    } catch (error) {
      console.error('Transaction signing failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async submitTransaction(signedTransaction) {
    if (this.isTestMode) {
      // Mock transaction submission
      return {
        success: true,
        hash: 'mock_transaction_hash_' + Date.now(),
        ledger: Math.floor(Math.random() * 1000000)
      }
    }

    try {
      const server = this.getServer()
      const result = await server.submitTransaction(signedTransaction)
      return {
        success: true,
        hash: result.hash,
        ledger: result.ledger
      }
    } catch (error) {
      console.error('Transaction submission failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  isFreighterAvailable() {
    return typeof window !== 'undefined' && window.freighter
  }

  getNetworkPassphrase() {
    return import.meta.env.VITE_STELLAR_NETWORK === 'testnet' 
      ? 'Test SDF Network ; September 2015'
      : 'Public Global Stellar Network ; September 2015'
  }
}

export const walletService = new WalletService()