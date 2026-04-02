import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import CreatePost from '../components/CreatePost'
import PostFeed from '../components/PostFeed'

function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadPosts()
  }, [refreshKey])

  const loadPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    setPosts(storedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }

  const handleNewPost = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <div className="content-wrapper">
          <CreatePost onPostCreated={handleNewPost} />
          <PostFeed posts={posts} onPostsChanged={handleNewPost} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
