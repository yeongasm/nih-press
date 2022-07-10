<template>
  <div :class="prop.bg">
    <img max-w-full :class="{ 'w-full h-auto': !prop.vertical, 'h-full w-auto': prop.vertical }" :src="prop.img_url" :alt="prop.img_url" />
  </div>
</template>

<script setup lang="ts">
const prop = defineProps({
  img_url: {
    type: String,
    required: true
  },
  vertical: {
    type: Boolean,
    default: false
  },
  bg: {
    type: String,
    default: "bg-white"
  }
});
</script>
