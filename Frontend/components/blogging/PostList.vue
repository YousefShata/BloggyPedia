<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-4xl font-bold mb-8 text-center">Blog Posts</h1>
    <div
      v-for="post in posts"
      :key="post.id"
      class="bg-white shadow-md rounded-lg overflow-hidden mb-6"
    >
      <div class="flex p-6">
        <img
          :src="`http://localhost:5000/${post.userId.profilePicture}`"
          alt="User avatar"
          class="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div class="flex-1">
          <h2 class="text-2xl font-semibold mb-2">{{ post.title }}</h2>
          <p class="text-gray-700 text-sm mb-4">By {{ post.userId.name }}</p>
          <!-- <p class="text-gray-800 mb-4">{{ post.content }}</p> -->
          <button
            @click="goToPost(post._id)"
            class="text-white bg-black px-4 py-2 rounded-md"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"; // refence elements to bind them to the template
import { useRouter } from "vue-router"; // for routing
import { useBlogStore } from "@/stores/blogs";
const router = useRouter();
const blogStore = useBlogStore();
const posts = ref([]);

onMounted(async () => {
  await blogStore.getAllBlogs();
  posts.value = blogStore.blogs;
  console.log(posts.value);
});
function goToPost(Id) {
  if (router) {
    router.push(`/getBlog/${Id}`);
  } else {
    console.error("Router is not defined");
  }
}
</script>
