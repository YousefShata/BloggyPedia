// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [
    { src: '~/plugins/summernote.js', mode: 'client' }
  ],
  css: [
    "~/assets/css/main.css",
    "bootstrap/dist/css/bootstrap.min.css",
    "summernote/dist/summernote-bs5.min.css",
  ],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  // build: {
  //   transpile: ["pinia"],
  // },
});
