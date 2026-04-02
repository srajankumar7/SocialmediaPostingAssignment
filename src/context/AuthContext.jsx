import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signup = (username, email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists')
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    setUser({ id: newUser.id, username, email })
    localStorage.setItem('currentUser', JSON.stringify({ id: newUser.id, username, email }))
    return newUser
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const loggedInUser = { id: user.id, username: user.username, email: user.email }
    setUser(loggedInUser)
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser))
    return loggedInUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
