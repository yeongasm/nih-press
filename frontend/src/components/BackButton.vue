<template>
  <div bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-500 @click="router.go(-1)">
    <span text-white font-bold text-4xl>&lt;</span>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
</script>
