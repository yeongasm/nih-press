<template>
  <SectionBody mb-5 md:mb-0 v-if="project != null">
    <BackButton mb-5/>
    <Title mb-5>{{ project.title }}</Title>
    <div w-full mb-10>
      <SubHeading font-bold>Tags</SubHeading>
      <TagList :list="project.project_tags" />
    </div>
    <div v-html="content"></div>
  </SectionBody>
  <SectionBody v-else>
    <NoContent/>
  </SectionBody>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/store/projects.store';
const projectStore = useProjectStore();
const route = useRoute();

let _content: any = null;
let _project: any = null;
const { tag } = route.params;

const index: number = projectStore.publicProjects.findIndex((project: any) => project.tag == tag);

if (index == -1) {
  _project = await projectStore.getProjectWithTagPublic(tag as string);
} else {
  _project = projectStore.publicProjects[index];
}

if (_project != null)
  _content = await projectStore.getProjectContent(_project);

const content = computed(() => _content || null);
const project = computed(() => _project || null);

</script>
