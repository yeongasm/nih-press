<!-- Taken from https://loading.io/css/ -->
<template>
  <div class="lds-ellipsis" :style="{ 'width': `${props.width}%`, 'height': `${props.height}%` }">
    <div :style="{ 'width': `${props.x}px`, 'height': `${props.y}px`, 'background': props.background }"></div>
    <div :style="{ 'width': `${props.x}px`, 'height': `${props.y}px`, 'background': props.background }"></div>
    <div :style="{ 'width': `${props.x}px`, 'height': `${props.y}px`, 'background': props.background }"></div>
    <div :style="{ 'width': `${props.x}px`, 'height': `${props.y}px`, 'background': props.background, 'left': `calc(100% - ${props.x}px)` }"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  width: { type: Number, default: 100 },  // In percentage, width taken from the parent container.
  height: { type: Number, default: 100 }, // In percentage, height taken from the parent container.
  x: { type: Number, default: 12 }, // In pixels, width of the circle.
  y: { type: Number, default: 12 }, // In pixels, height of the circle.
  background: { type: String, default: "black" } // Circle background color.
})
</script>

<style>
.lds-ellipsis {
  /* display: inline-block; */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* width: 80px; */
  /* height: 80px; */
}
.lds-ellipsis div {
  position: absolute;
  /* top: 33px; */
  /* width: 13px; */
  /* height: 13px; */
  border-radius: 50%;
  /* background: black; */
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 0;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 0;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  /* left: 32px; */
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  /* left: 56px; */
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(200%, 0);
  }
}
</style>
