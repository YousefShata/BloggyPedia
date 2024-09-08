<template>
    <div class="container">
        <h2>Login</h2>
        <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const login = async () => {
    try {
      await axios.post('/api/login', { email: email.value, password: password.value });
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  </script>
<style scoped>
  .container {
    max-width: 400px;
    margin: auto;
  }
</style>