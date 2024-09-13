// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
