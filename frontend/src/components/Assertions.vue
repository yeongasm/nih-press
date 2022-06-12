<template>
  <div v-if="assertStore.asserts.length" flex flex-col-reverse justify-center items-end z-10 >
    <transition-group name="list" tag="div">
      <AssertCard my-1 v-for="assert in assertStore.asserts" :key="assert" :msg="assert.msg" :type="assert.type" :time="assert.time" :id="assert.id" @on-remove="removeAssert" />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useAssertStore } from '@/store/assert.store';
import AssertCard from './AssertCard.vue';
const assertStore = useAssertStore();
const removeAssert = (id: number) => { assertStore.popAssert(id); };
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  transform: translateX(200px);
  opacity: 0;
}

</style>
