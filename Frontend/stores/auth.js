// stores/auth.js
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
    }),
    actions: {
        async register(credentials) {
            try {
                await axios.post('/api/register', credentials);
            } catch (error) {
                console.log(error);
            }
        },
        async login(credentials) {
            const response = await axios.post('/api/login', credentials);
            this.user = response.data.user;
            this.token = response.data.token;
            localStorage.setItem('token', this.token);
        },
        async logout() {
            try {
                await axios.post('/api/logout');
                this.user = null;
                this.token = null;
                localStorage.removeItem('token');
                const router = useRouter();
                router.push('/login'); // Redirect to login
            } catch (error) {
                console.error('Error logging out:', error);
            }
        },
    },
});