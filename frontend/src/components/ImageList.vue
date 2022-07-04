<template>
  <PopupOverlay v-if="showPopup" @on-exit="onImagePreviewClose()">
    <ImageContainer
      overflow-hidden rounded-t-lg class="max-w-[48rem]"
      :img_url="imageUrl"
    />
    <div p-3>
      <SubHeading>Upload the following image?</SubHeading>
      <Text>{{ uploadingImage.name }}</Text>
    </div>
    <div w-full flex items-center justify-end>
      <div m-3 flex >
        <Button
          bg-rose-400 hover:bg-rose-300 w-15 mr-2
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2); border-radius: 0.5rem"
          @on-click="onImagePreviewClose()"
        >
          Cancel
        </Button>
        <Button
          bg-green-400 hover:bg-green-300 w-15
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2);  border-radius: 0.5rem"
          :listen_to_enter="true"
          @on-click="tryUploadImage()"
        >
          <span v-if="!showSpinner">Save</span>
          <div v-else class="w-[40px] h-[24px] spinner">
            <EllipsisSpinner background="#fff" :x="8" :y="8" />
          </div>
        </Button>
      </div>
    </div>
  </PopupOverlay>
  <SectionBody>
    <Title mb-4>Image(s) for tag &lt;{{ props.tag.key }}&gt; [ id: {{ props.tag.id }} ]</Title>
    <Text mb-4>Shows a list of images that are tied to the current tag. You can also upload images and associate them with the selected tag.</Text>
    <div flex items-center justify-end mt-5 mb-2>
      <Button
        bg-blue-400 hover:bg-blue-300 relative
        class="transition"
        font_size="smalltext"
        style="padding: calc(1rem / 2); border-radius: 0.5rem"
        @on-click="triggerInputClick()"
      >
        Upload Image(s)
        <input ref="input" hidden type="file" accept="image/*" @input="uploadingImage = $event.target.files[0]; showPopup = true;" />
      </Button>
    </div>
    <Table
      v-if="documentStore.imagesWithTag.length"
      :fixed="true"
      :columns="['id', 'original_filename', 'extension', 'url', 'uploaded_at']"
      :alias="{ id: 'ID', original_filename: 'Filename', extension: 'Extension', url: 'URL', uploaded_at: 'Uploaded At' }"
      :configuration="{
        uploaded_at: {
          type: 'date',
          format: 'dddd DD/MM/YYYY - HH:mm:ss'
        }
      }"
      :data="documentStore.imagesWithTag"
    />
  </SectionBody>
</template>

<script setup lang="ts">
import { useDocumentStore } from '@/store/documents.store';
const documentStore = useDocumentStore();

const props = defineProps({
  tag: {
    type: Object,
    required: true
  }
});

documentStore.getImagesTaggedWith(props.tag.id, {});

const emit = defineEmits(['on-close', 'on-submit']);

const showPopup = ref(false);
const showSpinner = ref(false);

const input = ref(null);
const uploadingImage = ref();

const triggerInputClick = () => {
  if (input)
    input.value.click();
};

const onImagePreviewClose = () => {
  showPopup.value = false;
  if (input)
    input.value.value = "";
  emit('on-close');
};

const imageUrl = computed(() => !uploadingImage.value ? "" : URL.createObjectURL(uploadingImage.value));

const tryUploadImage = () => {
  showSpinner.value = true;
  documentStore.uploadImageTaggedWith(uploadingImage.value, props.tag.id)
  .then(() => {
    showSpinner.value = false;
    onImagePreviewClose();
  });
};

</script>
