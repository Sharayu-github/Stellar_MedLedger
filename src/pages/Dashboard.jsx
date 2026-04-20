import React, { useState, useEffect } from 'react'
import { useWallet } from '../context/WalletContext'
import { useToast } from '../context/ToastContext'
import { apiService } from '../services/apiService'
import { 
  Activity, 
  FileText, 
  Shield, 
  TrendingUp,
  Calendar,
  Building,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Loader
} from 'lucide-react'

const Dashboard = () => {
  const { isConnected, walletAddress } = useWallet()
  const { showError } = useToast()
  
  const [analytics, setAnalytics] = useState(null)
  const [systemStats, setSystemStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadAnalytics()
    }
    loadSystemStats()
  }, [isConnected, walletAddress])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const result = await apiService.getAnalytics(walletAddress)
      if (result.success) {
        setAnalytics(result.data)
      } else {
        showError(result.message || 'Failed to load analytics')
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      showError('Failed to load your analytics')
    } finally {
      setLoading(false)
    }
  }

  const loadSystemStats = async () => {
    try {
      const result = await apiService.getSystemStats()
      if (result.success) {
        setSystemStats(result.data)
      }
    } catch (error) {
      console.error('Error loading system stats:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <Activity className="h-16 w-16 text-medical-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Access</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view your personalized healthcare records dashboard.
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="medical-gradient p-3 rounded-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Your healthcare records analytics and activity overview
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-medical-600" />
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Personal Stats */}
            {analytics && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Records</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="card text-center">
                    <div className="medical-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{analytics.totalRecords}</div>
                    <div className="text-sm text-gray-600">Total Records</div>
                  </div>

                  <div className="card text-center">
                    <div className="medical-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Object.keys(analytics.recordsByProvider).length}
                    </div>
                    <div className="text-sm text-gray-600">Providers</div>
                  </div>

                  <div className="card text-center">
                    <div className="medical-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Object.keys(analytics.recordsByType).length}
                    </div>
                    <div className="text-sm text-gray-600">Record Types</div>
                  </div>

                  <div className="card text-center">
                    <div className="medical-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">Verified</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Records by Type */}
              {analytics && Object.keys(analytics.recordsByType).length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Records by Type
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.recordsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-gray-600">{type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="medical-gradient h-2 rounded-full" 
                              style={{ 
                                width: `${(count / analytics.totalRecords) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Records by Provider */}
              {analytics && Object.keys(analytics.recordsByProvider).length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Records by Provider
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.recordsByProvider).map(([provider, count]) => (
                      <div key={provider} className="flex items-center justify-between">
                        <span className="text-gray-600 truncate">{provider}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="medical-gradient h-2 rounded-full" 
                              style={{ 
                                width: `${(count / analytics.totalRecords) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            {analytics && analytics.recentActivity && analytics.recentActivity.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-medical-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-medical-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{activity.recordType}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.providerName} • {formatDate(activity.createdAt)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {activity.recordId}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Activity Chart */}
            {analytics && analytics.monthlyStats && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Monthly Activity
                </h3>
                <div className="flex items-end space-x-2 h-32">
                  {analytics.monthlyStats.map((stat, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="medical-gradient w-full rounded-t"
                        style={{ 
                          height: `${Math.max((stat.count / Math.max(...analytics.monthlyStats.map(s => s.count))) * 100, 5)}%` 
                        }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-2">
                        {stat.month.split('-')[1]}
                      </div>
                      <div className="text-xs font-medium text-gray-900">
                        {stat.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Statistics */}
            {systemStats && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Statistics</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="card text-center">
                    <div className="flex justify-center mb-3">
                      <FileText className="h-8 w-8 text-medical-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{systemStats.totalRecords}</div>
                    <div className="text-sm text-gray-600">Total Records</div>
                  </div>

                  <div className="card text-center">
                    <div className="flex justify-center mb-3">
                      <Building className="h-8 w-8 text-medical-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{systemStats.totalProviders}</div>
                    <div className="text-sm text-gray-600">Healthcare Providers</div>
                  </div>

                  <div className="card text-center">
                    <div className="flex justify-center mb-3">
                      <Users className="h-8 w-8 text-medical-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>

                  <div className="card text-center">
                    <div className="flex justify-center mb-3">
                      <TrendingUp className="h-8 w-8 text-medical-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </div>
            )}

            {/* No Data State */}
            {analytics && analytics.totalRecords === 0 && (
              <div className="card text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by uploading your first healthcare record to see analytics and insights.
                </p>
                <button className="btn-primary">
                  Upload First Record
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard