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
definePageMeta({
  middleware: 'auth' // This applies the 'auth' middleware to this page
});

</script>

<!-- <style scoped>
.container {
  max-width: 400px;
  margin: auto;
}
</style> -->