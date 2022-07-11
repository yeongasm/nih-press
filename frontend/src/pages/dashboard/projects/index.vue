<template>
  <PopupOverlay v-if="openCreateProjectPopup" @on-exit="revertValuesAndClosePopup()">
    <div p-3 flex flex-col justify-center items-start class="w-[500px]">
      <Title mb-5>Create a Project to showcase</Title>
      <div relative w-full mb-5>
        <SubHeading mb-1>Banner Image</SubHeading>
        <ImageContainer v-if="projectBannerImg != null" overflow-hidden rounded-lg w-full h-40 :img_url="projectBannerImgUrl" />
        <div v-else overflow-hidden rounded-lg w-full h-40 bg-slate-300>
        </div>
        <ImageUpload absolute bottom-1 right-1 z-10 @on-input="projectBannerImg = $event" @on-delete="projectBannerImg = null" />
      </div>
      <Input w-full mb-2
        title="Title"
        :default="newProjectForm.title"
        @on-input="newProjectForm.title = $event"
        input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"
      />
      <Input w-full mb-2
        title="Description"
        :default="newProjectForm.description"
        @on-input="newProjectForm.description = $event"
        input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"
      />
      <div w-full mb-2>
        <div w-full mb-2>
          <SubHeading>Group</SubHeading>
          <v-select
            w-full
            label="name"
            :reduce="(group: any) => group.id"
            :options="groupStore.userGroups"
            v-model="projectPrimaryTag.groupId"
          />
        </div>
        <div flex flex-row justify-between items-center>
          <Input class="w-[47.5%]" title="Primary Key" :default="projectPrimaryTag.key" @on-input="projectPrimaryTag.key = $event" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"/>
          <Input class="w-[47.5%]" title="Primary Value" :default="projectPrimaryTag.value" @on-input="projectPrimaryTag.value = $event" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"/>
        </div>
      </div>
      <div w-full flex justify-center items-center mb-4>
        <Input
          w="1/2" m-1
          title="Project URL"
          :default="newProjectForm.repo_url"
          @on-input="newProjectForm.repo_url = $event"
          input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"
        />
        <div w="1/2" m-1>
          <SubHeading>Project Type</SubHeading>
          <v-select w-full :options="['none', 'github', 'gitlab', 'bitbucket']" v-model="newProjectForm.repo_type"></v-select>
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
          @on-click="createNewProject()"
        >
          <span v-if="!isSubmitting">Create</span>
          <div v-else class="w-[40px] h-[24px] spinner">
            <EllipsisSpinner background="#fff" :x="8" :y="8" />
          </div>
        </Button>
      </div>
    </div>
  </PopupOverlay>

  <ConfirmDialog v-if="showConfirmDialog" @on-positive="permaDeleteProject" @on-negative="onDialogClose">
    <Title mb-5>Warning</Title>
    <div flex flex-row justify-start items-center mb-5>
      Are you sure you want to permanently delete {{ deletingItemConfirmText }}.
    </div>
  </ConfirmDialog>

  <div flex flex-row justify-between items-start w-full m-1>
    <div w-full>
      <Title mb-4>Projects</Title>
      <div flex flex-row justify-center items-center>
        <SectionBody w-full>
          <Text>Add projects to showcase as your portfolio.</Text>
          <div flex items-center justify-end mt-5 mb-2>
            <Button
              bg-blue-400 hover:bg-blue-300
              class="transition"
              font_size="smalltext"
              style="padding: calc(1rem / 2); border-radius: 0.5rem"
              @on-click="openCreateProjectPopup = true"
            >
              New Project
            </Button>
          </div>
          <Table
            v-if="projectStore.userProjects.length"
            :columns="['id', 'title', 'description', 'show', 'repo_url', 'repo_type', 'created_at', 'edited_at', 'action']"
            :alias="{ id: 'ID', title: 'Title', description: 'Description', show: 'Visible', repo_url: 'Repo URL', repo_type: 'Repo Type', created_at: 'Created At', edited_at: 'Edited At', action: 'Action' }"
            :configuration="{
              show: {
                type: 'custom',
                display: (project: any) => project.show ? 'Visible' : 'Hidden'
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
                    callback: editProject,
                    secondary_color: '#fff',
                    main_color: '#54b95c'
                  },
                  {
                    display: (project: any) => project.publish ? 'unpublish' : 'publish',
                    callback: tryPublishOrUnpublishProject,
                    secondary_color: '#fff',
                    main_color: '#12aaf3'
                  },
                  {
                    display: 'delete',
                    callback: deleteProjectCb,
                    secondary_color: '#fff',
                    main_color: '#c33a49'
                  }
                ]
              }
            }"
            :data="projectStore.userProjects"
          />
        </SectionBody>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from '@/store/groups.store';
import { useTagStore } from '@/store/tags.store';
import { useProjectStore } from '@/store/projects.store';

const router = useRouter();
const groupStore = useGroupsStore();
const tagStore = useTagStore();
const projectStore = useProjectStore();

projectStore.getProjects();

interface NewProjectForm {
  title: string,
  description: string,
  repo_url: string,
  repo_type: 'none' | 'github' | 'gitlab' | 'bitbucket'
};

const openCreateProjectPopup = ref(false);
const showConfirmDialog = ref(false);
const isSubmitting = ref<boolean>(false);
const deletingItemConfirmText = ref("");
const selectedProjectId = ref(-1);
const projectPrimaryTag = reactive({
  key: "",
  value: "",
  groupId: 0
});

const newProjectForm = reactive<NewProjectForm>({
  title: "",
  description: "",
  repo_url: "",
  repo_type: "none"
});

const projectBannerImg = ref(null);
const projectBannerImgUrl = computed(() => !projectBannerImg.value ? "" : URL.createObjectURL(projectBannerImg.value));

groupStore.getGroups().then(() => { projectPrimaryTag.groupId = groupStore.userGroups[0].id; });

const revertValuesAndClosePopup = () => {
  newProjectForm.title = "";
  newProjectForm.description = "";
  newProjectForm.repo_url = "";
  newProjectForm.repo_type = "none";
  openCreateProjectPopup.value = false;
};

const enableCreateButton = computed(() => newProjectForm.title.length && newProjectForm.description.length && projectPrimaryTag.key.length && projectPrimaryTag.value.length && !isSubmitting.value);
const createNewProject = () => {
  if (!isSubmitting.value) {
    isSubmitting.value = true;
    tagStore.newTag({
      key: projectPrimaryTag.key,
      value: projectPrimaryTag.value,
      visible: false,
      isPrimaryTag: true,
      groupId: projectPrimaryTag.groupId,
    }).then((tag: any) => {
      projectStore.newProject({
        title: newProjectForm.title,
        description: newProjectForm.description,
        tag_id: tag.id,
        ...(newProjectForm.repo_url.length && { repo_url: newProjectForm.repo_url, repo_type: newProjectForm.repo_type }),
        ...(projectBannerImg.value != null && { bannerImg: projectBannerImg.value })
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
  selectedProjectId.value = -1;
};

const deleteProjectCb = (project: any) => {
  showConfirmDialog.value = true;
  selectedProjectId.value = project.id;
  deletingItemConfirmText.value = `project with title [ ${project.title} ]`;
};

const permaDeleteProject = () => {
  projectStore.deleteProject(selectedProjectId.value);
  onDialogClose();
};

const editProject = (project: any) => { router.push(`projects/${project.id}`); };
const tryPublishOrUnpublishProject = (project: any) => { projectStore.mutateProjectPublishState(!project.publish, project.id); };
</script>
