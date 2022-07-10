<template>
  <div border border-1 border-gray-200 rounded-xl p-2 my-2>
    <div flex flex-row justify-start items-center>
      <SubHeading font-bold color-gray-600>{{ props.company }}</SubHeading>
      <div ml-auto>
        <SmallText element="span">{{ props.from }}</SmallText>
        <SmallText element="span"> - </SmallText>
        <SmallText element="span" :class="{ 'font-bold': isPresentJob }">{{ props.to }}</SmallText>
      </div>
    </div>
    <div flex flex-col justify-center items-start>
      <Text pb-1 font-bold>{{ props.title }}</Text>
      <SmallText text-justify v-if="props.description.length">{{ props.description }}</SmallText>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  company: { type: String, required: true },
  from: String,
  to: String,
  description: { type: String, default: "" }
});
const isPresentJob = computed(() => props.to?.toLocaleLowerCase() == "present" );
</script>
