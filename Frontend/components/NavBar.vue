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

      <!-- Right side: Logout Button -->
      <div>
        <template v-if="authStore.isLoggedIn">
          <button
            @click="profile"
            class="bg-white text-black py-2 px-3 rounded duration-200 ease-in-out"
          >
            Profile
          </button>
        </template>
        <template v-if="authStore.isLoggedIn">
          <button
            @click="logout"
            class="bg-white text-black py-2 px-3 rounded duration-200 ease-in-out"
          >
            Logout
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const profile = () => {
  authStore.myProfile();
};

const logout = () => {
  authStore.logout();
};
</script>
