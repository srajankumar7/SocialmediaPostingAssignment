import React, { useState, useEffect } from 'react';
import Post from './Post';

const PostFeed = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/posts?page=${page}`);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#fee2e2',
        color: 'var(--error)',
        borderRadius: '0.375rem',
        textAlign: 'center'
      }}>
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          No posts yet. Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map(post => (
        <Post key={post._id} post={post} onUpdate={handlePostUpdate} />
      ))}
    </div>
  );
};

export default PostFeed;
