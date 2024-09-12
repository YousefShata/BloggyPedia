// stores/auth.js
import { defineStore } from 'pinia';
import { useRouter } from '#app';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isLoggedIn: false,
    }),
    actions: {
        async register(credentials) {
            try {
                await axios.post('http://localhost:5000/api/register', credentials);
            } catch (error) {
                console.log(error);
            }
        },
        async login(credentials) {
            const response = await axios.post('http://localhost:5000/api/login', credentials);
            this.user = response.data.user;
            this.token = response.data.token;
            this.isLoggedIn = true;
            console.log("Logged in and status is: ", this.isLoggedIn);
            console.log(credentials);

            localStorage.setItem('token', this.token);
        },
        async logout() {
            try {
                this.token = localStorage.getItem('token');
                console.log(this.token);
                await axios.post('http://localhost:5000/api/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.user = null;
                this.token = null;
                this.isLoggedIn = false;
                localStorage.removeItem('token');
                const router = useRouter();
                if (router) {
                    router.push('/login');
                    console.log("logged out and satus is: ", this.isLoggedIn);
                } else {
                    console.error('Router is not defined');
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        },
    },
});