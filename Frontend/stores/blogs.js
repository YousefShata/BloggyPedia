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
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                const response = await axios.get(`${apiUrl}/api/getAllBlogs`);
                this.blogs = response.data.allBlogs;
            } catch (error) {
                console.log(error);
            }
        },

        async searchBlogs(query) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                const response = await axios.get(`${apiUrl}/api/search?q=${query}`);
                console.log("response in front " + response);
                this.searchResults = response.data.resultBlogs;
            } catch (error) {
                console.error('Error searching blogs:', error);
            }
        },

        async getBlog(blogId) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                const response = await axios.get(`${apiUrl}/api/getBlog/${blogId}`);
                this.blog = response.data.blog;
            } catch (error) {
                console.log(error);
            }
        },

        async createBlog(data) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                const response = await axios.post(`${apiUrl}/api/createBlog`, data);
                this.blogs.push(response.data); // Add the saved blog to the state
            } catch (error) {
                console.error('Failed to save blog:', error.response.data);
            }
        },

        async editBlog(blogId, data) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                const response = await axios.put(`${apiUrl}/api/editBlog/${blogId}`, data);
                this.blog = response.data;
            } catch (error) {
                console.error('Failed to save blog:', error.response.data);
            }
        },

        async checkAuthor() {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            let token;
            if (typeof window !== 'undefined' && window.localStorage) {
                token = localStorage.getItem('token');
                if (!token) {
                    this.isLoggedIn = false;
                    return;
                }
                const response = await axios.get(`${apiUrl}/api/checkAuthor`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.currentUser = response.data.userId
            }
        },

        async deleteBlog(blogId) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                const response = await axios.delete(`${apiUrl}/api/deleteBlog/${blogId}`);
            } catch (error) {
                console.error('Failed to delete blog:', error.response.data);
            }
        },

        async getUserBlogs(userId) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                const response = await axios.get(`${apiUrl}/api/getUserBlogs/${userId}`);
                this.blogs = response.data.allBlogs;
            } catch (error) {
                console.error("Failed to fetch user blogs:", error);
            }
        },
        // Still trying to access backend to save and remove favourite blog
        async likePost(blogId) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                const authStore = useAuthStore()
                this.likedPosts.push(blogId);
                await axios.post(`${apiUrl}/api/favourite/${blogId}`);
                console.log("blog id liked: ", this.likedPosts);
            } catch (error) {
                console.log(error);
            }
        },
        async unlikePost(blogId) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            console.log("blog id unliked bfore: ", this.likedPosts);
            await axios.delete(`${apiUrl}/api/favourite/${blogId}`);
            let index = this.likedPosts.indexOf(blogId);
            if (index !== -1) {
                this.likedPosts.splice(index, 1);
            }
            console.log("blog id unliked after: ", this.likedPosts);
        },
    },
});