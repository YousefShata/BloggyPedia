<template>
  <NavBar />
  <div class="container">
    <!-- Home component from the components directory -->
    <Home />
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue';
import Home from '~/components/blogging/Home.vue';
definePageMeta({
  middleware: 'auth' // This applies the 'auth' middleware to this page
});

</script>
