<template>
  <div v-if="prop.element == 'div'" text-xs text-gray-400>
    <slot></slot>
  </div>
  <span v-else text-xs text-gray-400>
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
const prop = defineProps({
  element: {
    type: String,
    default: "div",
    validator(val: string) {
      return ["div", "span"].includes(val)
    }
  }
});
</script>
