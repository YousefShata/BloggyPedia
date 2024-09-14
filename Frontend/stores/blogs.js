// stores/blogs.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useBlogStore = defineStore('blogs', {
    state: () => ({
        // These are the expected data that we might use in the blog post
        blogs: [],
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
        async getAllBlogs(data) {
            try {
                const response = await axios.get('http://localhost:5000/api/getAllBlogs', data);
                this.blogs = response;
            } catch (error) {
                console.log(error);
            }
        },

        async getBlog(data) {
            try {
                const response = await axios.get(`http://localhost:5000/api/getBlog/${blogs.id}`, data);
                this.blogs.push(response.data);
            } catch (error) {
                console.log(error);
            }
        },

        async createBlog(data) {
            try {
                const response = await axios.post('http://localhost:5000/api/createBlog', data);
                console.log(response);
                //this.blogs.push(response.data); // Add the saved blog to the state
              } catch (error) {
                console.error('Failed to save blog:', error.response.data);
              }
        },
    },
});