<template>
  <PopupOverlay v-if="openCreateArticlePopup" @on-exit="revertValuesAndClosePopup()">
    <div p-3 flex flex-col justify-center items-start class="w-[500px]">
      <Title mb-5>Create an Article to share</Title>
      <Input w-full mb-2
        title="Title"
        :default="newArticleForm.title"
        @on-input="newArticleForm.title = $event"
        input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"
      />
      <Input w-full mb-2
        title="Description"
        :default="newArticleForm.description"
        @on-input="newArticleForm.description = $event"
        input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"
      />
      <div w-full mb-4>
        <div w-full mb-2>
          <SubHeading>Group</SubHeading>
          <v-select
            w-full
            label="name"
            :reduce="(group: any) => group.id"
            :options="groupStore.userGroups"
            v-model="articlePrimaryTag.groupId"
          />
        </div>
        <div flex flex-row justify-between items-center>
          <Input class="w-[47.5%]" title="Primary Key" :default="articlePrimaryTag.key" @on-input="articlePrimaryTag.key = $event" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"/>
          <Input class="w-[47.5%]" title="Primary Value" :default="articlePrimaryTag.value" @on-input="articlePrimaryTag.value = $event" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"/>
        </div>
      </div>
      <div flex justify-end items-center w-full>
        <Button
          bg-rose-400 hover:bg-rose-300 w-15 mr-2
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2); border-radius: 0.5rem"
          @on-click="revertValuesAndClosePopup()"
        >
          Cancel
        </Button>
        <Button
          bg-green-400 hover:bg-green-300 w-15
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2);  border-radius: 0.5rem"
          :listen_to_enter="true"
          :enable="enableCreateButton"
          @on-click="createNewArticle()"
        >
          <span v-if="!isSubmitting">Create</span>
          <div v-else class="w-[40px] h-[24px] spinner">
            <EllipsisSpinner background="#fff" :x="8" :y="8" />
          </div>
        </Button>
      </div>
    </div>
  </PopupOverlay>

  <ConfirmDialog v-if="showConfirmDialog" @on-positive="permaDeleteArticle" @on-negative="onDialogClose">
    <Title mb-5>Warning</Title>
    <div flex flex-row justify-start items-center mb-5>
      Are you sure you want to permanently delete {{ deletingItemConfirmText }}.
    </div>
  </ConfirmDialog>

  <div flex flex-row justify-between items-start w-full m-1>
    <div w-full>
      <Title mb-4>Articles</Title>
      <div flex flex-row justify-center items-center>
        <SectionBody w-full>
          <Text>Share your ideas, knowledge and thoughts to the world. Express them in the form of articles!</Text>
          <div flex items-center justify-end mt-5 mb-2>
            <Button
              bg-blue-400 hover:bg-blue-300
              class="transition"
              font_size="smalltext"
              style="padding: calc(1rem / 2); border-radius: 0.5rem"
              @on-click="openCreateArticlePopup = true"
            >
              New Article
            </Button>
          </div>
          <Table
            v-if="articleStore.userArticles.length"
            :columns="['id', 'title', 'description', 'show', 'url', 'created_at', 'edited_at', 'action']"
            :alias="{ id: 'ID', title: 'Title', description: 'Description', show: 'Visible', url: 'URL', created_at: 'Created At', edited_at: 'Edited At', action: 'Action' }"
            :configuration="{
              show: {
                type: 'custom',
                display: (article: any) => article.show ? 'Visible' : 'Hidden'
              },
              created_at: {
                type: 'date',
                format: 'dddd DD/MM/YYYY - HH:mm:ss'
              },
              edited_at: {
                type: 'date',
                format: 'dddd DD/MM/YYYY - HH:mm:ss'
              },
              action: {
                type: 'button',
                list: [
                  {
                    display: 'edit',
                    callback: editArticle,
                    secondary_color: '#fff',
                    main_color: '#54b95c'
                  },
                  {
                    display: (article: any) => article.publish ? 'unpublish' : 'publish',
                    callback: tryPublishOrUnpublishArticle,
                    secondary_color: '#fff',
                    main_color: '#12aaf3'
                  },
                  {
                    display: 'delete',
                    callback: deleteArticleCb,
                    secondary_color: '#fff',
                    main_color: '#c33a49'
                  }
                ]
              }
            }"
            :data="articleStore.userArticles"
          />
        </SectionBody>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from '@/store/groups.store';
import { useTagStore } from '@/store/tags.store';
import { useArticleStore } from '@/store/articles.store';

const router = useRouter();
const groupStore = useGroupsStore();
const tagStore = useTagStore();
const articleStore = useArticleStore();

(!tagStore.userTags.length && tagStore.getTags());
(!articleStore.userArticles.length && articleStore.getArticles({}));

interface NewArticleForm {
  title: string,
  description: string
};

const openCreateArticlePopup = ref(false);
const showConfirmDialog = ref(false);
const isSubmitting = ref<boolean>(false);
const deletingItemConfirmText = ref("");
const selectedArticleId = ref(-1);

const articlePrimaryTag = reactive({
  key: "",
  value: "",
  groupId: 0
});

const newArticleForm = reactive<NewArticleForm>({
  title: "",
  description: ""
});

groupStore.getGroups().then(() => { articlePrimaryTag.groupId = groupStore.userGroups[0].id; });

const revertValuesAndClosePopup = () => {
  newArticleForm.title = "";
  newArticleForm.description = "";
  openCreateArticlePopup.value = false;
};

const enableCreateButton = computed(() => newArticleForm.title.length && newArticleForm.description.length && articlePrimaryTag.key.length && articlePrimaryTag.value.length && !isSubmitting.value);

const createNewArticle = () => {
  if (!isSubmitting.value) {
    isSubmitting.value = true;
    tagStore.newTag({
      key: articlePrimaryTag.key,
      value: articlePrimaryTag.value,
      visible: false,
      isPrimaryTag: true,
      groupId: articlePrimaryTag.groupId,
    }).then((tag: any) => {
      articleStore.newArticle({
        title: newArticleForm.title,
        description: newArticleForm.description,
        tag_id: tag.id
      })
      .then(() => {
        revertValuesAndClosePopup();
        isSubmitting.value = false;
      });
    })
  }
};

const onDialogClose = () => {
  showConfirmDialog.value = false;
  deletingItemConfirmText.value = "";
  selectedArticleId.value = -1;
};

const deleteArticleCb = (article: any) => {
  showConfirmDialog.value = true;
  selectedArticleId.value = article.id;
  deletingItemConfirmText.value = `article with title [ ${article.title} ]`;
};

const permaDeleteArticle = () => {
  articleStore.deleteArticle(selectedArticleId.value);
  onDialogClose();
};

const editArticle = (article: any) => { router.push(`articles/${article.id}`); };
const tryPublishOrUnpublishArticle = (article: any) => { articleStore.mutateArticlePublishState(!article.publish, article.id); };
</script>
