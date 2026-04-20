import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import { Heart, Wallet, Menu, X, Shield, Activity } from 'lucide-react'

const Navbar = () => {
  const { isConnected, walletAddress, balance, isTestMode, connectWallet, isLoading } = useWallet()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Heart },
    { name: 'Upload Record', href: '/upload', icon: Shield },
    { name: 'Verify Record', href: '/verify', icon: Activity },
    { name: 'My Records', href: '/records', icon: Wallet },
    { name: 'Dashboard', href: '/dashboard', icon: Activity }
  ]

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="medical-gradient p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MedLedger</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.href)
                      ? 'text-medical-600 bg-medical-50'
                      : 'text-gray-600 hover:text-medical-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                {isTestMode && (
                  <div className="hidden sm:flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    ⚠️ TEST MODE
                  </div>
                )}
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {formatAddress(walletAddress)}
                  </div>
                  <div className="text-xs text-gray-500">{balance} XLM</div>
                </div>
                <div className="w-8 h-8 bg-medical-100 rounded-full flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-medical-600" />
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActivePath(item.href)
                        ? 'text-medical-600 bg-medical-50'
                        : 'text-gray-600 hover:text-medical-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {isConnected && isTestMode && (
                <div className="px-3 py-2">
                  <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full w-fit">
                    ⚠️ TEST MODE - Freighter not detected
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar