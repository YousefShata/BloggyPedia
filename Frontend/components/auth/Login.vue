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
          <div class="relative">
          <input
            v-model="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Password"
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <span @click="togglePasswordVisibility" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
            <img :src="isPasswordVisible ? eyeOpenIcon : eyeClosedIcon" alt="Toggle visibility" class="w-5 h-5" />
          </span>
        </div>
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
  import eyeOpenIcon from "@/assets/icons/eye-open.svg";
  import eyeClosedIcon from "@/assets/icons/eye-closed.svg";

  const authStore = useAuthStore();

  const email = ref("");
  const password = ref("");
  const router = useRouter();
  const isPasswordVisible = ref(false); 

  const login = async () => {
    try {
      await authStore.login({ email: email.value, password: password.value });
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
  };
  </script>