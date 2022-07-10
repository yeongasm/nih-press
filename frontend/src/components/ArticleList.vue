<template>
  <div flex flex-col md:grid md:grid-cols-3 md:gap-1 v-if="props.layout == 'card'">
    <div v-for="article of userArticles"
      bg-white rounded-lg border-1 border-gray-200 hover:border-blue-300 p-2 cursor-pointer flex flex-col justify-start items-start
      class="transition"
      @click="router.push(`/articles/${article.id}`)"
    >
      <SubHeading font-bold mb-4>{{ article.title }}</SubHeading>
      <TagList mb-2 :list="article.article_tags" />
      <div flex justify-start items-center mb-2>
        <CalendarIcon mr-2/>
        <SmallText>{{ formatDateAs(article.created_at, "DD MMMM YYYY") }}</SmallText>
      </div>
      <SmallText text-justify>{{ article.description }}</SmallText>
    </div>
  </div>
  <div v-else>
    <div v-if="props.layout == 'list'">
      <div v-for="article of userArticles"
        @click="router.push(`/articles/${article.id}`)"
        py-4 cursor-pointer
        class="article-section"
      >
        <SubHeading font-bold mb-2 class="article-title">{{ article.title }}</SubHeading>
        <div flex justify-start items-center mb-2>
          <CalendarIcon mr-2/>
          <SmallText class="article-description">{{ formatDateAs(article.created_at, "DD MMMM YYYY") }}</SmallText>
        </div>
        <SmallText text-justify class="article-description">{{ article.description }}</SmallText>
      </div>
    </div>
    <div flex flex-col w-full mb-3 xl:mb-0 v-else>
      <SectionBody v-for="article of userArticles" @click="router.push(`/articles/${article.id}`)" first-of-type:mt-0 my-4 md:my-0 cursor-pointer hover:border-blue-300 mb-3>
        <Title mb-5>{{ article.title }}</Title>
        <TagList mb-2 :list="article.article_tags" />
        <div mb-2>
          <div flex justify-start items-center mb-1>
            <CalendarIcon mr-2/>
            <SmallText>{{ formatDateAs(article.created_at, "DD MMMM YYYY") }}</SmallText>
          </div>
          <div flex justify-start items-center>
            <PersonIcon mr-2/>
            <SmallText>{{ article.author.display_name }}</SmallText>
          </div>
        </div>
        <Text>{{ article.description }}</Text>
      </SectionBody>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDateAs } from '@/util/util';
import { useArticleStore } from '@/store/articles.store';
const articleStore = useArticleStore();
const router = useRouter();

interface ArticleContainerProps {
  limit: number,
  paginate: boolean,
  layout: 'list' | 'card' | 'tile'
};

const props = defineProps<ArticleContainerProps>();

(!articleStore.publicArticles.length && await articleStore.getArticlesPublic({ limit: props.limit }));
const userArticles: any = articleStore.publicArticles;

</script>

<style scoped>
.transition {
  transition: border-color 0.2s ease-in-out;
}
.article-section {
  border-bottom: 1px solid #cbd5e1;
}
.article-section:first-child {
  padding-top: 0;
}
.article-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.article-section:hover > .article-title {
  color: #6b7280;
}
.article-section:hover > .article-description {
  color: #6b7280;
}
.article-section:hover > div > .article-description {
  color: #6b7280;
}
</style>
