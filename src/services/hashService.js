import CryptoJS from 'crypto-js'

class HashService {
  /**
   * Calculate SHA-256 hash of a file
   * @param {File} file - The file to hash
   * @returns {Promise<string>} - The SHA-256 hash
   */
  async calculateFileHash(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target.result
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
          const hash = CryptoJS.SHA256(wordArray).toString()
          resolve(hash)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Calculate SHA-256 hash of a string
   * @param {string} data - The string to hash
   * @returns {string} - The SHA-256 hash
   */
  calculateStringHash(data) {
    return CryptoJS.SHA256(data).toString()
  }

  /**
   * Generate a unique record ID based on patient info and timestamp
   * @param {Object} recordInfo - Record information
   * @returns {string} - Unique record ID
   */
  generateRecordId(recordInfo) {
    const { patientId, recordType, timestamp } = recordInfo
    const dataString = `${patientId}_${recordType}_${timestamp || Date.now()}`
    return this.calculateStringHash(dataString).substring(0, 16).toUpperCase()
  }

  /**
   * Verify if two hashes match
   * @param {string} hash1 - First hash
   * @param {string} hash2 - Second hash
   * @returns {boolean} - Whether hashes match
   */
  verifyHashes(hash1, hash2) {
    return hash1.toLowerCase() === hash2.toLowerCase()
  }

  /**
   * Generate metadata hash for record verification
   * @param {Object} metadata - Record metadata
   * @returns {string} - Metadata hash
   */
  generateMetadataHash(metadata) {
    const sortedMetadata = Object.keys(metadata)
      .sort()
      .reduce((result, key) => {
        result[key] = metadata[key]
        return result
      }, {})
    
    return this.calculateStringHash(JSON.stringify(sortedMetadata))
  }
}

export const hashService = new HashService()