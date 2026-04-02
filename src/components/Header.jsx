import React from 'react'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()

  return (
    <div className="header">
      <div className="header-content">
        <div className="header-title">Social</div>
        <div className="header-user">
          <div className="user-info">
            <div className="user-name">{user.username}</div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
