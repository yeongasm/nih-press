<template>
  <suspense>
    <component :is="prop.component" />
    <template #fallback>
      <div>
        <!-- TODO: -->
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
const prop = defineProps([ 'component' ]);
</script>
