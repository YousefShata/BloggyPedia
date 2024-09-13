<!-- components/blogging/Home.vue -->
<template>
  <h2>Explore blogs</h2>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <!-- Add code here -->
         <Blog />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'; // refence elements to bind them to the template
  import { useRouter } from 'vue-router'; // for routing
  import { useBlogStore } from '@/stores/blogs';
  import Blog from '@/components/blogging/Blog.vue';
  const router = useRouter();
  
    /*Add function loginc here*/
  
  </script>