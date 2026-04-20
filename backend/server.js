import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

// Import routes
import recordRoutes from './routes/recordRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import blockchainRoutes from './routes/blockchainRoutes.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
})
app.use('/api/', limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Logging
app.use(morgan('combined'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  })
})

// API Routes
app.use('/api/records', recordRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/blockchain', blockchainRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MedLedger API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      records: '/api/records',
      analytics: '/api/analytics',
      blockchain: '/api/blockchain'
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🏥 MedLedger API Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`)
  console.log(`⭐ Stellar Network: ${process.env.STELLAR_NETWORK}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})

export default app