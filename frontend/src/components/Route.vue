<template>
  <!-- <router-link :to="props.to" text-gray-400 :class="isCurrentRoute ? 'underline' : 'no-underline'"> -->
  <router-link :to="props.to" text-gray-400 :class="isCurrentRoute ? 'lg:underline' : 'lg:no-underline'">
    <span class="link" :class="!isCurrentRoute ? 'link-underline link-underline-black' : ''">
      <slot></slot>
    </span>
  </router-link>
</template>

<script setup lang="ts">
const props = defineProps({ to: String });
const isCurrentRoute = computed(() => props.to == useRouter().currentRoute.value.path);
</script>

<style>
.link-underline {
  border-bottom-width: 0;
  background-image: linear-gradient(transparent, transparent), linear-gradient(#fff, #fff);
  background-size: 0 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size .25s ease-in-out;
}

.link-underline-black {
  background-image: linear-gradient(transparent, transparent), linear-gradient(#9ca3af, #9ca3af)
}

.link-underline:hover {
  background-size: 100% 1px;
  background-position: 0 100%
}
</style>
