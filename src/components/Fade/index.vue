<template>
  <Transition @enter="onEnter"
              @leave="onLeave" mode="out-in">
    <slot></slot>
  </Transition>
</template>

<script setup lang="ts">
import anime from "animejs";
const onEnter = (el: { dataset: { index: number; }; }, done: any) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateX: [100, 0],
    easing: 'easeOutElastic',
    duration: 100,
    complete: done,
  })
}
const onLeave = (el: { dataset: { index: number; }; }, done: any) => {
  anime({
    targets: el,
    opacity: [1,0],
    translateX: [100,0],
    duration: 100,
    easing: 'easeOutElastic',
    complete: done,
  })
}
</script>

<style scoped>

</style>