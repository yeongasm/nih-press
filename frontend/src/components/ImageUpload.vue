<template>
  <div rounded-full bg-gray-700 flex justify-center items-center border-1 border-white hover:border-teal-400>
    <div v-if="!hasFile" flex justify-center items-center h-full w-full p-2 cursor-pointer @click="triggerInputClick">
      <img w-3 h-3 :src="imgUrl"/>
      <input ref="input" hidden type="file" accept="image/*" @input="$emit('on-input', $event.target.files[0]); hasFile = true" />
    </div>
    <div v-else flex justify-center items-center h-full w-full p-2 cursor-pointer @click="triggerRemoveClick">
      <img w-3 h-3 :src="closeImgUrl"/>
    </div>
    <!-- <PopupOverlay v-if="showOverlay" @on-exit="cancelUpload">
      <div class="max-w-[50rem]">
        <ImageContainer
          overflow-hidden rounded-t-lg w-full
          :img_url="imageUrl" :vertical="true"
        />
        <div p-3>
          <div>
            <SubHeading color-gray-700>Use the following image?</SubHeading>
            <SmallText>{{ filename }}</SmallText>
          </div>
          <div flex justify-end items-center>
            <Button
              bg-rose-400 hover:bg-rose-300 w-15 mr-2
              class="transition"
              style="padding: calc(1rem / 2)"
              @on-click="cancelUpload"
            >
              No
            </Button>
            <Button
              bg-green-400 hover:bg-green-300 w-15
              class="transition"
              style="padding: calc(1rem / 2)"
              @on-click="proceedUpload"
            >
              Yes
            </Button>
          </div>
        </div>
      </div>
    </PopupOverlay> -->
  </div>
</template>

<script setup lang="ts">
import imgUrl from '@/assets/edit.png';
import closeImgUrl from '@/assets/close.png';
const emit = defineEmits(['on-input', 'on-delete']);
const input = ref(null);
const hasFile = ref(false);
const triggerInputClick = () => {
  if (input)
    input.value.click();
};
const triggerRemoveClick = () => {
  if (input && input.value)
    input.value.value = "";
  emit('on-delete');
  hasFile.value = false;
};
// const listOfFiles = ref(null);
// const imageUrl = computed(() => URL.createObjectURL(listOfFiles.value[0]));
// const showOverlay = ref(false);
// const cancelUpload = () => {
//   listOfFiles.value = null;
//   showOverlay.value = false;
//   input.value.value = "";
// };
// const proceedUpload = () => {
//   input.value.value = "";
//   showOverlay.value = false;
//   emit('on-input', listOfFiles.value);
//   listOfFiles.value = null;
// }
// let filename = computed(() => input.value.value.substring(input.value.value.lastIndexOf('\\') + 1));
</script>

<style scoped>
.transition {
  transition: background-color 0.3s ease-in-out;
}
</style>
