import express from 'express'
import { body, validationResult } from 'express-validator'
import { recordService } from '../services/recordService.js'

const router = express.Router()

// Validation middleware
const validateRecord = [
  body('recordId').notEmpty().withMessage('Record ID is required'),
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('recordType').notEmpty().withMessage('Record type is required'),
  body('providerName').notEmpty().withMessage('Provider name is required'),
  body('fileHash').isLength({ min: 64, max: 64 }).withMessage('Invalid file hash'),
  body('uploaderAddress').notEmpty().withMessage('Uploader address is required')
]

const validateVerification = [
  body('recordId').notEmpty().withMessage('Record ID is required'),
  body('fileHash').isLength({ min: 64, max: 64 }).withMessage('Invalid file hash')
]

// Upload new healthcare record
router.post('/upload', validateRecord, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const recordData = req.body
    const result = await recordService.uploadRecord(recordData)
    
    res.json(result)
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload record',
      error: error.message
    })
  }
})

// Verify healthcare record
router.post('/verify', validateVerification, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { recordId, fileHash } = req.body
    const result = await recordService.verifyRecord(recordId, fileHash)
    
    res.json(result)
  } catch (error) {
    console.error('Verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify record',
      error: error.message
    })
  }
})

// Get specific record by ID
router.get('/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params
    const result = await recordService.getRecord(recordId)
    
    if (!result.success) {
      return res.status(404).json(result)
    }
    
    res.json(result)
  } catch (error) {
    console.error('Get record error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve record',
      error: error.message
    })
  }
})

// Get records by user wallet address
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    
    const result = await recordService.getUserRecords(walletAddress, page, limit)
    res.json(result)
  } catch (error) {
    console.error('Get user records error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user records',
      error: error.message
    })
  }
})

// Get all records (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const recordType = req.query.recordType
    const providerName = req.query.providerName
    
    const filters = {}
    if (recordType) filters.recordType = recordType
    if (providerName) filters.providerName = providerName
    
    const result = await recordService.getAllRecords(page, limit, filters)
    res.json(result)
  } catch (error) {
    console.error('Get all records error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve records',
      error: error.message
    })
  }
})

// Update record (for authorized users only)
router.put('/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params
    const updateData = req.body
    
    const result = await recordService.updateRecord(recordId, updateData)
    
    if (!result.success) {
      return res.status(404).json(result)
    }
    
    res.json(result)
  } catch (error) {
    console.error('Update record error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update record',
      error: error.message
    })
  }
})

// Search records
router.post('/search', async (req, res) => {
  try {
    const { query, filters, page = 1, limit = 10 } = req.body
    
    const result = await recordService.searchRecords(query, filters, page, limit)
    res.json(result)
  } catch (error) {
    console.error('Search records error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to search records',
      error: error.message
    })
  }
})

export default router