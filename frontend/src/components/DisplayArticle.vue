<template>
  <SectionBody mb-5 md:mb-0>
    <BackButton mb-5/>
    <Title mb-5>{{ article.title }}</Title>
    <SmallText>Posted on {{ formatDateAs(article.created_at, "DD MMMM YYYY") }} </SmallText>
    <SmallText mb-2>Written by {{ article.author.display_name }}</SmallText>
    <div w-full mb-10>
      <SubHeading font-bold>Tags</SubHeading>
      <TagList :list="article.article_tags" />
    </div>
    <div v-html="content"></div>
  </SectionBody>
</template>

<script setup lang="ts">
import { formatDateAs } from '@/util/util';
import { useArticleStore } from '@/store/articles.store';
const articleStore = useArticleStore();
const route = useRoute();

const { id } = route.params;
const article = await articleStore.getArticleWithIdPublic(parseInt(id as string));
const content = await articleStore.getArticleContent(article);
</script>
