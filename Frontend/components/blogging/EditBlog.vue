<template>
  <div v-if="loading">
    <!-- Show loading message or spinner while the check is happening -->
    <p>Loading...</p>
  </div>
  <div v-else>
    <div class="container mx-auto p-6">
      <h2 class="text-2xl font-bold mb-4">Edit your blog</h2>

      <button
        class="bg-red-500 text-white px-4 py-2 rounded"
        @click="deleteBlog"
      >
        Delete Blog
      </button>

      <!-- Title Input Field -->
      <div class="mb-4">
        <label for="blogTitle" class="block text-lg font-semibold mb-2"
          >Title</label
        >
        <input
          id="blogTitle"
          v-model="blog.title"
          type="text"
          placeholder="Enter blog title"
          class="w-full p-3 border rounded"
        />
      </div>

      <!-- Summernote Editor -->
      <textarea ref="summernote" class="w-full p-3 border rounded"></textarea>

      <!-- Submit Button -->
      <button
        class="bg-black text-white py-2 px-3 rounded mt-4"
        @click="updateBlog"
      >
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "#app";
import { useBlogStore } from "@/stores/blogs";
import { useAuthStore } from "@/stores/auth"; // Added auth store reference

const router = useRouter();
const route = useRoute();
const blogStore = useBlogStore();
const authStore = useAuthStore();

const summernote = ref(null);
const blog = ref("");
const loading = ref(true);

// Fetch the blog data when the component is mounted
onMounted(async () => {
  const blogId = route.params.id;
  try {
    await blogStore.getBlog(blogId);
    blog.value = blogStore.blog;
    await blogStore.checkAuthor();

    if (blog.value.userId !== blogStore.currentUser) {
      router.push("/");
    } else {
      loading.value = false; // Only show the page if the user is the author
    }

    if (process.client) {
      $(summernote.value).summernote({
        placeholder: "Edit your content...",
        tabsize: 2,
        height: 200,
        toolbar: [
          ["style", ["style"]],
          ["font", ["bold", "underline", "clear", "fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "video"]],
          ["view", ["fullscreen", "codeview", "help"]],
        ],
        fontsize: ["8", "9", "10", "11", "12", "14", "16", "18", "24", "36"],
      });
      // Set the content in Summernote editor
      $(summernote.value).summernote("code", blog.value.content);
    }
  } catch (err) {
    console.log("Failed to fetch blog:", err);
    router.push("/");
  }
});

const updateBlog = async () => {
  const content = $(summernote.value).summernote("code");

  if (!blog.value || !blog.value.title) {
    alert("Please enter a blog title");
    return;
  }

  try {
    const blogId = route.params.id;
    await blogStore.editBlog(blogId, {
      title: blog.value.title,
      content: content,
    });
    router.push(`/getBlog/${blogId}`);
  } catch (err) {
    console.log("Failed to save blog:", err);
  }
};

const deleteBlog = async () => {
  const blogId = route.params.id;
  const confirmation = confirm("Are you sure you want to delete this blog?");
  if (!confirmation) return;

  try {
    await blogStore.deleteBlog(blogId);
    router.push("/");
  } catch (err) {
    console.log("Failed to delete blog:", err);
  }
};
</script>
