import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Post cannot be empty');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      setContent('');
      onPostCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={user?.avatar || 'https://via.placeholder.com/40'}
          alt={user?.username}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--secondary)'
          }}
        />
        <span style={{ fontWeight: 500 }}>{user?.username}</span>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          color: 'var(--error)',
          borderRadius: '0.375rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          style={{
            width: '100%',
            minHeight: '100px',
            marginBottom: '1rem',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.375rem',
            fontFamily: 'inherit',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="btn btn-primary"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="spinner"></div>
                Posting...
              </span>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
