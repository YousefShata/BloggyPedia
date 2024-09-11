// stores/blogs.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useBlogStore = defineStore('blogs', {
    state: () => ({
        // These are the expected data that we might use in the blog post
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
        async renderBlogs(data) {
            try {
                await axios.get('/api/blogs', data);
            } catch (error) {
                console.log(error);
            }
        },
        async CreateBlog(data) {
            try {
                //const response = await axios.post('http://your-api-endpoint.com/blogs', blogData);
                this.blogs.push(response.data); // Add the saved blog to the state
              } catch (error) {
                console.error('Failed to save blog:', error);
              }
        },
    },
});