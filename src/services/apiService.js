import axios from 'axios'

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('medledger_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('medledger_token')
          window.location.href = '/'
        }
        return Promise.reject(error)
      }
    )
  }

  // Health Records API
  async uploadRecord(recordData) {
    try {
      const response = await this.api.post('/records/upload', recordData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async verifyRecord(recordId, fileHash) {
    try {
      const response = await this.api.post('/records/verify', {
        recordId,
        fileHash
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getRecord(recordId) {
    try {
      const response = await this.api.get(`/records/${recordId}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getUserRecords(walletAddress) {
    try {
      const response = await this.api.get(`/records/user/${walletAddress}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getAllRecords(page = 1, limit = 10) {
    try {
      const response = await this.api.get(`/records?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateRecord(recordId, updateData) {
    try {
      const response = await this.api.put(`/records/${recordId}`, updateData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Analytics API
  async getAnalytics(walletAddress) {
    try {
      const response = await this.api.get(`/analytics/${walletAddress}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getSystemStats() {
    try {
      const response = await this.api.get('/analytics/system')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Blockchain API
  async submitToBlockchain(transactionData) {
    try {
      const response = await this.api.post('/blockchain/submit', transactionData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getBlockchainStatus(transactionHash) {
    try {
      const response = await this.api.get(`/blockchain/status/${transactionHash}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Utility methods
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1
      }
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get('/health')
      return response.data
    } catch (error) {
      return { status: 'error', message: 'Backend not available' }
    }
  }
}

export const apiService = new ApiService()