// stores/auth.js
import { defineStore } from 'pinia';
import { useRouter } from '#app';
import axios from 'axios';
import { FaceSmileIcon } from '@heroicons/vue/16/solid';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isLoggedIn: false,
        loading: true,
    }),
    actions: {
        async register(credentials) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                await axios.post(`${apiUrl}/api/register`, credentials,{
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                });
                this.isLoggedIn = false;
                this.loading = false;
                const router = useRouter();
                if (router) {
                    router.push('/login');
                } else {
                    console.error('Router is not defined');
                }
            } catch (error) {
                console.log(error);
            }
        },
        async login(credentials) {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            const response = await axios.post(`${apiUrl}/api/login`, credentials);
            this.user = response.data.user;
            this.token = response.data.token;
            this.isLoggedIn = true;

            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('token', this.token);
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        },
        async logout() {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                this.token = localStorage.getItem('token');
                await axios.post(`${apiUrl}/api/logout`, {}, {
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
                } else {
                    console.error('Router is not defined');
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        },
        async checkLogin() {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                //if (process.server) return;
                if (typeof window !== 'undefined' && window.localStorage) {
                    const token = localStorage.getItem('token');
                    this.token = token
                    if (!token) {
                        this.isLoggedIn = false;
                        return;
                    }
                }
                const response = await axios.get(`${apiUrl}/api/check-auth`, {
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
        },
        async myProfile() {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const token = localStorage.getItem('token');
                    this.token = token
                    if (!token) {
                        this.isLoggedIn = false;
                        return;
                    }
                }

                const response = await axios.get(`${apiUrl}/api/profile`,{ headers: {
                    'Authorization': `Bearer ${this.token}`
                    }
                });
                this.user = response.data.user;
                const router = useRouter();
                router.push('/profile');
            } catch (error) {
                console.log(error);
            }
        },

        async UpdateProfile(credentials){
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try{
            const response = await axios.put(`${apiUrl}/api/updateProfile`, credentials,{
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            });
            this.user = response.data
        } catch (error) {
        console.error('Failed to update profile:', error);
        throw error; // Re-throw error to handle it in the component
            }
        },

        async deleteProfile() {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            try {
                await axios.delete(`${apiUrl}/api/deleteProfile`, {
                    params: { id: this.user._id }, // Send user ID as a query parameter
                  });
                this.user = null;
                this.token = null;
                this.isLoggedIn = false;
                
                const router = useRouter();
                if (router) {
                    router.push('/login');
                } else {
                    console.error('Router is not defined');
                }
              } catch (error) {
                console.error('Failed to delete the User:', error.response.data);
              }
        },
    },
});