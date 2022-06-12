<template>
  <!-- Desktop view -->
  <div hidden md:flex flex-row justify-center w-full>
    <div gap-2 grid xl:gap-4 mt-16 class="grid-cols-[0.5fr_2fr_0.5fr] app-container">
      <div>
        <SuspenseWrapper :component="ShortBio"/>
      </div>
      <div class="center-container">
        <NavigationBar/>
        <div overflow-y-auto class="main-container">
          <router-view />
        </div>
      </div>
      <div>
        <RecentPosts/>
      </div>
    </div>
    <Footer/>
  </div>
  <!-- Mobile view -->
</template>

<script setup lang="ts">
import ShortBio from '@/components/ShortBio.vue';
</script>

<style>
.app-container {
  width: 60%;
}

.center-container {
  max-height: calc(100vh - 16rem);
}

.main-container {
  max-height: calc(100vh - 10rem);
}

@media only screen and (min-width: 1921px) {
  .app-container {
    width: 60%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
