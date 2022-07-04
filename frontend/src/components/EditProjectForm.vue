<template>
  <div mb-4 flex items-center>
    <BackButton />
    <Title ml-4>Edit Project &lt;id: {{ selectedProject.id }}&gt;</Title>
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
          @on-click="tryUpdateProject()"
        >
          <span v-if="!showSpinner">Save</span>
          <div v-else class="w-[40px] h-[24px] spinner">
            <EllipsisSpinner background="#fff" :x="8" :y="8" />
          </div>
        </Button>
      </div>
      <Input title="Title" mb-2 input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem" :default="projectForm.title" @on-input="projectForm.title = $event"/>
      <Input title="Description" mb-2 input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem" :default="projectForm.description" @on-input="projectForm.description = $event"/>
      <div flex justify-between items-center w-full mb-2>
        <Input title="Repo URL" class="w-[70%]" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem" :default="projectForm.repoUrl" @on-input="projectForm.repoUrl = $event"/>
        <div class="w-[25%]">
          <SubHeading>Repo Type</SubHeading>
          <v-select w-full :options="['none', 'github', 'gitlab', 'bitbucket']" v-model="projectForm.repoType" />
        </div>
      </div>
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
            <Toggle v-model="projectForm.visible" />
          </div>
          <div flex flex-col justify-center items-center flex-grow>
            <SubHeading mb-1>Publish</SubHeading>
            <Toggle v-model="projectForm.publish" />
          </div>
        </div>
      </div>
      <Editor
        v-model="projectForm.content"
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
import { useProjectStore } from '@/store/projects.store';
import Toggle from '@vueform/toggle';
import Editor from '@tinymce/tinymce-vue';

const tagStore = useTagStore();
const projectStore = useProjectStore();
const router = useRouter();

const id: string = useRoute().params.id as string;
const listOfTags = ref();

(!tagStore.userTags.length && await tagStore.getTags());
await projectStore.getProjectWithId(parseInt(id));
const selectedProject = projectStore.selectedProject;

const projectForm = reactive({
  title: selectedProject.title,
  description: selectedProject.description,
  visible: selectedProject.show,
  publish: selectedProject.publish,
  repoUrl: selectedProject.repo_url,
  repoType: selectedProject.repo_type,
  content: ""
});

if (selectedProject.content_url && selectedProject.content_url.length)
  projectForm.content = await projectStore.getProjectContent();

const project_tags = projectStore.selectedProject.project_tags;
const primary_tag = project_tags[project_tags.findIndex((tag: any) => tag.tag)];
listOfTags.value = tagStore.userTags.filter((tag: any) => (tag.key != primary_tag.key && !tag.is_primary_tag));

const showSpinner = ref<boolean>(false);

const tinyMceApiKey = computed(() => import.meta.env.VITE_TINY_MCE_API_KEY);
const additionalTags = ref<number[]>([]);

for (const projectTags of selectedProject.project_tags) {
  if (!projectTags.tag.is_primary_tag)
    additionalTags.value.push(projectTags.tag.id);
}

const enableSaveButton = computed(() => projectForm.title.length && projectForm.description.length ? true : false);

const tryUpdateProject = () => {
  showSpinner.value = true;
  projectStore.updateProject({
    ...((projectForm.title.length && projectForm.title != selectedProject.title) && { title: projectForm.title }),
    ...((projectForm.description.length && projectForm.description != selectedProject.description) && { description: projectForm.description }),
    ...((projectForm.repoUrl?.length && projectForm.repoUrl != selectedProject.repo_url) && { repo_url: projectForm.repoUrl}),
    ...((projectForm.repoType.length && projectForm.repoType != selectedProject.repo_type) && { repo_type: projectForm.repoType }),
    ...((projectForm.visible != selectedProject.show) && { show: projectForm.visible }),
    ...((projectForm.publish != selectedProject.publish) && { publish: projectForm.publish }),
    ...((projectForm.content.length && { content: projectForm.content })),
    ...((additionalTags.value.length && { tag_ids: additionalTags.value }))
  })
  .then((result: boolean) => {
    showSpinner.value = false;
  });
};

</script>

<style src="@vueform/toggle/themes/default.css"></style>
