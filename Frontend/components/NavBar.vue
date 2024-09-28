<!-- conponents/NavBar.vue -->
<template>
  <header class="bg-black text-white p-3 shadow-lg">
    <nav class="flex justify-between items-center">
      <!-- Left side: Links -->
      <div class="space-x-10">
        <nuxt-link to="/" class="text-white no-underline hover:text-gray-400"
          >Home</nuxt-link
        >
        <template v-if="!authStore.isLoggedIn">
          <nuxt-link
            to="/register"
            class="text-white no-underline hover:text-gray-400"
            >Register</nuxt-link
          >
        </template>

        <!-- Show login link only if user is not logged in -->
        <template v-if="!authStore.isLoggedIn">
          <nuxt-link
            to="/login"
            class="text-white no-underline hover:text-gray-400"
            >Login</nuxt-link
          >
        </template>
        <template v-if="authStore.isLoggedIn">
          <nuxt-link
            to="/createblog"
            class="text-white no-underline hover:text-gray-400"
            >Create</nuxt-link
          >
        </template>
      </div>

      <!-- Center: Search Bar -->
       <div>
        <form @submit.prevent="handleSearch" class="flex items-center space-x-2">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search blogs..."
              class="text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-gray-400"
            />
            <button
              type="submit"
              class="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200"
            >
            Search
          </button>
        </form>
       </div>

      <!-- Right side: Logout Button -->
      <div>
        <template v-if="authStore.isLoggedIn">
          <button
            @click="profile"
            class="bg-white text-l text-black py-2 px-4 mr-5 rounded duration-200 ease-in-out"
          >
            Profile
          </button>
        </template>
        <template v-if="authStore.isLoggedIn">
          <button
            @click="logout"
            class="logout-button bg-black text-xs border border-white font-semibold text-white py-1 px-2 rounded duration-200 ease-in-out"
          >
            Logout
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.logout-button:hover {
  background-color: white !important;
  color: black !important;  
}
</style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useBlogStore } from "@/stores/blogs";


const authStore = useAuthStore();
const blogStore = useBlogStore();
const router = useRouter();

const searchQuery = ref("")

const profile = () => {
  authStore.myProfile();
};

const logout = () => {
  authStore.logout();
};

const handleSearch = async () => {
  if (searchQuery.value) {
    try {
      await blogStore.searchBlogs(searchQuery.value);
      console.log(searchQuery.value);
      router.push({ path: "search", query: { q: searchQuery.value } });
    } catch (error) {
      console.log("Error while searching for blogs:", error);
    }
  }
};
</script>
