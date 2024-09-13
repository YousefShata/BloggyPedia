<template>
  <NavBar />
  <div class="container">
    <!-- CreateBlog component from the components directory -->
    <CreateBlog />
  </div>
</template>

<script setup>
import NavBar from "~/components/NavBar.vue";
import CreateBlog from "~/components/blogging/CreateBlog.vue";
definePageMeta({
  middleware: 'auth' // This applies the 'auth' middleware to this page
});

</script>
