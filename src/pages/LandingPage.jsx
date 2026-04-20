import React from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import { 
  Shield, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Lock,
  Globe,
  Zap
} from 'lucide-react'

const LandingPage = () => {
  const { isConnected } = useWallet()

  const features = [
    {
      icon: Shield,
      title: 'Tamper-Proof Records',
      description: 'Healthcare records stored immutably on Stellar blockchain with cryptographic verification'
    },
    {
      icon: Activity,
      title: 'Instant Verification',
      description: 'Verify medical record integrity in seconds with blockchain-powered authentication'
    },
    {
      icon: Lock,
      title: 'Privacy Protected',
      description: 'Only record hashes stored on-chain, ensuring patient privacy and HIPAA compliance'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access verified records anywhere in the world with Stellar network reliability'
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Lightning-fast transactions with minimal fees using Stellar blockchain technology'
    },
    {
      icon: Users,
      title: 'Multi-Provider',
      description: 'Support for hospitals, clinics, labs, and healthcare providers worldwide'
    }
  ]

  const stats = [
    { label: 'Records Verified', value: '10,000+', icon: CheckCircle },
    { label: 'Healthcare Providers', value: '500+', icon: Users },
    { label: 'Countries Supported', value: '25+', icon: Globe },
    { label: 'Avg. Verification Time', value: '< 3s', icon: Clock }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="medical-gradient p-4 rounded-2xl">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Healthcare Records on
              <span className="medical-gradient bg-clip-text text-transparent"> Stellar Blockchain</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              MedLedger ensures healthcare record integrity through blockchain verification. 
              Tamper-proof, privacy-protected, and instantly verifiable medical records for the modern healthcare system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isConnected ? (
                <>
                  <Link to="/upload" className="btn-primary flex items-center justify-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Upload Record</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/verify" className="btn-secondary flex items-center justify-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Verify Record</span>
                  </Link>
                </>
              ) : (
                <>
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <span>Connect Wallet to Start</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link to="/verify" className="btn-secondary flex items-center justify-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Try Verification</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className="h-8 w-8 text-medical-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MedLedger?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on Stellar blockchain technology to provide the most secure and efficient 
              healthcare record verification system available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="medical-gradient p-3 rounded-lg mr-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure, and transparent healthcare record verification
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="medical-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload & Hash</h3>
              <p className="text-gray-600">
                Healthcare providers upload medical records. The system generates a cryptographic hash 
                without storing sensitive patient data.
              </p>
            </div>

            <div className="text-center">
              <div className="medical-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Blockchain Storage</h3>
              <p className="text-gray-600">
                Record hashes are stored immutably on Stellar blockchain, creating an 
                unalterable proof of authenticity and timestamp.
              </p>
            </div>

            <div className="text-center">
              <div className="medical-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Verification</h3>
              <p className="text-gray-600">
                Anyone can verify record integrity by comparing the current file hash 
                with the blockchain-stored hash in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card medical-gradient text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Secure Your Healthcare Records?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of healthcare providers using MedLedger for tamper-proof record verification.
            </p>
            
            {isConnected ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload" className="bg-white text-medical-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Start Uploading</span>
                </Link>
                <Link to="/dashboard" className="border-2 border-white text-white hover:bg-white hover:text-medical-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>View Dashboard</span>
                </Link>
              </div>
            ) : (
              <button className="bg-white text-medical-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto">
                <span>Connect Wallet to Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage