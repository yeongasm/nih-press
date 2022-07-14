<template>
  <suspense>
    <component :is="prop.component" v-bind="prop.bindings" />
    <template #fallback>
      <div w-full flex justify-center items-center>
        <div w-32 h-10>
          <EllipsisSpinner background="#fff" :x="10" :y="10" />
        </div>
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
const prop = defineProps([ 'component', 'bindings' ]);
</script>
