<template>
  <SectionBody mb-5 md:mb-0 v-if="article != null">
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
  <SectionBody v-else>
    <NoContent/>
  </SectionBody>
</template>

<script setup lang="ts">
import { formatDateAs } from '@/util/util';
import { useArticleStore } from '@/store/articles.store';
const articleStore = useArticleStore();
const route = useRoute();

let _content: any = null;
let _article: any = null;
const { tag } = route.params;

const index: number = articleStore.publicArticles.findIndex((article: any) => article.tag == tag);

if (index == -1) {
  _article = await articleStore.getArticleWithTagPublic(tag as string);
} else {
  _article = articleStore.publicArticles[index];
}

if (_article)
  _content = await articleStore.getArticleContent(_article);

const content = computed(() => _content || null);
const article = computed(() => _article || null);

</script>
