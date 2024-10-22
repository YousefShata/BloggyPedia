import Blog from '../Models/Blog';
import User from '../Models/User';
import mongoose from 'mongoose';
import redisClient from '../db/redis';
import { Request, Response } from 'express';

class LikeController {
  static async likeBlog(req: Request, res: Response) {
    let data: any;
    try {
      if (!req.body) {
        return res.status(400).json({ error: 'body is empty' });
      }
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
      data = req.body;
      const { blogId } = req.params;
      const userId: mongoose.Types.ObjectId = (await redisClient.get(
        `auth-${data.token}`,
      )) as mongoose.Types.ObjectId;
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: blogId } },
        { new: true },
      );

      return res.status(200).json({ message: 'Blog liked successfully', user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'An error occurred while liking the blog' });
    }
  }

  static async unlikeBlog(req: Request, res: Response) {
    try {
      let data: any;
      const { blogId } = req.params;
      const userId: mongoose.Types.ObjectId = (await redisClient.get(
        `auth-${data.token}`,
      )) as mongoose.Types.ObjectId;

      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: blogId } },
        { new: true },
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'An error occurred while unliking the blog' });
    }
  }

  static async getUserLikedBlogs(req: Request, res: Response) {
    try {
      let data: any;
      const userId: mongoose.Types.ObjectId = (await redisClient.get(
        `auth-${data.token}`,
      )) as mongoose.Types.ObjectId;
      const user = await User.findById(userId).populate('favorites');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        message: 'Liked blogs fetched successfully',
        likedBlogs: user.favorites,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'An error occurred while fetching liked blogs' });
    }
  }
}
