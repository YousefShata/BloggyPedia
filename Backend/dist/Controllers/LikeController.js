"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Blog_1 = __importDefault(require("../Models/Blog"));
const User_1 = __importDefault(require("../Models/User"));
const redis_1 = __importDefault(require("../db/redis"));
class LikeController {
    static likeBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
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
                if (!redis_1.default.isAlive()) {
                    console.error('Redis client is not connected.');
                    return res.status(500).json({ error: 'Internal server error' });
                }
                data = req.body;
                const { blogId } = req.params;
                const userId = (yield redis_1.default.get(`auth-${data.token}`));
                const blog = yield Blog_1.default.findById(blogId);
                if (!blog) {
                    return res.status(404).json({ message: 'Blog not found' });
                }
                const user = yield User_1.default.findByIdAndUpdate(userId, { $addToSet: { favorites: blogId } }, { new: true });
                return res.status(200).json({ message: 'Blog liked successfully', user });
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ message: 'An error occurred while liking the blog' });
            }
        });
    }
    static unlikeBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data;
                const { blogId } = req.params;
                const userId = (yield redis_1.default.get(`auth-${data.token}`));
                const blog = yield Blog_1.default.findById(blogId);
                if (!blog) {
                    return res.status(404).json({ message: 'Blog not found' });
                }
                const user = yield User_1.default.findByIdAndUpdate(userId, { $pull: { favorites: blogId } }, { new: true });
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ message: 'An error occurred while unliking the blog' });
            }
        });
    }
    static getUserLikedBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data;
                const userId = (yield redis_1.default.get(`auth-${data.token}`));
                const user = yield User_1.default.findById(userId).populate('favorites');
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json({
                    message: 'Liked blogs fetched successfully',
                    likedBlogs: user.favorites,
                });
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ message: 'An error occurred while fetching liked blogs' });
            }
        });
    }
}
