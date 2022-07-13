<template>
  <div flex flex-col md:grid md:grid-cols-3 md:gap-2 mb-3 xl:mb-0 v-if="userProjects.length">
    <div v-for="project of userProjects"
      first-of-type:mt-0 my-4 md:my-0 bg-white rounded-lg border-1 border-gray-200 hover:border-blue-300 cursor-pointer
      @click="router.push(`/projects/${project.id}`)"
    >
      <ImageContainer
        overflow-hidden rounded-t-lg w-full h-32 max-h-32 mb-5
        :img_url="project.banner_img_url"
      />
      <div p-2>
        <SubHeading font-bold mb-4>{{ project.title }}</SubHeading>
        <TagList mb-2 :list="project.project_tags" />
        <SmallText text-justify>{{ project.description }}</SmallText>
      </div>
    </div>
  </div>
  <WowSuchEmpty v-else />
</template>

<script setup lang="ts">
import { useProjectStore } from '@/store/projects.store';
const projectStore = useProjectStore();
const router = useRouter();

interface ProjectContainerProps {
  limit?: number,
  paginate: boolean,
  is_home_screen: boolean
};

const props = defineProps<ProjectContainerProps>();
const userProjects: any = computed(() => props.is_home_screen ? Array.from(projectStore.homseScreenProjects).splice(0, props?.limit || 5) : projectStore.publicProjects);

</script>
