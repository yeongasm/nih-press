<template>
  <div fixed top-0 left-0 w-screen h-screen z-20>
    <div w-full h-full class="bg-black/30">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['on-exit']);
onMounted(() => {
  addEventListener("keyup", (ev) => {
    if (ev.key == "Escape") {
      ev.preventDefault();
      emit('on-exit');
    }
  })
})
</script>
