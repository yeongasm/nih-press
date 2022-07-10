<template>
  <div flex flex-row flex-wrap justify-start items-center>
    <div v-for="item in listOfTags" rounded text-white bg-slate-500 flex items-center justify-center p-1 mr-1 mb-1>
      <SmallText text-white># {{ item.tag.value }}</SmallText>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TagProps {
  list: any[]
};
const props = defineProps<TagProps>();
const listOfTags = computed(() => {
  const index: number = props.list.findIndex(item => item.tag.is_primary_tag);
  const temp = Array.from(props.list);
  temp.splice(index, 1);
  return temp;
});
</script>
