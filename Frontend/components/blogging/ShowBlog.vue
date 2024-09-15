<template>
  <div class="blog-container">
    <!-- Display the blog title -->
    <h1 v-if="blog && blog.title">{{ blog.title }}</h1>

    <!-- Display the blog content rendered from Summernote using v-html -->
    <div v-if="blog && blog.content" v-html="blog.content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBlogStore } from "@/stores/blogs"; // Assuming your store is configured
import { useRoute } from "vue-router";

const route = useRoute();
const blogStore = useBlogStore();
const blog = ref(null); // Store the blog data here

onMounted(async () => {
  const blogId = route.params.id; // Get the blog ID from the URL
  try {
    await blogStore.getBlog(blogId); // Fetch the blog details
    blog.value = blogStore.blog; // Assign the data to blog
    if (process.client) {
      console.log(blog.value); // This will ensure it's logged only on the client side
    }
  } catch (error) {
    console.error("Failed to fetch blog:", error);
  }
});
</script>
