<template>
  <div mt-32>
    <div text-7xl font-bold color-gray-700>Whoops!</div>
    <div text-4xl text-gray-400>404 - Page does not exist.</div>
    <div text-xl text-gray-400>Let's go <Route to="/"><b>Home</b></Route> instead 😉</div>
  </div>
</template>

<route>
{
  meta: {
    layout: "404"
  }
}
</route>
