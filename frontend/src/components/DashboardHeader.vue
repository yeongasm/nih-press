<template>
  <div fixed top-0 left-0 right-0 z-10 p-2 flex justify-center items-center bg-gray-700>
    <div flex justify-center items-center w="3/5">
      <div w="1/2" flex justify-between space-center>
        <Route to="/dashboard"><SmallText>Home</SmallText></Route>
        <Route to="/dashboard/articles"><SmallText>Articles</SmallText></Route>
        <Route to="/dashboard/projects"><SmallText>Projects</SmallText></Route>
        <Route to="/dashboard/groups"><SmallText>Groups</SmallText></Route>
      </div>
      <SmallText @click="tryLogout" ml-auto cursor-pointer>Logout</SmallText>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logOut } from '@/store/user.store';
const router = useRouter();
const tryLogout = () => {
  logOut();
  router.push("/login");
};
</script>
