import User from '../Models/User';
import mongoose from 'mongoose';
import crypto from 'crypto';
import redisClient from '../db/redis';
import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';

class UserController {
  static async register(req: Request, res: Response) {
    let data: any;
    if (!req.body) {
      return res.status(400).json({ error: 'body is empty' });
    }
    data = req.body;

    if (!data.email || typeof data.email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required.' });
    }
    if (!data.password || typeof data.password !== 'string') {
      return res.status(400).json({ error: 'Valid password is required.' });
    }
    if (!data.name || typeof data.name !== 'string') {
      return res.status(400).json({ error: 'Valid name is required.' });
    }

    const hashedPassword = crypto
      .createHash('sha1')
      .update(data.password)
      .digest('hex');
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      const profilePic = req.file ? req.file.path : "public/uploads/profile-pics/download.png";

      console.log(profilePic);
      const newUser = new User({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        profilePicture: profilePic
      });
      console.log(newUser);
      await newUser.saveUser();
      return res.status(200).json({ message: 'User added Succefully' });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }

  static async login(req: Request, res: Response) {
    let data: any;
    if (!req.body) {
      return res.status(400).json({ error: 'body is empty' });
    }
    data = req.body;

    if (!data.email || typeof data.email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required.' });
    }
    if (!data.password || typeof data.password !== 'string') {
      return res.status(400).json({ error: 'Valid password is required.' });
    }

    const hashedPassword = crypto
      .createHash('sha1')
      .update(data.password)
      .digest('hex');
    try {
      const foundUser = await User.findOne({
        email: data.email,
        password: hashedPassword,
      });

      // Check if the user exists
      if (!foundUser) {
        return res.status(404).json({ error: 'Invalid Email or Password' });
      }

      // If user is found, proceed with Redis logic
      const token = uuid();
      const key = `auth-${token}`;
      const userId: mongoose.Types.ObjectId =
        foundUser._id as mongoose.Types.ObjectId;

      console.log('User found');

      // Check if Redis client is alive before interacting with it
      if (!redisClient.isAlive()) {
        console.error('Redis client is not connected.');
        return res.status(500).json({ error: 'Internal server error' });
      }

      try {
        // Store token in Redis
        await redisClient.set(key, userId.toString(), 86400); // Store user ID for 24 hours
        return res.status(200).json({ token });
      } catch (error) {
        console.error('Redis error:', error);
        return res.status(500).json({ error: 'Redis error occurred' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async logout(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];

    const foundToken = await redisClient.get(`auth-${token}`);
    if (!foundToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      await redisClient.del(`auth-${token}`);
      return res.status(204).send(); // Successful logout, no content to return
    } catch (error) {
      console.error('Error deleting token from Redis:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async checkAuth(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const foundToken = await redisClient.get(`auth-${token}`);
      if (!foundToken) {
          return res.status(401).json({ error: 'Unauthorized', isLoggedin: false });
      }
      return res.status(200).json({token})
    } catch (error) {
        console.error('Error checking token in Redis:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UserController;
