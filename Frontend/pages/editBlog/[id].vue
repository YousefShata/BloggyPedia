<template>
  <div v-if="!authStore.loading">
    <NavBar />
    <EditBlog />
  </div>
  <div v-else class="loading-container">
    <div class="spinner"></div>
    <p>Loading, please wait...</p>
  </div>
</template>

<script setup>
import NavBar from "~/components/NavBar.vue";
import EditBlog from "~/components/blogging/EditBlog.vue";
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
definePageMeta({
  middleware: "auth", // This applies the 'auth' middleware to this page
});
</script>
