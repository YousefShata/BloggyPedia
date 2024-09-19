<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-semibold mb-6 text-center text-black">
        Profile
      </h2>
      <form
        @submit.prevent="updateProfile"
        enctype="multipart/form-data"
        class="space-y-4"
      >
        <!-- Profile Picture with Click to Change -->
        <div class="flex flex-col items-center space-y-4">
          <label class="relative cursor-pointer">
            <img
              :src="
                user.profilePicturePreview ||
                `http://localhost:5000/${user.profilePicture}`
              "
              alt="Profile Picture"
              class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <input
              ref="fileInput"
              type="file"
              @change="handleFileUpload"
              class="hidden"
            />
          </label>
          <span class="text-sm text-gray-500">Click image to change</span>
        </div>

        <!-- Name Field -->
        <input
          v-model="user.name"
          type="text"
          placeholder="Name"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        <!-- Email Field -->
        <input
          v-model="user.email"
          type="email"
          placeholder="Email"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled
        />

        <!-- Save Button -->
        <button
          type="submit"
          class="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-200"
        >
          Save Changes
        </button>
        <button
          type="button"
          class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 mt-4"
          @click="deleteUser"
        >
          Delete Account
        </button>
      </form>
      <h3 class="text-xl font-semibold mb-4">Your Blogs:</h3>

      <div v-if="blogs.length" class="mt-8">
        <ul class="space-y-2">
          <li
            v-for="blog in blogs"
            :key="blog._id"
            class="text-blue-500 hover:underline"
          >
            <router-link :to="`/getBlog/${blog._id}`">{{
              blog.title
            }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useBlogStore } from "@/stores/blogs";
const user = ref({
  profilePicturePreview: "",
});

const blogs = ref([]);

const authStore = useAuthStore();
const blogStore = useBlogStore();

const router = useRouter();

onMounted(async () => {
  await authStore.myProfile();
  user.value = authStore.user; // Update posts with the store data
  user.profilePicturePreview = `http://localhost:5000/${user.value.profilePicture}`;

  try {
    await blogStore.getUserBlogs(user.value._id);
    blogs.value = blogStore.blogs;
    console.log(blogStore.blogs);
  } catch (error) {
    console.error("Failed to fetch user blogs:", error);
  }
});

const handleFileUpload = (event) => {
  const uploadedFile = event.target.files[0];
  if (uploadedFile) {
    // Preview the new picture in the UI before saving it
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.profilePicturePreview = e.target.result; // Update preview
    };
    reader.readAsDataURL(uploadedFile);

    user.value.profilePicture = uploadedFile; // Update file object
  }
};

const updateProfile = async () => {
  const formData = new FormData();
  formData.append("name", user.value.name);
  if (user.value.profilePicture) {
    formData.append("profilePicture", user.value.profilePicture);
  }
  formData.append("id", user.value._id);
  console.log(user.value._id);
  try {
    await authStore.UpdateProfile(formData);
    router.push("/");
  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};

const deleteUser = async () => {
  const userId = user.value._id;
  const confirmation = confirm("Are you sure you want to delete this user?");
  if (!confirmation) return;

  try {
    await authStore.deleteProfile(userId);
  } catch (err) {
    console.log("Failed to delete user:", err);
  }
};
</script>

<style scoped>
/* Style for rounded profile picture */
img {
  transition: 0.2s;
}
img:hover {
  opacity: 0.8;
}
</style>
