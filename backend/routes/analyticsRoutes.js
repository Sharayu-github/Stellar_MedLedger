import express from 'express'
import { recordService } from '../services/recordService.js'

const router = express.Router()

// Get user analytics
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    
    // Get user records
    const userRecordsResult = await recordService.getUserRecords(walletAddress, 1, 1000)
    
    if (!userRecordsResult.success) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const records = userRecordsResult.data.records
    
    // Calculate analytics
    const analytics = {
      totalRecords: records.length,
      recordsByType: {},
      recordsByProvider: {},
      recentActivity: records.slice(0, 5).map(record => ({
        recordId: record.recordId,
        recordType: record.recordType,
        providerName: record.providerName,
        createdAt: record.createdAt,
        status: record.status
      })),
      monthlyStats: calculateMonthlyStats(records)
    }

    // Group by type
    records.forEach(record => {
      analytics.recordsByType[record.recordType] = 
        (analytics.recordsByType[record.recordType] || 0) + 1
    })

    // Group by provider
    records.forEach(record => {
      analytics.recordsByProvider[record.providerName] = 
        (analytics.recordsByProvider[record.providerName] || 0) + 1
    })

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics',
      error: error.message
    })
  }
})

// Get system-wide statistics
router.get('/', async (req, res) => {
  try {
    const stats = recordService.getStats()
    
    const systemAnalytics = {
      ...stats,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }

    res.json({
      success: true,
      data: systemAnalytics
    })
  } catch (error) {
    console.error('System analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system analytics',
      error: error.message
    })
  }
})

// Helper function to calculate monthly statistics
function calculateMonthlyStats(records) {
  const monthlyData = {}
  const now = new Date()
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = date.toISOString().substring(0, 7) // YYYY-MM format
    monthlyData[key] = 0
  }
  
  // Count records by month
  records.forEach(record => {
    const recordDate = new Date(record.createdAt)
    const monthKey = recordDate.toISOString().substring(0, 7)
    if (monthlyData.hasOwnProperty(monthKey)) {
      monthlyData[monthKey]++
    }
  })
  
  return Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count
  }))
}

export default router