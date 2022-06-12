<template>
  <div flex flex-col items-start justify-center relative border-1 border-rounded-lg :class="colorScheme" w-80 p-5>
    <div absolute top-0 right-0 mt-1 mr-1 w-4 h-4 cursor-pointer @click="$emit('on-remove', props.id)">
      <ImageContainer flex justify-center items-center rounded-full p-1 :img_url="closeImgUrl" :bg="closeBtnBg"/>
    </div>
    <div flex justify-start items-center mb-2>
      <SmallText mr-1 :class="fontColor">{{ typeString }}</SmallText>
      <SmallText :class="fontColor">{{ formatedDate }}</SmallText>
    </div>
    <SmallText text-justify break-all :class="fontColor">{{ props.msg }}</SmallText>
  </div>
</template>

<script setup lang="ts">
import closeImgUrl from '@/assets/close.png';
import { formatDateAs } from '@/util/util';
import SmallText from './SmallText.vue';

const colorScheme = computed(() => {
  return {
    success: "border-green-600 bg-green-100",
    neutral: "border-blue-500	bg-blue-100",
    warning: "border-yellow-600	bg-yellow-100",
    error: "border-pink-700 bg-red-100"
  }[props.type];
});

const fontColor = computed(() => {
  return {
    success: "text-green-600",
    neutral: "text-blue-500",
    warning: "text-yellow-600",
    error: "text-pink-700"
  }[props.type];
});

const closeBtnBg = computed(() => {
  return {
    success: "bg-green-600",
    neutral: "bg-blue-500",
    warning: "bg-yellow-600",
    error: "bg-pink-700"
  }[props.type];
});

const typeString = computed(() => {
  return {
    success: "[SUCCESS]",
    neutral: "[NOTICE]",
    warning: "[WARNING]",
    error: "[ERROR]"
  }[props.type];
});

const formatedDate = computed(() => formatDateAs(props.time, 'DD/MM/YYYY - HH:mm:ss'));

defineEmits([ 'on-remove' ]);
const props = defineProps({
  msg: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator(val: string) {
      return ["success", "neutral", "warning", "error"].includes(val);
    }
  },
  time: {
    type: Date,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
});
</script>
