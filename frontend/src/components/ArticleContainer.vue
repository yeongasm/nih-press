<template>
  <SuspenseWrapper :component="ArticleList" :bindings="props" />
</template>

<script setup lang="ts">
import ArticleList from '@/components/ArticleList.vue';

interface ArticleContainerProps {
  limit: number,
  paginate: boolean,
  layout: 'list' | 'card' | 'tile'
};

const props = defineProps<ArticleContainerProps>();

</script>
