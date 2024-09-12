  <!-- components/auth/Login.vue -->
  <template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 class="text-2xl font-semibold mb-6 text-center text-black">Login</h2>
        <form @submit.prevent="login" class="space-y-4">
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
          <button
            type="submit"
            class="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Login
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
  const router = useRouter();

  const login = async () => {
    try {
      await authStore.login({ email: email.value, password: password.value });
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  </script>