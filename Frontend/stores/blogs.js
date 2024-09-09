// stores/blogs.js
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
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
                await axios.post('/api/createBlog', data);
            } catch (error) {
                console.log(error);
            }
        },
    },
});