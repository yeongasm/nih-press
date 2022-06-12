<template>
  <FullScreenOverlay @on-exit="$emit('on-exit')">
    <div w-full h-full flex justify-center items-center>
      <div bg-white rounded-lg>
        <slot></slot>
      </div>
    </div>
  </FullScreenOverlay>
</template>

<script setup lang="ts">
defineEmits(['on-exit']);
</script>
