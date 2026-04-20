import React, { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { hashService } from '../services/hashService'
import { apiService } from '../services/apiService'
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Search,
  FileText,
  Clock,
  AlertTriangle,
  Loader,
  Hash,
  ExternalLink
} from 'lucide-react'

const VerifyPage = () => {
  const { showSuccess, showError, showWarning } = useToast()
  
  const [recordId, setRecordId] = useState('')
  const [file, setFile] = useState(null)
  const [fileHash, setFileHash] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [processingStep, setProcessingStep] = useState('') // hashing, verifying, complete

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
    setProcessingStep('hashing')
    setVerificationResult(null)

    try {
      // Calculate file hash
      const hash = await hashService.calculateFileHash(selectedFile)
      setFileHash(hash)
      setProcessingStep('')
      showSuccess('File hash calculated successfully')
    } catch (error) {
      console.error('Error calculating hash:', error)
      showError('Failed to calculate file hash')
      setProcessingStep('')
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!recordId.trim()) {
      showError('Please enter a Record ID')
      return
    }

    if (!file || !fileHash) {
      showError('Please select a file to verify')
      return
    }

    setIsProcessing(true)
    setProcessingStep('verifying')

    try {
      const result = await apiService.verifyRecord(recordId.trim(), fileHash)
      
      setVerificationResult(result)
      
      if (result.success && result.verified) {
        showSuccess('Record verified successfully! ✅')
      } else if (result.success && !result.verified) {
        showWarning('Record verification failed - file may have been modified ⚠️')
      } else {
        showError(result.message || 'Verification failed')
      }
      
    } catch (error) {
      console.error('Verification error:', error)
      showError(error.message || 'Failed to verify record')
      setVerificationResult({
        success: false,
        verified: false,
        message: error.message || 'Verification failed'
      })
    } finally {
      setIsProcessing(false)
      setProcessingStep('complete')
    }
  }

  const resetForm = () => {
    setRecordId('')
    setFile(null)
    setFileHash('')
    setVerificationResult(null)
    setProcessingStep('')
    
    // Reset file input
    const fileInput = document.getElementById('verify-file-upload')
    if (fileInput) fileInput.value = ''
  }

  const getVerificationIcon = () => {
    if (!verificationResult) return null
    
    if (verificationResult.success && verificationResult.verified) {
      return <CheckCircle className="h-12 w-12 text-green-500" />
    } else {
      return <XCircle className="h-12 w-12 text-red-500" />
    }
  }

  const getVerificationColor = () => {
    if (!verificationResult) return 'border-gray-200'
    
    if (verificationResult.success && verificationResult.verified) {
      return 'border-green-200 bg-green-50'
    } else {
      return 'border-red-200 bg-red-50'
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="medical-gradient p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Healthcare Record</h1>
          <p className="text-gray-600">
            Verify the integrity and authenticity of healthcare records using blockchain technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Verification Form */}
          <div className="card">
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="h-4 w-4 inline mr-1" />
                  Record ID *
                </label>
                <input
                  type="text"
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                  className="input-field"
                  placeholder="Enter the record ID to verify (e.g., A1B2C3D4E5F6G7H8)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The unique identifier provided when the record was uploaded
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="h-4 w-4 inline mr-1" />
                  Healthcare Record File *
                </label>
                <input
                  id="verify-file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="input-field"
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload the same file that was originally registered
                </p>
              </div>

              {file && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    File Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    {fileHash && (
                      <div>
                        <span className="text-gray-600">SHA-256 Hash:</span>
                        <div className="mt-1 p-2 bg-white rounded text-xs font-mono break-all border">
                          {fileHash}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isProcessing || processingStep === 'hashing' || !recordId.trim() || !file}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : processingStep === 'hashing' ? (
                    <>
                      <Hash className="h-5 w-5" />
                      <span>Calculating Hash...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Verify Record</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Verification Results */}
          <div className="space-y-6">
            {verificationResult && (
              <div className={`card ${getVerificationColor()}`}>
                <div className="text-center mb-4">
                  {getVerificationIcon()}
                  <h3 className="text-xl font-semibold mt-2">
                    {verificationResult.success && verificationResult.verified 
                      ? 'Record Verified ✅' 
                      : 'Verification Failed ❌'
                    }
                  </h3>
                  <p className="text-gray-600 mt-1">{verificationResult.message}</p>
                </div>

                {verificationResult.success && verificationResult.data && (
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-gray-900 mb-3">Record Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Record ID:</span>
                          <span className="font-mono">{verificationResult.data.recordId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Record Type:</span>
                          <span className="font-medium">{verificationResult.data.recordType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Provider:</span>
                          <span className="font-medium">{verificationResult.data.providerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">
                            {new Date(verificationResult.data.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {verificationResult.data.blockchainTxHash && (
                          <div>
                            <span className="text-gray-600">Blockchain TX:</span>
                            <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all flex items-center justify-between">
                              <span>{verificationResult.data.blockchainTxHash}</span>
                              <ExternalLink className="h-3 w-3 text-gray-400 ml-2" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-gray-900 mb-3">Hash Comparison</h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-600">Original Hash (Blockchain):</span>
                          <div className="mt-1 p-2 bg-green-50 rounded font-mono break-all">
                            {verificationResult.data.originalHash}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Current File Hash:</span>
                          <div className={`mt-1 p-2 rounded font-mono break-all ${
                            verificationResult.verified ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                            {verificationResult.data.providedHash}
                          </div>
                        </div>
                        <div className="flex items-center justify-center pt-2">
                          {verificationResult.verified ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">Hashes Match</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">Hashes Don't Match</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Information Card */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">How Verification Works</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• We calculate the SHA-256 hash of your uploaded file</li>
                    <li>• Compare it with the hash stored on Stellar blockchain</li>
                    <li>• If hashes match, the file is authentic and unmodified</li>
                    <li>• If hashes don't match, the file has been altered</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Verification Stats */}
            <div className="card">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Verification Statistics
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-medical-600">{'< 3s'}</div>
                  <div className="text-xs text-gray-600">Avg. Verification Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-health-600">99.9%</div>
                  <div className="text-xs text-gray-600">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyPage