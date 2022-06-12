<template>
  <div fixed bottom-0 left-0 right-0 bg-gray-700 text-sm flex flex-row justify-center items-center p-1 color-gray-400>
    Personal work &#169; Al-Afiq Yeong {{ year }}. Codes are public domain unless specified. Opinions are my own.
  </div>
</template>

<script setup lang="ts">
const year = computed(() => new Date().getFullYear());
</script>
