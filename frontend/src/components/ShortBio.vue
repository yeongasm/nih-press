<template>
  <!-- This section is for desktop -->
  <div hidden xl:flex w-full>
    <div bg-white overflow-hidden rounded-lg border border-gray-200 w-full relative>
      <ImageContainer
        overflow-hidden rounded-t-lg w-full h-30 mb-20
        :img_url="userProfile.profile_banner_url"
      />
      <div absolute left-0 right-0 top-0 h-60 flex items-center justify-center>
        <ImageContainer
          overflow-hidden rounded-full border border-2 border-white-200 w-24 h-24
          :img_url="userProfile.profile_img_url"
        />
      </div>
      <div flex flex-col items-center justify-center mb-10>
        <Heading>{{ userProfile.display_name }}</Heading>
        <Text>Software Engineer</Text>
      </div>
      <div flex flex-col items-end justify-center pr-2 mb-1>
        <div flex flex-row items-center justify-center>
          <div relative pr-1 flex justify-center items-center>
            <transition name="fade">
              <CopySpeechBubble absolute bottom-4 v-if="copyBubble.show" :click_count="copyBubble.click_count" />
            </transition>
            <img w-3 h-3 cursor-pointer @click="emailOnCopy" :src="copyImgUrl"/>
          </div>
          <SmallText>{{ userProfile.email }}</SmallText>
        </div>
        <SmallText>{{ userProfile.location }}</SmallText>
        <div flex flex-row items-end justify-center pt-2>
          <a pr-1 href="https://www.linkedin.com/in/afiqyeong/" target="_blank" hover:cursor-pointer>
            <img w-5 h-5 :src="linkedInImgUrl" />
          </a>
          <a href="https://github.com/yeongasm" target="_blank" hover:cursor-pointer>
            <img w-5 h-5 :src="githubImgUrl" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- This section is for mobile -->
  <div flex w-full mb-5 xl:hidden>
    <div bg-white overflow-hidden rounded-lg border border-gray-200 w-full relative h-48>
      <ImageContainer
        overflow-hidden rounded-t-lg w-full h-24
        :img_url="userProfile.profile_banner_url"
      />
      <div absolute left-0 right-0 top-0 flex flex-col ml-5>
        <ImageContainer
          overflow-hidden rounded-full border border-2 border-white-200 w-24 h-24 mt-12 mb-1
          :img_url="userProfile.profile_img_url"
        />
        <div max-w-24 flex justify-evenly items-center>
          <a href="https://www.linkedin.com/in/afiqyeong/" target="_blank">
            <img w-6 h-6 :src="linkedInImgUrl" />
          </a>
          <a href="https://github.com/yeongasm" target="_blank">
            <img w-6 h-6 :src="githubImgUrl" />
          </a>
          <a :href="`mailto:${email}`">
            <img w-6 h-6 :src="emailImgUrl" />
          </a>
        </div>
      </div>
      <div flex flex-col items-start justify-center ml-33>
        <Heading>{{ userProfile.display_name }}</Heading>
        <SmallText>Software Engineer</SmallText>
        <SmallText>{{ userProfile.location }}</SmallText>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import linkedInImgUrl from '@/assets/linkedin.png';
import githubImgUrl from '@/assets/github.png';
import emailImgUrl from '@/assets/email.png';
import copyImgUrl from '@/assets/copy.png';
import { useUserStore } from '@/store/user.store';

const userStore = useUserStore();
await userStore.getUserProfile();
const userProfile = userStore.userProfile;
const copyBubble = reactive({
  click_count: 0,
  show: false
});

const emailOnCopy = (e: Event): void => {
  e.preventDefault();
  navigator.clipboard.writeText(userProfile.email);
  if (copyBubble.show)
    return;
  copyBubble.click_count++;
  copyBubble.show = true;
  setTimeout(() => copyBubble.show = false, 1500);
};

const email = computed(() => import.meta.env.VITE_USER_EMAIL as string)

</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
