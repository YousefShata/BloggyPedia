<template>
    <div class="container">
        <h2 class="text-center">This is my blog</h2>
        <!-- Add code here -->
    </div>
</template>
  
  <script setup>
  import { ref } from 'vue'; // refence elements to bind them to the template
  import { useRouter } from 'vue-router'; // for routing
  import { useBlogStore } from '@/stores/blogs';
  const router = useRouter();
  
    /*Add function loginc here*/
  
  </script>