<template>
  <PopupOverlay @on-exit="$emit('on-negative')">
    <div p-2>
      <slot></slot>
      <div flex flex-row justify-end items-center w-full>
        <Button
          bg-rose-400 hover:bg-rose-300 w-15 mr-2
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2); border-radius: 0.5rem"
          @on-click="$emit('on-negative')"
        >
          {{ props.negative_btn_text }}
        </Button>
        <Button
          bg-green-400 hover:bg-green-300 w-15
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2);  border-radius: 0.5rem"
          :listen_to_enter="true"
          @on-click="$emit('on-positive')"
        >
          {{ props.positive_btn_text }}
        </Button>
      </div>
    </div>
  </PopupOverlay>
</template>

<script setup lang="ts">
const props = defineProps({
  positive_btn_text: {
    type: String,
    default: "Confirm"
  },
  negative_btn_text: {
    type: String,
    default: "Cancel"
  }
});
defineEmits(['on-positive', 'on-negative']);
</script>
