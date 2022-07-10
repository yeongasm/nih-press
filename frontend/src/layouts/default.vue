<template>
  <!-- Desktop view -->
  <div hidden xl:flex flex-row justify-center w-full>
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
  <div flex flex-col justify--start items-start xl:hidden p-2>
    <NavigationBar />
    <SuspenseWrapper :component="ShortBio" v-if="showShortBioAndTitle"/>
    <div overflow-y-auto w-full mb-15>
      <Title mb-5 v-if="showShortBioAndTitle">{{ routeName }}</Title>
      <router-view />
      <SmallText element="div" text-center>Personal work &#169; Al-Afiq Yeong {{ year }}. Codes are public domain unless specified. Opinions are my own.</SmallText>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShortBio from '@/components/ShortBio.vue';
const currentRoute = computed(() => {
  const subPaths = useRouter().currentRoute.value.path.split('/');
  return "/" + subPaths[1];
});
const routeName = computed(() => {
  const route: string = currentRoute.value.slice(1);
  return !route.length ? "About" : route.charAt(0).toUpperCase() + route.slice(1);
});
const showShortBioAndTitle = computed(() => Object.keys(useRoute().params).length == 0);
const year = computed(() => new Date().getFullYear());
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
