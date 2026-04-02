import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const user = await User.findById(req.userId);

    const post = new Post({
      userId: req.userId,
      username: user.username,
      avatar: user.avatar,
      content: content.trim()
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('userId', 'username avatar')
      .exec();

    const total = await Post.countDocuments();

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('userId', 'username avatar')
      .exec();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Like post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const hasLiked = post.likes.some(id => id.equals(userId));

    if (hasLiked) {
      post.likes = post.likes.filter(id => !id.equals(userId));
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Add comment
router.post('/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(req.userId);

    const comment = {
      userId: req.userId,
      username: user.username,
      avatar: user.avatar,
      text: text.trim()
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete comment
router.delete('/:postId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const commentId = new mongoose.Types.ObjectId(req.params.commentId);
    const comment = post.comments.find(c => c._id.equals(commentId));

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (!comment.userId.equals(new mongoose.Types.ObjectId(req.userId))) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    post.comments = post.comments.filter(c => !c._id.equals(commentId));
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
