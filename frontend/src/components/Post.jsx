import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Post = ({ post, onUpdate }) => {
  const { token, user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLiked = post.likes.some(id => id === user.id);
  const likeCount = post.likes.length;
  const commentCount = post.comments.length;

  const handleLike = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const updatedPost = await response.json();
      onUpdate(updatedPost);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const updatedPost = await response.json();
      setCommentText('');
      onUpdate(updatedPost);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${post._id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      const updatedPost = await response.json();
      onUpdate(updatedPost);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.avatar || 'https://via.placeholder.com/40'}
            alt={post.username}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--secondary)'
            }}
          />
          <div>
            <p style={{ fontWeight: 600, margin: 0 }}>{post.username}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{post.content}</p>

      {error && (
        <div style={{
          padding: '0.5rem',
          marginBottom: '0.5rem',
          backgroundColor: '#fee2e2',
          color: 'var(--error)',
          borderRadius: '0.375rem',
          fontSize: '0.75rem'
        }}>
          {error}
        </div>
      )}

      {/* Post Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        marginBottom: '0.75rem',
        fontSize: '0.875rem',
        color: 'var(--text-light)'
      }}>
        <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <button
          onClick={handleLike}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: isLiked ? 'var(--secondary)' : 'transparent',
            border: isLiked ? 'none' : '1px solid var(--border)',
            color: isLiked ? 'var(--primary)' : 'var(--text)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          {isLiked ? '❤️ Liked' : '🤍 Like'}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: showComments ? 'var(--secondary)' : 'transparent',
            border: showComments ? 'none' : '1px solid var(--border)',
            color: showComments ? 'var(--primary)' : 'var(--text)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          💬 Comment
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1rem'
        }}>
          {/* Comment Form */}
          <form onSubmit={handleAddComment} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="submit"
                disabled={loading || !commentText.trim()}
                className="btn btn-primary btn-sm"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {post.comments.map((comment) => (
                <div
                  key={comment._id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-light)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <strong style={{ color: 'var(--primary)' }}>{comment.username}</strong>
                    {comment.userId === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--error)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text)' }}>{comment.text}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
              No comments yet. Be the first!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
