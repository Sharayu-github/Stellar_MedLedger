import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import StatusCheck from './components/StatusCheck'
import Navbar from './components/Navbar'
import AnimatedBackground from './components/AnimatedBackground'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import VerifyPage from './pages/VerifyPage'
import RecordsPage from './pages/RecordsPage'
import Dashboard from './pages/Dashboard'
import Toast from './components/Toast'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <WalletProvider>
          <Router>
            <div className="min-h-screen relative">
              <AnimatedBackground />
              <Navbar />
              <main className="relative z-10">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/verify" element={<VerifyPage />} />
                  <Route path="/records" element={<RecordsPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </main>
              <Toast />
              <StatusCheck />
            </div>
          </Router>
        </WalletProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App