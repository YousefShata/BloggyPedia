<!-- pages/search -->
<template>
    <div class="max-w-4xl mx-auto py-8 px-4">
        <h1 class="text-4xl font-bold mb-8 text-center">Search Results</h1>
        <div v-if="blogStore.searchResults.length === 0">
            <p class="text-center">No results found for "{{ $route.query.q }}"</p>
        </div>
        <div v-else>
            <div v-for="post in blogStore.searchResults" :key="post.id" class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div class="flex p-6">
                    <img
                        :src="`http://localhost:5000/${post.userId.profilePicture}`"
                        alt="User avatar"
                        class="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div class="flex-1">
                        <h2 class="text=2xl font-semibold mb-2">{{ post.title }}</h2>
                        <p class="text-gray-700 text-sm mb-4"> By {{ post.userId.name }}</p>
                        <p class="text-gray-800 mb-4 inline" v-html=getTrunctedText(post.content.toString())></p>
                        <span><nuxt-link :to="`/getBlog/${post._id}`" class="text-gray-500 text-sm hover:text-black hover:no-underline">
                            Read More
                        </nuxt-link></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useBlogStore } from "@/stores/blogs";

const blogStore = useBlogStore();

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
</script>