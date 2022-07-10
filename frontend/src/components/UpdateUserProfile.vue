<template>
  <div bg-white overflow-hidden rounded-lg border border-gray-200 w-full relative mb-5>
    <div relative>
      <ImageContainer
        overflow-hidden rounded-t-lg w-full h-30 mb-15
        :img_url="bannerImgUrl"
      />
      <ImageUpload absolute bottom-1 right-1 z-10 @on-input="uploadedImg.banner = $event" @on-delete="uploadedImg.banner = null" />
    </div>
    <div absolute left-0 right-0 top-0 h-60 flex items-center justify-center>
      <div relative>
        <ImageContainer
          overflow-hidden rounded-full border border-2 border-white-200 w-24 h-24 relative
          :img_url="profileImgUrl"
        />
        <ImageUpload absolute bottom-0 right-0 @on-input="uploadedImg.profile = $event" @on-delete="uploadedImg.profile = null" />
      </div>
    </div>
    <div flex flex-col items-center justify-center px-3 mb-4>
      <Input title="Name" w-full mb-1 @on-input="profile.display_name = $event" :default="profile.display_name"/>
      <!-- <Input title="Email" w-full  mb-1 @on-input="profile.email = $event" :default="profile.email"/> -->
      <Input title="Location" w-full  @on-input="profile.location = $event" :default="profile.location"/>
    </div>
    <div flex justify-end items-center mb-3 px-3>
      <Button
        bg-rose-400 hover:bg-rose-300 w-15 mr-2
        class="transition"
        style="padding: calc(1rem / 2)"
        :enable="profileIsUpdated"
        @on-click="profile = { ...userStore.userProfile }; uploadedImg.banner = null; uploadedImg.profile = null;"
      >
        Cancel
      </Button>
      <Button
        bg-green-400 hover:bg-green-300 w-15
        class="transition"
        style="padding: calc(1rem / 2)"
        :enable="profileIsUpdated"
        @on-click="updateProfile"
      >
        <span v-if="!showSpinner">Save</span>
        <div v-else class="w-[40px] h-[24px] spinner">
          <EllipsisSpinner background="#fff" :x="8" :y="8" />
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore, IUpdateUserProfile } from '@/store/user.store';

const userStore = useUserStore();
await userStore.getUserProfile();

let profile = reactive({ ...userStore.userProfile });
const uploadedImg = reactive({
  banner: null,
  profile: null
});

const showSpinner = ref(0);
const profileIsUpdated = computed(() => {
  let hasChanged: boolean = false;
  for (const key in profile) {
    if (profile[key] != userStore.userProfile[key]) {
      hasChanged = true;
      break;
    }
  }
  return ((hasChanged || (uploadedImg.banner != null) || (uploadedImg.profile != null)) && showSpinner.value != 1);
});
const updateProfile = async () => {
  showSpinner.value = 1;
  const imgUrl: any[] = [];

  const upload = async (file: File | null, dst: string): Promise<string> => {
    let result: string = "";
    if (file != null) {
      result = await userStore.uploadDocument(file, dst);
      if (!result) {
        return new Promise<string>(resolve => resolve(""));
      }
    }
    return new Promise<string>(resolve => resolve(result));
  };

  // Try upload banner image.
  {
    const bannerUrl: string = await upload(uploadedImg.banner, "banner");
    bannerUrl.length && imgUrl.push([ "profile_banner_url", bannerUrl ]);
  }

  // Try upload profile image.
  {
    const profileUrl: string = await upload(uploadedImg.profile, "profile");
    profileUrl.length && imgUrl.push([ "profile_img_url", profileUrl ]);
  }

  let update: IUpdateUserProfile = {
    ...((profile.display_name != userStore.userProfile.display_name) && { display_name: profile.display_name}),
    ...((profile.location != userStore.userProfile.location) && { location: profile.location }),
    profile_banner_url: undefined,
    profile_img_url: undefined
  };

  imgUrl.forEach(uploads => update[uploads[0]] = uploads[1]);

  userStore.updateUserProfile(update)
  .finally(() => {
    setTimeout(() => showSpinner.value = 0, 1000)
    profile = reactive({ ...userStore.userProfile });
  });
};
const bannerImgUrl = computed(() => !uploadedImg.banner ? profile.profile_banner_url : URL.createObjectURL(uploadedImg.banner));
const profileImgUrl = computed(() => !uploadedImg.profile ? profile.profile_img_url : URL.createObjectURL(uploadedImg.profile));
</script>

<style scoped>
.transition {
  transition: background-color 0.3s ease-in-out;
}
</style>
