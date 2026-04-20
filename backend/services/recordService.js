import crypto from 'crypto'

class RecordService {
  constructor() {
    // In-memory storage for development (replace with database in production)
    this.records = new Map()
    this.recordsByUser = new Map()
  }

  async uploadRecord(recordData) {
    try {
      // Validate record data
      if (!recordData.recordId || !recordData.fileHash) {
        throw new Error('Missing required record data')
      }

      // Check if record already exists
      if (this.records.has(recordData.recordId)) {
        return {
          success: false,
          message: 'Record with this ID already exists'
        }
      }

      // Create record entry
      const record = {
        ...recordData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'verified',
        blockchainTxHash: this.generateMockTxHash(),
        version: 1
      }

      // Store record
      this.records.set(recordData.recordId, record)

      // Index by user
      const userRecords = this.recordsByUser.get(recordData.uploaderAddress) || []
      userRecords.push(recordData.recordId)
      this.recordsByUser.set(recordData.uploaderAddress, userRecords)

      // Simulate blockchain submission delay
      await this.simulateBlockchainSubmission(record)

      return {
        success: true,
        message: 'Record uploaded successfully',
        data: {
          recordId: record.recordId,
          blockchainTxHash: record.blockchainTxHash,
          timestamp: record.createdAt
        }
      }
    } catch (error) {
      console.error('Upload record error:', error)
      return {
        success: false,
        message: error.message || 'Failed to upload record'
      }
    }
  }

  async verifyRecord(recordId, fileHash) {
    try {
      const record = this.records.get(recordId)
      
      if (!record) {
        return {
          success: false,
          message: 'Record not found',
          verified: false
        }
      }

      const isValid = record.fileHash === fileHash
      
      return {
        success: true,
        verified: isValid,
        message: isValid ? 'Record verified successfully' : 'Record hash mismatch - file may have been modified',
        data: {
          recordId: record.recordId,
          originalHash: record.fileHash,
          providedHash: fileHash,
          recordType: record.recordType,
          providerName: record.providerName,
          createdAt: record.createdAt,
          blockchainTxHash: record.blockchainTxHash
        }
      }
    } catch (error) {
      console.error('Verify record error:', error)
      return {
        success: false,
        message: error.message || 'Failed to verify record',
        verified: false
      }
    }
  }

  async getRecord(recordId) {
    try {
      const record = this.records.get(recordId)
      
      if (!record) {
        return {
          success: false,
          message: 'Record not found'
        }
      }

      // Return record without sensitive patient data
      const publicRecord = {
        recordId: record.recordId,
        recordType: record.recordType,
        providerName: record.providerName,
        description: record.description,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        status: record.status,
        blockchainTxHash: record.blockchainTxHash,
        version: record.version,
        fileHash: record.fileHash
      }

      return {
        success: true,
        data: publicRecord
      }
    } catch (error) {
      console.error('Get record error:', error)
      return {
        success: false,
        message: error.message || 'Failed to retrieve record'
      }
    }
  }

  async getUserRecords(walletAddress, page = 1, limit = 10) {
    try {
      const userRecordIds = this.recordsByUser.get(walletAddress) || []
      
      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedIds = userRecordIds.slice(startIndex, endIndex)
      
      const records = paginatedIds.map(id => {
        const record = this.records.get(id)
        return record ? {
          recordId: record.recordId,
          patientName: record.patientName,
          recordType: record.recordType,
          providerName: record.providerName,
          description: record.description,
          createdAt: record.createdAt,
          status: record.status,
          blockchainTxHash: record.blockchainTxHash
        } : null
      }).filter(Boolean)

      return {
        success: true,
        data: {
          records,
          pagination: {
            page,
            limit,
            total: userRecordIds.length,
            totalPages: Math.ceil(userRecordIds.length / limit)
          }
        }
      }
    } catch (error) {
      console.error('Get user records error:', error)
      return {
        success: false,
        message: error.message || 'Failed to retrieve user records'
      }
    }
  }

  async getAllRecords(page = 1, limit = 10, filters = {}) {
    try {
      let allRecords = Array.from(this.records.values())
      
      // Apply filters
      if (filters.recordType) {
        allRecords = allRecords.filter(record => 
          record.recordType.toLowerCase().includes(filters.recordType.toLowerCase())
        )
      }
      
      if (filters.providerName) {
        allRecords = allRecords.filter(record => 
          record.providerName.toLowerCase().includes(filters.providerName.toLowerCase())
        )
      }

      // Sort by creation date (newest first)
      allRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedRecords = allRecords.slice(startIndex, endIndex)
      
      const publicRecords = paginatedRecords.map(record => ({
        recordId: record.recordId,
        recordType: record.recordType,
        providerName: record.providerName,
        description: record.description,
        createdAt: record.createdAt,
        status: record.status,
        blockchainTxHash: record.blockchainTxHash
      }))

      return {
        success: true,
        data: {
          records: publicRecords,
          pagination: {
            page,
            limit,
            total: allRecords.length,
            totalPages: Math.ceil(allRecords.length / limit)
          }
        }
      }
    } catch (error) {
      console.error('Get all records error:', error)
      return {
        success: false,
        message: error.message || 'Failed to retrieve records'
      }
    }
  }

  async updateRecord(recordId, updateData) {
    try {
      const record = this.records.get(recordId)
      
      if (!record) {
        return {
          success: false,
          message: 'Record not found'
        }
      }

      // Create new version
      const updatedRecord = {
        ...record,
        ...updateData,
        updatedAt: new Date().toISOString(),
        version: record.version + 1,
        previousVersion: record.version
      }

      this.records.set(recordId, updatedRecord)

      return {
        success: true,
        message: 'Record updated successfully',
        data: {
          recordId: updatedRecord.recordId,
          version: updatedRecord.version,
          updatedAt: updatedRecord.updatedAt
        }
      }
    } catch (error) {
      console.error('Update record error:', error)
      return {
        success: false,
        message: error.message || 'Failed to update record'
      }
    }
  }

  async searchRecords(query, filters = {}, page = 1, limit = 10) {
    try {
      let allRecords = Array.from(this.records.values())
      
      // Text search
      if (query) {
        const searchTerm = query.toLowerCase()
        allRecords = allRecords.filter(record => 
          record.recordType.toLowerCase().includes(searchTerm) ||
          record.providerName.toLowerCase().includes(searchTerm) ||
          record.description.toLowerCase().includes(searchTerm) ||
          record.recordId.toLowerCase().includes(searchTerm)
        )
      }

      // Apply additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          allRecords = allRecords.filter(record => 
            record[key] && record[key].toLowerCase().includes(filters[key].toLowerCase())
          )
        }
      })

      // Sort by relevance/date
      allRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedRecords = allRecords.slice(startIndex, endIndex)
      
      const publicRecords = paginatedRecords.map(record => ({
        recordId: record.recordId,
        recordType: record.recordType,
        providerName: record.providerName,
        description: record.description,
        createdAt: record.createdAt,
        status: record.status
      }))

      return {
        success: true,
        data: {
          records: publicRecords,
          pagination: {
            page,
            limit,
            total: allRecords.length,
            totalPages: Math.ceil(allRecords.length / limit)
          },
          query,
          filters
        }
      }
    } catch (error) {
      console.error('Search records error:', error)
      return {
        success: false,
        message: error.message || 'Failed to search records'
      }
    }
  }

  // Helper methods
  generateMockTxHash() {
    return crypto.randomBytes(32).toString('hex')
  }

  async simulateBlockchainSubmission(record) {
    // Simulate blockchain submission delay
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`✅ Record ${record.recordId} submitted to blockchain: ${record.blockchainTxHash}`)
        resolve()
      }, 1000)
    })
  }

  // Get statistics
  getStats() {
    const totalRecords = this.records.size
    const totalProviders = new Set(Array.from(this.records.values()).map(r => r.providerName)).size
    const recordTypes = {}
    
    Array.from(this.records.values()).forEach(record => {
      recordTypes[record.recordType] = (recordTypes[record.recordType] || 0) + 1
    })

    return {
      totalRecords,
      totalProviders,
      recordTypes,
      totalUsers: this.recordsByUser.size
    }
  }
}

export const recordService = new RecordService()