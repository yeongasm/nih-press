<template>
  <SuspenseWrapper :component="ProjectList" :bindings="props" />
</template>

<script setup lang="ts">
import ProjectList from '@/components/ProjectList.vue';

interface ProjectContainerProps {
  limit?: number,
  paginate: boolean,
  is_home_screen: boolean
};

const props = defineProps<ProjectContainerProps>();

</script>
