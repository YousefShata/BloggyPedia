// stores/blogs.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '#imports';

export const useBlogStore = defineStore('blogs', {
    state: () => ({
        // These are the expected data that we might use in the blog post
        blogs: [],
        blog: null,
        currentUser: null,
        searchResults: [],
        likedPosts: [],
    }),
    actions: {
        async getAllBlogs() {
            try {
                const response = await axios.get('http://localhost:5000/api/getAllBlogs');
                this.blogs = response.data.allBlogs;
            } catch (error) {
                console.log(error);
            }
        },

        async searchBlogs(query) {
            try {
                const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
                console.log("response in front " + response);
                this.searchResults = response.data.resultBlogs;
            } catch (error) {
                console.error('Error searching blogs:', error);
            }
        },

        async getBlog(blogId) {
            try {
                const response = await axios.get(`http://localhost:5000/api/getBlog/${blogId}`);
                this.blog = response.data.blog;
            } catch (error) {
                console.log(error);
            }
        },

        async createBlog(data) {
            try {
                const response = await axios.post('http://localhost:5000/api/createBlog', data);
                this.blogs.push(response.data); // Add the saved blog to the state
            } catch (error) {
                console.error('Failed to save blog:', error.response.data);
            }
        },

        async editBlog(blogId, data) {
            try {
                const response = await axios.put(`http://localhost:5000/api/editBlog/${blogId}`, data);
                this.blog = response.data;
            } catch (error) {
                console.error('Failed to save blog:', error.response.data);
            }
        },

        async checkAuthor() {
            let token;
            if (typeof window !== 'undefined' && window.localStorage) {
                token = localStorage.getItem('token');
                if (!token) {
                    this.isLoggedIn = false;
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/checkAuthor', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.currentUser = response.data.userId
            }
        },

        async deleteBlog(blogId) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/deleteBlog/${blogId}`);
            } catch (error) {
                console.error('Failed to delete blog:', error.response.data);
            }
        },

        async getUserBlogs(userId) {
            try {
                const response = await axios.get(`http://localhost:5000/api/getUserBlogs/${userId}`);
                this.blogs = response.data.allBlogs;
            } catch (error) {
                console.error("Failed to fetch user blogs:", error);
            }
        },
        // Still trying to access backend to save and remove favourite blog
        async likePost(blogId) {
            try {
                const authStore = useAuthStore()
                this.likedPosts.push(blogId);
                await axios.post(`http://localhost:5000/api/favourite/${blogId}`);
                console.log("blog id liked: ", this.likedPosts);
            } catch (error) {
                console.log(error);
            }
        },
        async unlikePost(blogId) {
            console.log("blog id unliked bfore: ", this.likedPosts);
            await axios.delete(`http://localhost:5000/api/favourite/${blogId}`);
            let index = this.likedPosts.indexOf(blogId);
            if (index !== -1) {
                this.likedPosts.splice(index, 1);
            }
            console.log("blog id unliked after: ", this.likedPosts);
        },
    },
});