"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = __importDefault(require("../Controllers/UserController"));
const BlogController_1 = __importDefault(require("../Controllers/BlogController"));
// import {
//   likeBlog,
//   unlikeBlog,
//   getUserLikedBlogs,
// } from '../controllers/LikeController';
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profile-pics'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Filename format
    },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.post('/api/register', upload.single('profilePicture'), UserController_1.default.register);
router.post('/api/login', UserController_1.default.login);
router.post('/api/logout', UserController_1.default.logout);
router.get('/api/check-auth', UserController_1.default.checkAuth);
router.post('/api/createBlog', BlogController_1.default.createBlog);
router.get('/api/getBlog/:blogId', BlogController_1.default.getBlog);
router.get('/api/getAllBlogs', BlogController_1.default.getAllBlogs);
router.get('/api/profile', UserController_1.default.profile);
router.put('/api/updateProfile', upload.single('profilePicture'), UserController_1.default.updateProfile);
router.post('/api/favourite/:blogId', UserController_1.default.favouriteBlog);
router.put('/api/editBlog/:blogId', BlogController_1.default.editBlog);
router.get('/api/checkAuthor', BlogController_1.default.checkAuthor);
router.delete('/api/deleteBlog/:blogId', BlogController_1.default.deleteBlog);
router.delete('/api/deleteProfile', UserController_1.default.deleteProfile);
router.get('/api/getUserBlogs/:userId', BlogController_1.default.getUserBlogs);
router.get('/api/search', BlogController_1.default.searchBlog);
// router.post('/api/favourite/:blogId', BlogController.likeBlog);
// router.delete('/api/favourite/:blogId', BlogController.unlikeBlog);
// router.get('/api/favourites', BlogController.getUserLikedBlogs);
exports.default = router;
