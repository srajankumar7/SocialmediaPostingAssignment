import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: 'var(--primary)',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="container flex justify-between items-center">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Mini Social</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
            Connect with others
          </p>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span>Welcome, <strong>{user.username}</strong></span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
