// stores/blogs.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useBlogStore = defineStore('blogs', {
    state: () => ({
        // These are the expected data that we might use in the blog post
        blogs: [],
        blog: null,
        header: null,
        body: null,
        username: null,
        avatar: null,
        thumbnailImage: null,
    }),
    actions: {
        // Here we will handle what happens
        // when a user hits a route (like controllers in the backend)

        /* Example function */
        async getAllBlogs() {
            try {
                const response = await axios.get('http://localhost:5000/api/getAllBlogs');
                this.blogs = response.data.allBlogs;
            } catch (error) {
                console.log(error);
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
                console.log(response);
                this.blogs.push(response.data); // Add the saved blog to the state
              } catch (error) {
                console.error('Failed to save blog:', error.response.data);
              }
        },
    },
});