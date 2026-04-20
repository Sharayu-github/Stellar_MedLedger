import React, { createContext, useContext, useState, useEffect } from 'react'
import { walletService } from '../services/walletService'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [balance, setBalance] = useState('0')
  const [isTestMode, setIsTestMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Auto-connect on app load with error handling
    const initializeWallet = async () => {
      try {
        await connectWallet()
      } catch (err) {
        console.error('Failed to initialize wallet:', err)
        setError(err.message)
      }
    }
    
    initializeWallet()
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await walletService.connectWallet()
      
      if (result.success) {
        setIsConnected(true)
        setWalletAddress(result.address)
        setBalance(result.balance)
        setIsTestMode(result.isTestMode)
      } else {
        throw new Error(result.error || 'Wallet connection failed')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setError(error.message)
      
      // Fallback to test mode on any error
      setIsConnected(true)
      setWalletAddress('GBMEDLEDGERTEST' + 'X'.repeat(32) + 'TESTNET')
      setBalance('9999.99')
      setIsTestMode(true)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress('')
    setBalance('0')
    setIsTestMode(false)
    setError(null)
  }

  const refreshBalance = async () => {
    if (isConnected && walletAddress && !isTestMode) {
      try {
        const newBalance = await walletService.getBalance(walletAddress)
        setBalance(newBalance)
      } catch (error) {
        console.error('Error refreshing balance:', error)
        setError('Failed to refresh balance')
      }
    }
  }

  const value = {
    isConnected,
    walletAddress,
    balance,
    isTestMode,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}