<template>
    <!-- For desktop view -->
    <div hidden xl:flex flex-row justify-evenly bg-white rounded-lg border border-gray-200 py-2 mb-4>
        <Route to="/">Home</Route>
        <Route to="/resume">Resume</Route>
        <Route to="/projects">Projects</Route>
        <Route to="/articles">Articles</Route>
    </div>
    <!-- For mobile view -->
    <div fixed bottom-0 left-0 right-0 z-10 flex justify-evenly items-center h-12 class="bg-[#38383D]" xl:hidden>
      <Route to="/" :class="(currentRoute == '/')?'rounded-full bg-white w-10 h-10 flex justify-center items-center':''">
        <font-awesome-icon :class="(currentRoute == '/')?'text-[#4e4e50]':''" icon="fa-solid fa-user" :size="(currentRoute == '/')?'xl':'lg'" />
      </Route>
      <Route to="/resume" :class="(currentRoute == '/resume')?'rounded-full bg-white w-10 h-10 flex justify-center items-center':''">
        <font-awesome-icon :class="(currentRoute == '/resume')?'text-[#4e4e50]':''" icon="fa-solid fa-file" :size="(currentRoute == '/resume')?'xl':'lg'" />
      </Route>
      <Route to="/projects" :class="(currentRoute == '/projects')?'rounded-full bg-white w-10 h-10 flex justify-center items-center':''">
        <font-awesome-icon :class="(currentRoute == '/projects')?'text-[#4e4e50]':''" icon="fa-solid fa-flask" :size="(currentRoute == '/projects')?'xl':'lg'" />
      </Route>
      <Route to="/articles" :class="(currentRoute == '/articles')?'rounded-full bg-white w-10 h-10 flex justify-center items-center':''">
        <font-awesome-icon :class="(currentRoute == '/articles')?'text-[#4e4e50]':''" icon="fa-solid fa-book" :size="(currentRoute == '/articles')?'xl':'lg'" />
      </Route>
    </div>
</template>

<script setup lang="ts">
const currentRoute = computed(() => {
  const subPaths = useRouter().currentRoute.value.path.split('/');
  return "/" + subPaths[1];
});
</script>
