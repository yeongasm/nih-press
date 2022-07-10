<template>
  <DashboardHeader />
  <div mt-15 w-full flex justify-center>
    <div gap-2 grid xl:gap-4 class="grid-cols-[0.65fr_3.35fr] w-[80%]">
      <div flex flex-col items-center justify-start w-full>
        <SuspenseWrapper :component="UpdateUserProfile" />
      </div>
      <div relative>
        <router-view />
        <Assertions fixed bottom-0 right-0 mb-15 mr-15 />
      </div>
    </div>
  </div>
  <Footer/>
</template>

<script setup lang="ts">
import UpdateUserProfile from '@/components/UpdateUserProfile.vue';
</script>

<style>
.ql-toolbar {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
.ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  max-height: 500px;
  overflow-y: auto;
}
</style>
