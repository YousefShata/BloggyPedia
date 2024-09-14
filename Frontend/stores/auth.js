// stores/auth.js
import { defineStore } from 'pinia';
import { useRouter } from '#app';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isLoggedIn: false,
        loading: true,
    }),
    actions: {
        async register(credentials) {
            try {
                await axios.post('http://localhost:5000/api/register', credentials);
                this.isLoggedIn = true;
                this.loading = false;
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

            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('token', this.token);
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
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
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.removeItem('token');
                }
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
        async checkLogin() {
            try {
                //if (process.server) return;
                if (typeof window !== 'undefined' && window.localStorage) {
                    const token = localStorage.getItem('token');
                    console.log(token);
                    this.token = token
                    if (!token) {
                        this.isLoggedIn = false;
                        return;
                    }
                }
                console.log(this.token);
                const response = await axios.get('http://localhost:5000/api/check-auth', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
    
                if (response.status == 200) {
                    console.log("status 200");
                    this.isLoggedIn = true;
                } else {
                    console.log("status 404");
                    this.isLoggedIn = false;
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    code: error.code,
                    response: error.response ? error.response.data : null,
                });
                this.isLoggedIn = false;
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.removeItem('token');
                }
            } finally {
                this.loading = false;
            }
        }
    },
});