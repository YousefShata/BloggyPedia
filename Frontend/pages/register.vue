<!-- /pages/register.vue -->
<template>
  <NavBar />
  <div class="container">
  <Register />
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue';
import Register from '~/components/auth/Register.vue';
</script>

<!-- <style scoped>
.container {
  max-width: 400px;
  margin: auto;
}
</style> -->