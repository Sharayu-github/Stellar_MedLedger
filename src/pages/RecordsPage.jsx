import React, { useState, useEffect } from 'react'
import { useWallet } from '../context/WalletContext'
import { useToast } from '../context/ToastContext'
import { apiService } from '../services/apiService'
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar,
  User,
  Building,
  ExternalLink,
  Eye,
  Loader,
  RefreshCw
} from 'lucide-react'

const RecordsPage = () => {
  const { isConnected, walletAddress } = useWallet()
  const { showError, showSuccess } = useToast()
  
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterProvider, setFilterProvider] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState('my') // 'my' or 'all'

  const recordTypes = [
    'Lab Results',
    'Radiology Report', 
    'Prescription',
    'Discharge Summary',
    'Consultation Notes',
    'Surgical Report',
    'Vaccination Record',
    'Other'
  ]

  useEffect(() => {
    if (viewMode === 'my' && isConnected) {
      loadUserRecords()
    } else if (viewMode === 'all') {
      loadAllRecords()
    }
  }, [isConnected, walletAddress, viewMode, currentPage, filterType, filterProvider])

  const loadUserRecords = async () => {
    if (!walletAddress) return
    
    setLoading(true)
    try {
      const result = await apiService.getUserRecords(walletAddress)
      if (result.success) {
        setRecords(result.data.records)
        setTotalPages(result.data.pagination.totalPages)
        showSuccess(`Loaded ${result.data.records.length} records`)
      } else {
        showError(result.message || 'Failed to load records')
      }
    } catch (error) {
      console.error('Error loading user records:', error)
      showError('Failed to load your records')
    } finally {
      setLoading(false)
    }
  }

  const loadAllRecords = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (filterType) params.append('recordType', filterType)
      if (filterProvider) params.append('providerName', filterProvider)
      
      const result = await apiService.getAllRecords(currentPage, 10)
      if (result.success) {
        setRecords(result.data.records)
        setTotalPages(result.data.pagination.totalPages)
      } else {
        showError(result.message || 'Failed to load records')
      }
    } catch (error) {
      console.error('Error loading all records:', error)
      showError('Failed to load records')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    // Filter records based on search term
    if (!searchTerm.trim()) {
      if (viewMode === 'my') {
        loadUserRecords()
      } else {
        loadAllRecords()
      }
      return
    }

    const filtered = records.filter(record => 
      record.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.description && record.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    
    setRecords(filtered)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setFilterType('')
    setFilterProvider('')
    setCurrentPage(1)
    if (viewMode === 'my') {
      loadUserRecords()
    } else {
      loadAllRecords()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isConnected && viewMode === 'my') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <FileText className="h-16 w-16 text-medical-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Required</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view your healthcare records.
          </p>
          <div className="space-y-3">
            <button className="btn-primary w-full">
              Connect Wallet
            </button>
            <button 
              onClick={() => setViewMode('all')}
              className="btn-secondary w-full"
            >
              Browse All Records
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="medical-gradient p-3 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Records</h1>
          <p className="text-gray-600">
            Browse and manage healthcare records on the blockchain
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('my')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'my' 
                  ? 'bg-white text-medical-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={!isConnected}
            >
              My Records
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'all' 
                  ? 'bg-white text-medical-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Records
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input-field pl-10"
                  placeholder="Search records by ID, type, or provider..."
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                {recordTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSearch}
                className="btn-primary flex items-center space-x-1"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
              <button
                onClick={resetFilters}
                className="btn-secondary flex items-center space-x-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Records List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-medical-600" />
            <span className="ml-2 text-gray-600">Loading records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-600">
              {viewMode === 'my' 
                ? "You haven't uploaded any healthcare records yet." 
                : "No records match your search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.recordId} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.recordType}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>Record ID: </span>
                          <code className="font-mono text-xs bg-gray-100 px-1 rounded">
                            {record.recordId}
                          </code>
                        </div>
                        {record.patientName && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>Patient: {record.patientName}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          <span>Provider: {record.providerName}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Created: {formatDate(record.createdAt)}</span>
                        </div>
                        {record.description && (
                          <div>
                            <span className="font-medium">Description: </span>
                            <span>{record.description}</span>
                          </div>
                        )}
                        {record.blockchainTxHash && (
                          <div className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span className="font-mono text-xs">
                              TX: {record.blockchainTxHash.substring(0, 16)}...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button className="btn-secondary flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? 'bg-medical-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordsPage