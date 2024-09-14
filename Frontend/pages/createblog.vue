<template>
  <div v-if="!authStore.loading">
    <NavBar />
    <div class="container">
      <!-- CreateBlog component from the components directory -->
      <CreateBlog />
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="spinner"></div>
    <p>Loading, please wait...</p>
  </div>
</template>

<script setup>
import NavBar from "~/components/NavBar.vue";
import CreateBlog from "~/components/blogging/CreateBlog.vue";
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
definePageMeta({
  middleware: "auth", // This applies the 'auth' middleware to this page
});
</script>
