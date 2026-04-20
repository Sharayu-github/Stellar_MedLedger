import React, { useState } from 'react'
import { useWallet } from '../context/WalletContext'
import { useToast } from '../context/ToastContext'
import { hashService } from '../services/hashService'
import { apiService } from '../services/apiService'
import { 
  Upload, 
  FileText, 
  Shield, 
  User, 
  Calendar, 
  Hash,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react'

const UploadPage = () => {
  const { isConnected, walletAddress } = useWallet()
  const { showSuccess, showError, showWarning } = useToast()
  
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    recordType: '',
    description: '',
    providerName: '',
    providerLicense: ''
  })
  
  const [file, setFile] = useState(null)
  const [fileHash, setFileHash] = useState('')
  const [recordId, setRecordId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('idle') // idle, hashing, uploading, success

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB')
      return
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      showError('Unsupported file type. Please use PDF, images, or documents.')
      return
    }

    setFile(selectedFile)
    setUploadStatus('hashing')

    try {
      // Calculate file hash
      const hash = await hashService.calculateFileHash(selectedFile)
      setFileHash(hash)
      
      // Generate record ID
      const recordInfo = {
        patientId: formData.patientId || 'temp',
        recordType: formData.recordType || 'temp',
        timestamp: Date.now()
      }
      const generatedRecordId = hashService.generateRecordId(recordInfo)
      setRecordId(generatedRecordId)
      
      setUploadStatus('idle')
      showSuccess('File processed successfully')
    } catch (error) {
      console.error('Error processing file:', error)
      showError('Failed to process file')
      setUploadStatus('idle')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isConnected) {
      showWarning('Please connect your wallet first')
      return
    }

    if (!file || !fileHash) {
      showError('Please select a file first')
      return
    }

    // Validate required fields
    const requiredFields = ['patientId', 'patientName', 'recordType', 'providerName']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      showError(`Please fill in: ${missingFields.join(', ')}`)
      return
    }

    setIsProcessing(true)
    setUploadStatus('uploading')

    try {
      // Prepare record data
      const recordData = {
        recordId,
        patientId: formData.patientId,
        patientName: formData.patientName,
        recordType: formData.recordType,
        description: formData.description,
        providerName: formData.providerName,
        providerLicense: formData.providerLicense,
        fileHash,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploaderAddress: walletAddress,
        timestamp: new Date().toISOString()
      }

      // Submit to backend
      const response = await apiService.uploadRecord(recordData)
      
      if (response.success) {
        setUploadStatus('success')
        showSuccess('Healthcare record uploaded and verified on blockchain!')
        
        // Reset form
        setFormData({
          patientId: '',
          patientName: '',
          recordType: '',
          description: '',
          providerName: '',
          providerLicense: ''
        })
        setFile(null)
        setFileHash('')
        setRecordId('')
        
        // Reset file input
        const fileInput = document.getElementById('file-upload')
        if (fileInput) fileInput.value = ''
        
      } else {
        throw new Error(response.message || 'Upload failed')
      }
      
    } catch (error) {
      console.error('Upload error:', error)
      showError(error.message || 'Failed to upload record')
      setUploadStatus('idle')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <Shield className="h-16 w-16 text-medical-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Required</h2>
          <p className="text-gray-600 mb-6">
            Please connect your Freighter wallet to upload healthcare records to the blockchain.
          </p>
          <button className="btn-primary w-full">
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="medical-gradient p-3 rounded-xl">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Healthcare Record</h1>
          <p className="text-gray-600">
            Securely store healthcare record verification on Stellar blockchain
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., P123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Record Type *
                </label>
                <select
                  name="recordType"
                  value={formData.recordType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select record type</option>
                  {recordTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                  placeholder="Brief description of the record..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Healthcare Provider *
                  </label>
                  <input
                    type="text"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Hospital/Clinic name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider License
                  </label>
                  <input
                    type="text"
                    name="providerLicense"
                    value={formData.providerLicense}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="License number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="h-4 w-4 inline mr-1" />
                  Medical Record File *
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="input-field"
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported: PDF, Images, Documents (Max 10MB)
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing || uploadStatus === 'hashing'}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : uploadStatus === 'hashing' ? (
                  <>
                    <Hash className="h-5 w-5" />
                    <span>Calculating Hash...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Upload to Blockchain</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* File Information */}
          <div className="space-y-6">
            {file && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  File Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{file.type}</span>
                  </div>
                  {fileHash && (
                    <div>
                      <span className="text-gray-600">SHA-256 Hash:</span>
                      <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
                        {fileHash}
                      </div>
                    </div>
                  )}
                  {recordId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Record ID:</span>
                      <span className="font-medium font-mono">{recordId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-900">Upload Successful!</h3>
                </div>
                <p className="text-green-700 mb-4">
                  Your healthcare record has been successfully uploaded and verified on the Stellar blockchain.
                </p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600 mb-2">Record ID for future verification:</p>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{recordId}</code>
                </div>
              </div>
            )}

            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Privacy Notice</h4>
                  <p className="text-sm text-blue-700">
                    Only the cryptographic hash of your file is stored on the blockchain. 
                    The actual medical record remains private and is not uploaded to the blockchain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage