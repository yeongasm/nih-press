<template>
  <div flex flex-col justify-center items-start>
    <VariadicTextSize v-if="props.title" :font_size="props.title_size">{{ props.title }}</VariadicTextSize>
    <div border-1 rounded-lg border-gray-200 w-full box-border relative p-2 :style="input_style">
      <input
        w-full border-0 outline-0 p-0 m-0 focus:border-0 leading-8 color-gray-400 text-sm
        :type="getInputType"
        v-model="input"
        @input="$emit('on-input', input)"
      />
      <div v-if="props.show_eye && input.length" @click="openEyes ^= 1" absolute top-0 bottom-0 right-0 flex justify-center items-center pr-3>
        <ImageContainer w-8 h-8 v-if="openEyes"  :img_url="eyeOpenImgUrl"  />
        <ImageContainer w-8 h-8 v-if="!openEyes" :img_url="eyeCloseImgUrl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import eyeOpenImgUrl from '@/assets/eye_open.png';
import eyeCloseImgUrl from '@/assets/eye_close.png';

const props = defineProps({
  title: { type: String, default: "" },
  default: { type: String, default: "" },
  input_style: {
    type: String,
    default: ""
  },
  title_size: {
    type: String,
    default: "subheading",
    validator(val: string) {
      return ["title", "heading", "subheading", "text", "smalltext"].includes(val);
    }
  },
  type: {
    type: String,
    default: "text",
    validator(val: string) {
      return ["email", "number", "password", "text", "url", "tel"].includes(val);
    }
  },
  show_eye: { type: Boolean, default: false }
});

const input = ref(props.default);
const openEyes = ref(0);

defineEmits(['on-input']);
const getInputType = computed(() => openEyes.value ? "text" : props.type);
</script>
