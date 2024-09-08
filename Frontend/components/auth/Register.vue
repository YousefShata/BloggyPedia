<template>
    <div class="container">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const register = async () => {
    try {
      await useAuthStore.register({ email: email.value, password: password.value });
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 400px;
    margin: auto;
  }
  </style>