<template>
  <div class="container">
    <h2>Create your blog</h2>
    <textarea ref="summernote"></textarea>
    <button @click="submitBlog">Save Blog</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // refence elements to bind them to the template
import { useRouter } from "#app"; // for routing
import { useBlogStore } from "@/stores/blogs";

const router = useRouter();
const blogStore = useBlogStore();
const summernote = ref(null);
onMounted(() => {
  if (process.client) {
    $(summernote.value).summernote({
      placeholder: 'Start typing...',
      tabsize: 2,
      height: 200,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen', 'codeview', 'help']],
      ],
    });
  }
});

const submitBlog = async () => {
  const content = $(summernote.value).summernote('code');
  console.log(content);

  // You can call your store's save action here
  // await blogStore.saveBlog({ content });
};
</script>
