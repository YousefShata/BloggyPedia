<template>
  <div class="blog-container">
    <!-- Display the blog title -->
    <h1 v-if="blog && blog.title">{{ blog.title }}</h1>

    <!-- Display the blog content rendered from Summernote using v-html -->
    <div v-if="blog && blog.content" v-html="blog.content"></div>

    <button
      v-if="isAuthor"
      @click="goToEditBlog"
      class="edit-button bg-blue-500 text-white px-3 py-2 rounded mt-4"
    >
      Edit Blog
    </button>
  </div>
</template>

<style scoped>
.blog-container {
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: flex-start; /* Align items to the start (left) */
  position: relative; /* Needed for absolute positioning of button */
}

.edit-button {
  position: absolute;
  right: 0; /* Align button to the right */
  top: 0; /* Align button to the top, or adjust as needed */
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useBlogStore } from "@/stores/blogs"; // Assuming your store is configured
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();
const blog = ref(null);
const isAuthor = ref(false);

onMounted(async () => {
  const blogId = route.params.id; // Get the blog ID from the URL
  try {
    await blogStore.getBlog(blogId); // Fetch the blog details
    blog.value = blogStore.blog; // Assign the data to blog
    await blogStore.checkAuthor();

    if (blog.value.userId === blogStore.currentUser) {
      isAuthor.value = true;
    }
  } catch (error) {
    console.error("Failed to fetch blog:", error);
  }
});

const goToEditBlog = () => {
  if (router) {
    router.push(`/editBlog/${blog.value._id}`);
  } else {
    console.error("Router is not defined");
  }
};
</script>
