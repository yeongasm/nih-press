<template>
  <div overflow-hidden rounded-full bg-gray-700 hover:bg-gray-500 cursor-pointer flex justify-center items-center @click="$emit('on-click')" w-6 h-6>
    <img :src="chevronRight" />
  </div>
</template>

<script setup lang="ts">
import chevronRight from '@/assets/chevron_right.png';
defineEmits(['on-click']);
</script>
