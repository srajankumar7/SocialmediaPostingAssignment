import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!content.trim()) {
        throw new Error('Please write something to post')
      }

      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      const newPost = {
        id: Date.now(),
        userId: user.id,
        username: user.username,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      }

      posts.push(newPost)
      localStorage.setItem('posts', JSON.stringify(posts))
      setContent('')
      setSuccess('Post created successfully!')
      setTimeout(() => setSuccess(''), 3000)
      onPostCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <textarea
          className="post-textarea"
          placeholder="What&apos;s on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="post-btn" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost
