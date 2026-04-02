import React from 'react'
import Post from './Post'

function PostFeed({ posts, onPostsChanged }) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <div className="empty-state-text">No posts yet. Be the first to share!</div>
      </div>
    )
  }

  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} post={post} onPostsChanged={onPostsChanged} />
      ))}
    </div>
  )
}

export default PostFeed
