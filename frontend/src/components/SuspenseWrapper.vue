<template>
  <suspense>
    <component :is="prop.component" v-bind="prop.bindings" />
    <template #fallback>
      <div w-full flex justify-center items-center>
        <ImageContainer max-w-md :img_url="wowSuchEmptyImgUrl" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
import wowSuchEmptyImgUrl from '@/assets/wow_such_empty.jpeg';
const prop = defineProps([ 'component', 'bindings' ]);
</script>
