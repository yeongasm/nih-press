<template>
  <div
    flex justify-center items-center p-3 rounded-full cursor-pointer
    :class="{ 'button-disabled': !props.enable }"
    @click="props.enable && $emit('on-click')"
  >
    <VariadicTextSize :font_size="font_size" text-white>
      <slot></slot>
    </VariadicTextSize>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  enable: {
    type: Boolean,
    default: true
  },
  listen_to_enter: {
    type: Boolean,
    default: false
  },
  font_size: {
    type: String,
    default: "subheading",
    validator(val: string) {
      return ["title", "heading", "subheading", "text", "smalltext"].includes(val);
    }
  }
});

const emit = defineEmits(['on-click']);
const onEnter = () => (props.enable) && emit('on-click');

onMounted(() => {
  if (props.listen_to_enter) {
    addEventListener('keyup', (e) => {
      if (e.key == "Enter") {
        e.preventDefault();
        onEnter();
      }
    });
  }
});
</script>

<style>
.button-disabled {
  background-color: #e2e8f0 !important;
  cursor: default !important;
}
</style>
