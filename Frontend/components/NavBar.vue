<template>
    <header>
      <nav>
        <!-- Other links like Home, Profile, etc. -->
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link to="/register">Register</nuxt-link>
        <nuxt-link to="/login">Login</nuxt-link>
        <button @click="logout">Logout</button>
        <nuxt-link to="/createblog">Create</nuxt-link>
      </nav>
    </header>
</template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  
  const logout = () => {
    authStore.logout();
  };
  </script>