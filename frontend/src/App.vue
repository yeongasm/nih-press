<template>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

body {
  margin: 0;
  background-color: #f9f9f9;
  font-family: 'Roboto', sans-serif;
}

/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #7a7a7a #ffffff;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-track {
  background: #ffffff00;
}

*::-webkit-scrollbar-thumb {
  background-color: #7a7a7a;
  border-radius: 10px;
}

</style>
