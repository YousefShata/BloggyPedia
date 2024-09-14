<template>
  <div v-if="!authStore.loading">
    <NavBar />
    <div class="container">
      <Register />
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="spinner"></div>
    <p>Loading, please wait...</p>
  </div>
</template>

<script setup>
import NavBar from "~/components/NavBar.vue";
import Register from "~/components/auth/Register.vue";
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
definePageMeta({
  middleware: "auth", // This applies the 'auth' middleware to this page
});
</script>

<!-- <style scoped>
.container {
  max-width: 400px;
  margin: auto;
}
</style> -->
