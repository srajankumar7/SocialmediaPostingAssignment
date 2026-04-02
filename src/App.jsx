import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'

function AppContent() {
  const { user, loading } = useAuth()
  const [showSignup, setShowSignup] = useState(false)

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  if (!user) {
    return showSignup ? 
      <SignupPage onSwitchToLogin={() => setShowSignup(false)} /> : 
      <LoginPage onSwitchToSignup={() => setShowSignup(true)} />
  }

  return <HomePage />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
