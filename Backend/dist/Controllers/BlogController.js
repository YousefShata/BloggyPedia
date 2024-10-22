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
class BlogController {
    static createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
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
            if (!redis_1.default.isAlive()) {
                console.error('Redis client is not connected.');
                return res.status(500).json({ error: 'Internal server error' });
            }
            const userId = (yield redis_1.default.get(`auth-${data.token}`));
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const foundUser = yield User_1.default.findById({ _id: userId });
            if (!foundUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            const blog = new Blog_1.default({
                title: data.title,
                content: data.content,
                userId: userId,
            });
            try {
                yield blog.saveBlog();
                console.log('New Blog has been Saved');
                return res.status(200).json(blog);
            }
            catch (error) {
                return res.status(500).json({ error: error });
            }
        });
    }
    static getBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            if (!blogId)
                return res.status(404).json({ error: 'No blog ID provided' });
            try {
                const blog = yield Blog_1.default.findById({ _id: blogId });
                if (!blog)
                    return res.status(404).json({ error: 'Blog not found ' });
                return res.status(200).json({ blog });
            }
            catch (error) {
                return res.status(500).json({ error: error });
            }
        });
    }
    static getAllBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allBlogs = yield Blog_1.default.find({}).populate('userId', 'name profilePicture');
                res.status(200).json({ allBlogs });
                console.log('allBlogs', allBlogs);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    static searchBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q } = req.query;
            console.log('query:', q);
            try {
                const resultBlogs = yield Blog_1.default.find({
                    $or: [
                        { title: { $regex: q, $options: 'i' } },
                        { content: { $regex: q, $options: 'i' } },
                    ],
                }).populate('userId', 'name profilePicture');
                res.json({ resultBlogs });
                console.log(resultBlogs);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: 'Error occurred while searching for blogs' });
            }
        });
    }
    static editBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            let data;
            if (!blogId)
                return res.status(404).json({ error: 'No blog ID provided' });
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
                const updatedBlog = yield Blog_1.default.findByIdAndUpdate(blogId, { title: data.title, content: data.content }, { new: true, runValidators: true });
                if (!updatedBlog)
                    return res.status(404).json({ error: 'Blog not found ' });
                return res.status(200).json({ updatedBlog });
            }
            catch (error) {
                return res.status(500).json({ error: error });
            }
        });
    }
    static checkAuthor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const token = authHeader.split(' ')[1];
            if (!redis_1.default.isAlive()) {
                console.error('Redis client is not connected.');
                return res.status(500).json({ error: 'Internal server error' });
            }
            const userId = (yield redis_1.default.get(`auth-${token}`));
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            return res.status(200).json({ userId });
        });
    }
    static deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            if (!blogId)
                return res.status(404).json({ error: 'No blog ID provided' });
            try {
                const deletedBlog = yield Blog_1.default.findByIdAndDelete(blogId);
                if (!deletedBlog) {
                    return res.status(404).json({ error: 'Blog not found' });
                }
                return res
                    .status(200)
                    .json({ message: 'Blog deleted successfully', deletedBlog });
            }
            catch (error) {
                return res.status(500).json({ error: 'Failed to delete blog' });
            }
        });
    }
    static getUserBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            if (!userId)
                return res.status(404).json({ error: 'No User ID provided' });
            try {
                const allBlogs = yield Blog_1.default.find({ userId: userId });
                res.status(200).json({ allBlogs });
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
}
exports.default = BlogController;
