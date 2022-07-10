<template>
  <div flex flex-col items-center justify-center w-full>
    <span text-white text-xs rounded p-1 whitespace-nowrap :class="copy.shake" :style="{ 'background-color': copy.color }">
      {{ copy.str }}
    </span>
    <div class="speech-bubble-tail" :style="{ 'border-top-color': copy.color }"></div>
  </div>
</template>

<script setup lang="ts">
const prop = defineProps({ click_count: { type: Number, required: true, default: 0 } });
const list = [
  { str: "Copied!", color: "#5abdf7", shake: 'none' },
  { str: "Double Copy!", color: "#5abdf7", shake: 'none' },
  { str: "Triple Copy!", color: "#5abdf7", shake: 'none' },
  { str: "Ultra Copy!", color: "#5abdf7", shake: 'none' },
  { str: "Rampage!!", color: "#68d168", shake: 'mild' },
  { str: "Copying Spree!!", color: "#68d168", shake: 'mild' },
  { str: "Dominating!!", color: "#68d168", shake: 'mild' },
  { str: "Mega Copy!!", color: "#68d168", shake: 'mild' },
  { str: "Unstoppable!!", color: "#68d168", shake: 'mild' },
  { str: "Wicked Sick!!", color: "#68d168", shake: 'mild' },
  { str: "Monster Copy!!!", color: "#fb6868", shake: 'heavy' },
  { str: "Godlike!!!", color: "#fb6868", shake: 'heavy' },
  { str: "Holy $#@*!!!!", color: "#fb6868", shake: 'heavy' },
  { str: "Ownage!!!!!", color: "#fb6868", shake: 'heavy' }
];
const copy = computed(() => {
  let index: number = prop.click_count - 1;
  (index < 0) && (index = 0);
  return list[index % list.length];
});

</script>

<style>
.speech-bubble-tail {
  width: 0;
  height: 0;
  border-left: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-top-width: 0.5rem;
  border-top-style: solid;
}

.mild {
  animation: shake 0.35s ease-in-out;
}

.heavy {
  animation: shake 0.35s ease-in-out infinite;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

</style>
