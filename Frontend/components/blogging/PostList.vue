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
          <p class="text-gray-800 mb-4 inline" v-html=getTrunctedText(post.content.toString())></p>
          <nuxt-link :to="`/getBlog/${post._id}`" class="text-gray-500 text-sm hover:text-black hover:no-underline">
            Read More
          </nuxt-link>
          <nuxt-link
          class="font-bold block mt-2 hover:cursor-pointer hover:no-underline text-[#00f] hover:text-gray-500"
          @click="(event) => likeClick(event, post._id)"
          data-liked = "false"
          :to="`/`"
          >Like</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"; // refence elements to bind them to the template
import { useRouter } from "vue-router"; // for routing
import { useBlogStore } from "@/stores/blogs";
import { post } from "jquery";
const router = useRouter();
const blogStore = useBlogStore();
// const authstore = useAuthStore();
const posts = ref([]);

onMounted(async () => {
  await blogStore.getAllBlogs();
  posts.value = blogStore.blogs;
  console.log(posts.value);
});

const getTrunctedText = (content) => {
  const contentLength = content.length;
  const maxLength = 500;
  const minLength = 150;
  const truncatePoint = 100;

  let truncatedContent = content;

  if (contentLength > maxLength) {
    truncatedContent = content.substring(0, maxLength);
    const lastPeriodIndex = truncatedContent.lastIndexOf('.');
    if (lastPeriodIndex > truncatePoint) {
      truncatedContent = truncatedContent.substring(0, lastPeriodIndex + 1);
    }
    truncatedContent += '...';
  } else if (contentLength > minLength) {
    truncatedContent = content.substring(0, minLength);
    truncatedContent += '...';
  }

  return truncatedContent;
}

async function likeClick(event, postId) {
  let liked = event.target.getAttribute('data-liked') === 'true';
  
  if (liked) {
    event.target.innerHTML = "Like"
    event.target.style.color = "blue";
    blogStore.unlikePost(postId);
  } else {
    event.target.innerHTML = "Liked";
    event.target.style.color = "Black";
    blogStore.likePost(postId);
    console.log(postId);
  }
  event.target.setAttribute("data-liked", !liked);

  console.log(event.target.innerHTML);
}

// function goToPost(Id) {
//   if (router) {
//     router.push(`/getBlog/${Id}`);
//   } else {
//     console.error("Router is not defined");
//   }
// }
</script>
