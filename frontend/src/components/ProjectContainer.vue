<template>
  <SuspenseWrapper :component="ProjectList" :bindings="props" />
</template>

<script setup lang="ts">
import ProjectList from '@/components/ProjectList.vue';

interface ProjectContainerProps {
  limit: number,
  paginate: boolean,
  show_cards: boolean
};

const props = defineProps<ProjectContainerProps>();

</script>
