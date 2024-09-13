export default defineNuxtRouteMiddleware((to, from) => {
    // This logic needs fixes
    const token = typeof window !== 'undefined' && window.localStorage && localStorage.getItem('token');
    if (!token && to.path !== '/login') {
        // Redirect to login if the token is missing and the user is not already on the login page
        return navigateTo('/login');
    } else if (token && to.path === '/login') {
        // Prevent access to login page if the user is already authenticated
        return navigateTo('/');
    }
});