<template>
  <div mb-4 flex items-center>
    <BackButton />
    <Title ml-4>Edit Article &lt;id: {{ selectedArticle.id }}&gt;</Title>
  </div>
  <div w-full grid grid-cols-2 gap-5>
    <SectionBody>
      <div w-full flex justify-end items-center mb-4>
        <Button
          bg-rose-400 hover:bg-rose-300 w-15 mr-2
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2); border-radius: 0.5rem"
          @on-click="router.go(-1)"
        >
          Cancel
        </Button>
        <Button
          bg-green-400 hover:bg-green-300 w-15
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2);  border-radius: 0.5rem"
          :enable="enableSaveButton"
          :listen_to_enter="true"
          @on-click="tryUpdateArticle()"
        >
          <span v-if="!showSpinner">Save</span>
          <div v-else class="w-[40px] h-[24px] spinner">
            <EllipsisSpinner background="#fff" :x="8" :y="8" />
          </div>
        </Button>
      </div>
      <Input title="Title" mb-2 input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem" :default="articleForm.title" @on-input="articleForm.title = $event"/>
      <Input title="Description" mb-2 input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem" :default="articleForm.description" @on-input="articleForm.description = $event"/>
      <div mb-4 flex justify-start items-center w-full>
        <div class="w-[70%]">
          <SubHeading>Additional Tag(s)</SubHeading>
          <v-select w-full
            :options="listOfTags"
            label="key"
            :reduce="(tag: any) => tag.id"
            v-model="additionalTags"
            multiple
          ></v-select>
        </div>
        <div flex flex-grow justify-between items-center>
          <div flex flex-col justify-center items-center flex-grow>
            <SubHeading mb-1>Visible</SubHeading>
            <Toggle v-model="articleForm.visible" />
          </div>
          <div flex flex-col justify-center items-center flex-grow>
            <SubHeading mb-1>Publish</SubHeading>
            <Toggle v-model="articleForm.publish" />
          </div>
        </div>
      </div>
      <Editor
        v-model="articleForm.content"
        :api-key="tinyMceApiKey"
        :init="{ plugins: 'link image table code codesample help wordcount preview media fullscreen emoticons paste pagebreak lists advlist' }"
        class="h-[480px]"
      />
    </SectionBody>
    <div>
      <ImageList :tag="primary_tag.tag" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTagStore } from '@/store/tags.store';
import { useArticleStore } from '@/store/articles.store';
import Toggle from '@vueform/toggle';
import Editor from '@tinymce/tinymce-vue';

const tagStore = useTagStore();
const articleStore = useArticleStore();
const router = useRouter();

const id: string = useRoute().params.id as string;
const listOfTags = ref();

(!tagStore.userTags.length && await tagStore.getTags());
await articleStore.getArticleWithId(parseInt(id));
const selectedArticle = articleStore.selectedArticle;

const articleForm = reactive({
  title: selectedArticle.title,
  description: selectedArticle.description,
  visible: selectedArticle.show,
  publish: selectedArticle.publish,
  content: ""
});

if (selectedArticle.url && selectedArticle.url.length)
  articleForm.content = await articleStore.getArticleContent();

const article_tags = articleStore.selectedArticle.article_tags;
const primary_tag = article_tags[article_tags.findIndex((tag: any) => tag.tag)];
listOfTags.value = tagStore.userTags.filter((tag: any) => (tag.key != primary_tag.key && !tag.is_primary_tag));

const showSpinner = ref<boolean>(false);

const tinyMceApiKey = computed(() => import.meta.env.VITE_TINY_MCE_API_KEY);
const additionalTags = ref<number[]>([]);

for (const articleTags of selectedArticle.article_tags) {
  if (!articleTags.tag.is_primary_tag)
    additionalTags.value.push(articleTags.tag.id);
}

const enableSaveButton = computed(() => articleForm.title.length && articleForm.description.length ? true : false);

const tryUpdateArticle = () => {
  showSpinner.value = true;
  articleStore.updateArticle({
    ...((articleForm.title.length && articleForm.title != selectedArticle.title) && { title: articleForm.title }),
    ...((articleForm.description.length && articleForm.description != selectedArticle.description) && { description: articleForm.description }),
    ...((articleForm.visible != selectedArticle.show) && { show: articleForm.visible }),
    ...((articleForm.publish != selectedArticle.publish) && { publish: articleForm.publish }),
    ...((articleForm.content.length && { content: articleForm.content })),
    ...((additionalTags.value.length && { tag_ids: additionalTags.value }))
  })
  .then(() => {
    showSpinner.value = false;
  });
};

</script>

<style src="@vueform/toggle/themes/default.css"></style>
