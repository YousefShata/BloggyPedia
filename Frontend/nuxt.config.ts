// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000'  // Default to localhost
    }
  },
  vite: {
    optimizeDeps: {
      include: ['jquery']
    }
  },
  css: [
    "~/assets/css/main.css", // Your Tailwind CSS file
    "bootstrap/dist/css/bootstrap.min.css",
    "summernote/dist/summernote-bs5.min.css",
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [{ src: "~/plugins/summernote.js", mode: "client" }],
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  compatibilityDate: "2024-09-12",
});
