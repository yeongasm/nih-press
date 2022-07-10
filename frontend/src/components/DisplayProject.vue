<template>
  <SectionBody mb-5 md:mb-0>
    <BackButton mb-5/>
    <Title mb-5>{{ project.title }}</Title>
    <div w-full mb-10>
      <SubHeading font-bold>Tags</SubHeading>
      <TagList :list="project.project_tags" />
    </div>
    <div v-html="content"></div>
  </SectionBody>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/store/projects.store';
const projectStore = useProjectStore();
const route = useRoute();

const { id } = route.params;
const project = await projectStore.getProjectWithIdPublic(parseInt(id as string));
const content = await projectStore.getProjectContent(project);
</script>
