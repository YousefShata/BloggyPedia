import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const authStore = useAuthStore();

    // Wait for the authentication check to complete before proceeding
    if (authStore.loading) {
        await authStore.checkLogin();
    }

    const token = authStore.token || (typeof window !== 'undefined' && localStorage.getItem('token'));ل
  
    if (!token && to.path !== '/login' && to.path !== '/register') {
        // Redirect to login if the token is missing and the user is not already on the login or register page
        return navigateTo('/login');
    } else if (token && to.path === '/login') {
        // Prevent access to login page if the user is already authenticated
        return navigateTo('/');
    }
});
