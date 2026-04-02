import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Post({ post, onPostsChanged }) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)
  const isLiked = post.likes.includes(user.id)
  const likeCount = post.likes.length

  const handleLike = () => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const postIndex = posts.findIndex(p => p.id === post.id)
    
    if (postIndex > -1) {
      if (isLiked) {
        posts[postIndex].likes = posts[postIndex].likes.filter(id => id !== user.id)
      } else {
        posts[postIndex].likes.push(user.id)
      }
      localStorage.setItem('posts', JSON.stringify(posts))
      onPostsChanged()
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setLoading(true)
    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const postIndex = posts.findIndex(p => p.id === post.id)
    
    if (postIndex > -1) {
      const newComment = {
        id: Date.now(),
        userId: user.id,
        username: user.username,
        text: commentText.trim(),
        createdAt: new Date().toISOString()
      }
      posts[postIndex].comments.push(newComment)
      localStorage.setItem('posts', JSON.stringify(posts))
      setCommentText('')
      onPostsChanged()
    }
    setLoading(false)
  }

  const handleDeleteComment = (commentId) => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const postIndex = posts.findIndex(p => p.id === post.id)
    
    if (postIndex > -1) {
      posts[postIndex].comments = posts[postIndex].comments.filter(c => c.id !== commentId)
      localStorage.setItem('posts', JSON.stringify(posts))
      onPostsChanged()
    }
  }

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      const filteredPosts = posts.filter(p => p.id !== post.id)
      localStorage.setItem('posts', JSON.stringify(filteredPosts))
      onPostsChanged()
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <div>
          <div className="post-author">{post.username}</div>
          <div className="post-time">{formatTime(post.createdAt)}</div>
        </div>
        {post.userId === user.id && (
          <button className="action-btn delete" onClick={handleDeletePost} title="Delete post">
            ✕
          </button>
        )}
      </div>

      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span className="like-count">{likeCount}</span>
        </button>
        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
          title={showComments ? 'Hide comments' : 'Show comments'}
        >
          <span>💬</span>
          <span>{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleAddComment} className="comment-input-group">
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="comment-submit-btn" disabled={loading}>
              Post
            </button>
          </form>

          {post.comments.length > 0 && (
            <div className="comments-list">
              {post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-author">{comment.username}</div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-meta">
                    <span>{formatTime(comment.createdAt)}</span>
                    {comment.userId === user.id && (
                      <button
                        className="comment-delete"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Post
