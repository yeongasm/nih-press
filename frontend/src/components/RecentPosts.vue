<template>
    <!-- This section is for desktop -->
    <div hidden xl:block w-full bg-white rounded-lg border border-gray-200 p-4>
      <Heading mb-5>Recent Posts</Heading>
      <ArticleContainer :limit="8" :paginate="false" layout="list" />
    </div>
</template>
