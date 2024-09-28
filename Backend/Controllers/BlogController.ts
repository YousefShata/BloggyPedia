import Blog from '../Models/Blog';
import User from '../Models/User';
import mongoose from 'mongoose';
import redisClient from '../db/redis';
import { Request, Response } from 'express';

class BlogController {
  static async createBlog(req: Request, res: Response) {
    let data: any;
    if (!req.body) {
      return res.status(400).json({ error: 'body is empty' });
    }
    data = req.body;

    if (!data.content || typeof data.content !== 'string') {
      return res.status(400).json({ error: 'No contect provided.' });
    }

    if (!data.title || typeof data.content !== 'string') {
      return res.status(400).json({ error: 'No title provided.' });
    }

    if (!data.token || typeof data.content !== 'string') {
      return res.status(400).json({ error: 'No Token provided.' });
    }

    if (!redisClient.isAlive()) {
      console.error('Redis client is not connected.');
      return res.status(500).json({ error: 'Internal server error' });
    }

    const userId: mongoose.Types.ObjectId = (await redisClient.get(
      `auth-${data.token}`,
    )) as mongoose.Types.ObjectId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const foundUser = await User.findById({ _id: userId });
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const blog = new Blog({
      title: data.title,
      content: data.content,
      userId: userId,
    });
    try {
      await blog.saveBlog();
      console.log('New Blog has been Saved');
      return res.status(200).json(blog);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  static async getBlog(req: Request, res: Response) {
    const { blogId } = req.params;
    if (!blogId) return res.status(404).json({ error: 'No blog ID provided' });
    try {
      const blog = await Blog.findById({ _id: blogId });
      if (!blog) return res.status(404).json({ error: 'Blog not found ' });
      return res.status(200).json({ blog });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  static async getAllBlogs(req: Request, res: Response) {
    try {
      const allBlogs = await Blog.find({}).populate(
        'userId',
        'name profilePicture',
      );
      res.status(200).json({ allBlogs });
      console.log('allBlogs', allBlogs);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async searchBlog(req: Request, res: Response) {
    const { q } = req.query;
    console.log('query:', q);
    try {
      const resultBlogs = await Blog.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
        ],
      }).populate('userId', 'name profilePicture');

      res.json({ resultBlogs });
      console.log(resultBlogs);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error occurred while searching for blogs' });
    }
  }

  static async editBlog(req: Request, res: Response) {
    const { blogId } = req.params;
    let data: any;
    if (!blogId) return res.status(404).json({ error: 'No blog ID provided' });
    if (!req.body) {
      return res.status(400).json({ error: 'body is empty' });
    }
    data = req.body;

    if (!data.content || typeof data.content !== 'string') {
      return res.status(400).json({ error: 'No contect provided.' });
    }

    if (!data.title || typeof data.content !== 'string') {
      return res.status(400).json({ error: 'No title provided.' });
    }
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { title: data.title, content: data.content },
        { new: true, runValidators: true },
      );
      if (!updatedBlog)
        return res.status(404).json({ error: 'Blog not found ' });

      return res.status(200).json({ updatedBlog });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  static async checkAuthor(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];

    if (!redisClient.isAlive()) {
      console.error('Redis client is not connected.');
      return res.status(500).json({ error: 'Internal server error' });
    }

    const userId: mongoose.Types.ObjectId = (await redisClient.get(
      `auth-${token}`,
    )) as mongoose.Types.ObjectId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ userId });
  }

  static async deleteBlog(req: Request, res: Response) {
    const { blogId } = req.params;
    if (!blogId) return res.status(404).json({ error: 'No blog ID provided' });
    try {
      const deletedBlog = await Blog.findByIdAndDelete(blogId);

      if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      return res
        .status(200)
        .json({ message: 'Blog deleted successfully', deletedBlog });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete blog' });
    }
  }

  static async getUserBlogs(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) return res.status(404).json({ error: 'No User ID provided' });
    try {
      const allBlogs = await Blog.find({ userId: userId });
      res.status(200).json({ allBlogs });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}

export default BlogController;
