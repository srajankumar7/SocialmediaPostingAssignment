import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostFeed from '../components/PostFeed';

const HomePage = () => {
  const { token } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--bg-light)', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <CreatePost onPostCreated={handlePostCreated} />
          <PostFeed refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
