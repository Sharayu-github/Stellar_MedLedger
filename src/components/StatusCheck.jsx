import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader, Wifi, Server } from 'lucide-react'

const StatusCheck = () => {
  const [frontendStatus, setFrontendStatus] = useState('checking')
  const [backendStatus, setBackendStatus] = useState('checking')
  const [walletStatus, setWalletStatus] = useState('checking')

  useEffect(() => {
    checkStatuses()
  }, [])

  const checkStatuses = async () => {
    // Check frontend (always true if this component is rendering)
    setFrontendStatus('online')

    // Check backend
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        setBackendStatus('online')
      } else {
        setBackendStatus('offline')
      }
    } catch (error) {
      setBackendStatus('offline')
    }

    // Check wallet
    if (typeof window !== 'undefined' && window.freighter) {
      setWalletStatus('available')
    } else {
      setWalletStatus('test-mode')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'test-mode':
        return <CheckCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Loader className="h-5 w-5 text-gray-500 animate-spin" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'available':
        return 'Available'
      case 'offline':
        return 'Offline'
      case 'test-mode':
        return 'Test Mode'
      default:
        return 'Checking...'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <h4 className="text-sm font-medium text-gray-900 mb-3">System Status</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-gray-400" />
            <span>Frontend</span>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusIcon(frontendStatus)}
            <span className="text-xs">{getStatusText(frontendStatus)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-gray-400" />
            <span>Backend</span>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusIcon(backendStatus)}
            <span className="text-xs">{getStatusText(backendStatus)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-medical-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">F</span>
            </div>
            <span>Wallet</span>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusIcon(walletStatus)}
            <span className="text-xs">{getStatusText(walletStatus)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          MedLedger v1.0.0
        </div>
      </div>
    </div>
  )
}

export default StatusCheck