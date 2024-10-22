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
const User_1 = __importDefault(require("../Models/User"));
const Blog_1 = __importDefault(require("../Models/Blog"));
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = __importDefault(require("../db/redis"));
const uuid_1 = require("uuid");
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
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
            const hashedPassword = crypto_1.default
                .createHash('sha1')
                .update(data.password)
                .digest('hex');
            try {
                const existingUser = yield User_1.default.findOne({ email: data.email });
                if (existingUser) {
                    return res.status(400).json({ error: 'User already exists.' });
                }
                const profilePic = req.file
                    ? req.file.path
                    : 'public/uploads/profile-pics/download.png';
                const newUser = new User_1.default({
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    profilePicture: profilePic,
                });
                yield newUser.saveUser();
                return res.status(200).json({ message: 'User added Succefully' });
            }
            catch (err) {
                return res.status(500).json({ error: err });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
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
            const hashedPassword = crypto_1.default
                .createHash('sha1')
                .update(data.password)
                .digest('hex');
            try {
                const foundUser = yield User_1.default.findOne({
                    email: data.email,
                    password: hashedPassword,
                });
                // Check if the user exists
                if (!foundUser) {
                    return res.status(404).json({ error: 'Invalid Email or Password' });
                }
                // If user is found, proceed with Redis logic
                const token = (0, uuid_1.v4)();
                const key = `auth-${token}`;
                const userId = foundUser._id;
                // Check if Redis client is alive before interacting with it
                if (!redis_1.default.isAlive()) {
                    console.error('Redis client is not connected.');
                    return res.status(500).json({ error: 'Internal server error' });
                }
                try {
                    // Store token in Redis
                    yield redis_1.default.set(key, userId.toString(), 86400); // Store user ID for 24 hours
                    return res.status(200).json({ token });
                }
                catch (error) {
                    console.error('Redis error:', error);
                    return res.status(500).json({ error: 'Redis error occurred' });
                }
            }
            catch (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const token = authHeader.split(' ')[1];
            const foundToken = yield redis_1.default.get(`auth-${token}`);
            if (!foundToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            try {
                yield redis_1.default.del(`auth-${token}`);
                return res.status(204).send(); // Successful logout, no content to return
            }
            catch (error) {
                console.error('Error deleting token from Redis:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static checkAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const token = authHeader.split(' ')[1];
            if (!token)
                return res.status(401).json({ error: 'Unauthorized' });
            try {
                const foundToken = yield redis_1.default.get(`auth-${token}`);
                if (!foundToken) {
                    return res
                        .status(401)
                        .json({ error: 'Unauthorized', isLoggedin: false });
                }
                return res.status(200).json({ token });
            }
            catch (error) {
                console.error('Error checking token in Redis:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const token = authHeader.split(' ')[1];
            if (!token)
                return res.status(401).json({ error: 'Unauthorized' });
            try {
                const foundToken = yield redis_1.default.get(`auth-${token}`);
                if (!foundToken) {
                    return res
                        .status(401)
                        .json({ error: 'Unauthorized', isLoggedin: false });
                }
                const user = yield User_1.default.findById({ _id: foundToken });
                if (!user)
                    return res.status(404).json({ error: 'user not found ' });
                return res.status(200).json({ user });
            }
            catch (error) {
                console.error('Error checking token in Redis:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            if (!req.body) {
                return res.status(400).json({ error: 'body is empty' });
            }
            data = req.body;
            const profilePicture = req.file ? req.file.path : undefined; // Get the file path if a file was uploaded
            if (!data.name || typeof data.name !== 'string') {
                return res.status(400).json({ error: 'Valid name is required.' });
            }
            try {
                const updatedUser = yield User_1.default.findByIdAndUpdate(data.id, { name: data.name, profilePicture: profilePicture }, { new: true, runValidators: true });
                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                return res.status(500).json({ error: 'Error updating user' });
            }
        });
    }
    static deleteProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query; // Retrieve the user ID from the query params
            if (!id) {
                return res.status(400).json({ error: 'No user ID provided' });
            }
            try {
                yield Blog_1.default.deleteMany({ userId: id });
                const deletedProfile = yield User_1.default.findByIdAndDelete(id);
                if (!deletedProfile) {
                    return res.status(404).json({ error: 'User not found' });
                }
                return res
                    .status(200)
                    .json({ message: 'User deleted successfully', deletedProfile });
            }
            catch (error) {
                return res.status(500).json({ error: 'Failed to delete the User' });
            }
        });
    }
    static favouriteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = UserController;
