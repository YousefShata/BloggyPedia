<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-semibold mb-6 text-center text-black">
        Register
      </h2>
      <form
        @submit.prevent="register"
        enctype="multipart/form-data"
        class="space-y-4"
      >
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          ref="fileInput"
          type="file"
          @change="handleFileUpload"
          class="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          class="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "#app";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const name = ref("");
const file = ref(null); // For handling file input
const router = useRouter();

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};

const register = async () => {
  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    if (file.value) {
      formData.append("profilePicture", file.value);
    }

    await authStore.register(formData);
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
</script>
