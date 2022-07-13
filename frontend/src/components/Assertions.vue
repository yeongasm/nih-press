<template>
  <div v-if="assertStore.asserts.length" flex flex-col-reverse justify-center items-end z-10 >
    <Button
      bg-rose-400 hover:bg-rose-300 w-15 mt-4
      class="transition"
      font_size="smalltext"
      style="padding: calc(1rem / 2); border-radius: 0.5rem"
      @on-click="assertStore.removeAll()"
    >
      Remove All
    </Button>
    <transition-group name="list" tag="div">
      <AssertCard my-1 v-for="assert in assertStore.asserts" :msg="assert.msg" :type="assert.type" :time="assert.time" :id="assert.id" @on-remove="removeAssert" />
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

.transition {
  transition: background-color 0.3s ease-in-out;
}
</style>
