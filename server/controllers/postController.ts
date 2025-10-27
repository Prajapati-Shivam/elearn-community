import { Response } from 'express';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Helper to transform Mongoose document to match frontend schema
function transformPost(post: any) {
  return {
    id: post._id.toString(),
    title: post.title,
    subject: post.subject,
    description: post.description,
    level: post.level,
    studentId: post.studentId.toString(),
    studentName: post.studentName,
    createdAt: post.createdAt,
  };
}

export const getAllPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const transformedPosts = posts.map(transformPost);
    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subject, description, level } = req.body;
    const userId = req.userId;

    // Validate input
    if (!title || !subject || !description || !level) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ message: 'Invalid level' });
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only students can create posts
    if (user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can create learning requests' });
    }

    // Create post
    const post = await Post.create({
      title,
      subject,
      description,
      level,
      studentId: userId,
      studentName: user.name,
    });

    res.status(201).json(transformPost(post));
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subject, description, level } = req.body;
    const userId = req.userId;

    // Find post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.studentId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own posts' });
    }

    // Update post
    if (title) post.title = title;
    if (subject) post.subject = subject;
    if (description) post.description = description;
    if (level) {
      if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
        return res.status(400).json({ message: 'Invalid level' });
      }
      post.level = level;
    }

    await post.save();
    res.status(200).json(transformPost(post));
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.studentId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
