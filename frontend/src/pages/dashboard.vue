<template>
  <router-view/>
</template>

<route>
{
  meta: {
    layout: "dashboard",
    requiresAuth: true
  }
}
</route>

<script setup lang="ts">
// import { useUserStore } from '../store/user.store';
// onMounted(() => {
//   const userStore = useUserStore();
//   userStore.refreshAccessToken();
// });
</script>
